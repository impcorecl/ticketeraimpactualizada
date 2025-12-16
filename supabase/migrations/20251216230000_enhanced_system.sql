-- Migración completa del sistema mejorado
-- Actualización de tipos de tickets según CSV

-- Primero limpiar datos existentes para fresh start
DELETE FROM public.tickets;
DELETE FROM public.ticket_types;

-- Actualizar tipos de tickets según la proyección CSV
INSERT INTO public.ticket_types (name, description, price, people_per_ticket, total_stock) VALUES
  ('PREVENTA', 'ACCESO HASTA LAS 00:00', 5000, 1, 25),
  ('PROMO 2X (10)', 'ACCESO HASTA LAS 00:00', 8000, 2, 10),
  ('PROMO 4X (5)', 'ACCESO HASTA LAS 00:00', 15000, 4, 3),
  ('PROMO 4X (5) BOT', '4 BOTELLAS DE AGUA, GUARDARROPIA INCLUIDA ACCESO HASTA LAS 01:00', 25000, 4, 3),
  ('PREVENTA 2', 'ACCESO HASTA LAS 01:30', 8000, 1, 25),
  ('PROMO 2X (10)', 'ACCESO HASTA LAS 01:30', 15000, 2, 10),
  ('PROMO 4X (5)', 'ACCESO HASTA LAS 01:30', 25000, 4, 3),
  ('PROMO 4X (5) BOT', '4 BOTELLAS DE AGUA, GUARDARROPIA INCLUIDA ACCESO HASTA LAS 02:00', 35000, 4, 3),
  ('GENERAL', 'Sin límite de horario', 10000, 1, 20);

-- Tabla de usuarios/administradores
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'operator')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de embajadores
CREATE TABLE public.ambassadors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  commission_rate DECIMAL DEFAULT 0.10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de clientes/compradores
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de ventas (link entre tickets y compradores)
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  ambassador_id UUID REFERENCES public.ambassadors(id),
  sale_price DECIMAL NOT NULL,
  commission_amount DECIMAL DEFAULT 0,
  payment_method TEXT DEFAULT 'cash',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Actualizar tabla tickets para incluir referencia de venta
ALTER TABLE public.tickets ADD COLUMN sale_id UUID REFERENCES public.sales(id);

-- Índices para performance
CREATE INDEX idx_sales_customer_id ON public.sales(customer_id);
CREATE INDEX idx_sales_ambassador_id ON public.sales(ambassador_id);
CREATE INDEX idx_sales_created_at ON public.sales(created_at);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_ambassadors_email ON public.ambassadors(email);

-- Habilitar RLS para nuevas tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (acceso público por ahora, luego se restringe con auth)
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public access ambassadors" ON public.ambassadors FOR ALL USING (true);
CREATE POLICY "Allow public access customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow public access sales" ON public.sales FOR ALL USING (true);

-- Función para crear venta completa (atómica)
CREATE OR REPLACE FUNCTION public.create_complete_sale(
  ticket_type_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT DEFAULT NULL,
  ambassador_id UUID DEFAULT NULL,
  payment_method TEXT DEFAULT 'cash',
  notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ticket_record RECORD;
  customer_record RECORD;
  sale_record RECORD;
  ticket_type_record RECORD;
  commission DECIMAL := 0;
  result JSON;
BEGIN
  -- Verificar disponibilidad de stock
  SELECT * INTO ticket_type_record
  FROM public.ticket_types
  WHERE id = ticket_type_id;

  IF ticket_type_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Tipo de ticket no existe'
    );
  END IF;

  -- Verificar stock disponible
  IF (
    SELECT COUNT(*) 
    FROM public.tickets t
    WHERE t.ticket_type_id = ticket_type_id
  ) >= ticket_type_record.total_stock THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Sin stock disponible'
    );
  END IF;

  -- Crear o buscar cliente
  INSERT INTO public.customers (name, email, phone)
  VALUES (customer_name, customer_email, customer_phone)
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    phone = COALESCE(EXCLUDED.phone, customers.phone)
  RETURNING * INTO customer_record;

  -- Crear ticket
  INSERT INTO public.tickets (ticket_type_id, status)
  VALUES (ticket_type_id, 'valid')
  RETURNING * INTO ticket_record;

  -- Calcular comisión si hay embajador
  IF ambassador_id IS NOT NULL THEN
    SELECT commission_rate INTO commission
    FROM public.ambassadors
    WHERE id = ambassador_id AND is_active = true;
    
    IF commission IS NULL THEN
      commission := 0;
    ELSE
      commission := ticket_type_record.price * commission;
    END IF;
  END IF;

  -- Crear venta
  INSERT INTO public.sales (
    ticket_id,
    customer_id,
    ambassador_id,
    sale_price,
    commission_amount,
    payment_method,
    notes
  )
  VALUES (
    ticket_record.id,
    customer_record.id,
    ambassador_id,
    ticket_type_record.price,
    commission,
    payment_method,
    notes
  )
  RETURNING * INTO sale_record;

  -- Actualizar ticket con sale_id
  UPDATE public.tickets
  SET sale_id = sale_record.id
  WHERE id = ticket_record.id;

  -- Retornar resultado exitoso
  RETURN json_build_object(
    'success', true,
    'ticket_id', ticket_record.id,
    'customer_id', customer_record.id,
    'sale_id', sale_record.id,
    'commission_amount', commission
  );
END;
$$;

-- Función para obtener reporte completo de ventas
CREATE OR REPLACE FUNCTION public.get_sales_report()
RETURNS TABLE (
  ticket_id UUID,
  ticket_type_name TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  ambassador_name TEXT,
  sale_price DECIMAL,
  commission_amount DECIMAL,
  payment_method TEXT,
  ticket_status TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as ticket_id,
    tt.name as ticket_type_name,
    c.name as customer_name,
    c.email as customer_email,
    c.phone as customer_phone,
    a.name as ambassador_name,
    s.sale_price,
    s.commission_amount,
    s.payment_method,
    t.status as ticket_status,
    t.scanned_at,
    s.created_at
  FROM public.sales s
  JOIN public.tickets t ON s.ticket_id = t.id
  JOIN public.ticket_types tt ON t.ticket_type_id = tt.id
  JOIN public.customers c ON s.customer_id = c.id
  LEFT JOIN public.ambassadors a ON s.ambassador_id = a.id
  ORDER BY s.created_at DESC;
END;
$$;

-- Habilitar realtime para nuevas tablas
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ambassadors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;

-- Insertar usuario admin
INSERT INTO public.users (email, username, password_hash, role)
VALUES (
  'Impcorecl@gmail.com',
  'ImpcoreRecords.vina',
  crypt('Immersive.2025$$', gen_salt('bf')),
  'admin'
);

-- Función de autenticación
CREATE OR REPLACE FUNCTION public.authenticate_user(
  username_input TEXT,
  password_input TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
BEGIN
  SELECT * INTO user_record
  FROM public.users
  WHERE username = username_input OR email = username_input;

  IF user_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Usuario no encontrado'
    );
  END IF;

  -- Verificar contraseña usando crypt
  IF user_record.password_hash = crypt(password_input, user_record.password_hash) THEN
    RETURN json_build_object(
      'success', true,
      'user_id', user_record.id,
      'email', user_record.email,
      'username', user_record.username,
      'role', user_record.role,
      'created_at', user_record.created_at
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'message', 'Contraseña incorrecta'
    );
  END IF;
END;
$$;

-- Insertar algunos embajadores de ejemplo
INSERT INTO public.ambassadors (name, email, commission_rate, is_active) VALUES
  ('Embajador Principal', 'embajador1@impcore.cl', 0.10, true),
  ('Promotor Digital', 'embajador2@impcore.cl', 0.10, true),
  ('Street Team', 'embajador3@impcore.cl', 0.08, true);