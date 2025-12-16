-- Tabla de tipos de tickets (catálogo)
CREATE TABLE public.ticket_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  people_per_ticket INT NOT NULL DEFAULT 1,
  total_stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de tickets individuales (códigos QR)
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_type_id UUID NOT NULL REFERENCES public.ticket_types(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'used', 'revoked')),
  scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para mejor performance
CREATE INDEX idx_tickets_ticket_type_id ON public.tickets(ticket_type_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);

-- Habilitar RLS
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (acceso público para MVP - en producción agregar autenticación)
CREATE POLICY "Allow public read ticket_types" ON public.ticket_types FOR SELECT USING (true);
CREATE POLICY "Allow public insert ticket_types" ON public.ticket_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update ticket_types" ON public.ticket_types FOR UPDATE USING (true);

CREATE POLICY "Allow public read tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Allow public insert tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tickets" ON public.tickets FOR UPDATE USING (true);

-- Función RPC de validación atómica
CREATE OR REPLACE FUNCTION public.validate_ticket_scan(ticket_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ticket_record RECORD;
  ticket_type_record RECORD;
  result JSON;
BEGIN
  -- Buscar el ticket con bloqueo para evitar condiciones de carrera
  SELECT t.*, tt.name as type_name, tt.description, tt.people_per_ticket
  INTO ticket_record
  FROM public.tickets t
  JOIN public.ticket_types tt ON t.ticket_type_id = tt.id
  WHERE t.id = ticket_uuid
  FOR UPDATE OF t;

  -- Si no existe el ticket
  IF ticket_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'TICKET NO EXISTE ❌'
    );
  END IF;

  -- Si el ticket ya fue usado
  IF ticket_record.status = 'used' THEN
    RETURN json_build_object(
      'success', false,
      'message', 'TICKET YA USADO ⚠️',
      'scanned_at', ticket_record.scanned_at
    );
  END IF;

  -- Si el ticket fue revocado
  IF ticket_record.status = 'revoked' THEN
    RETURN json_build_object(
      'success', false,
      'message', 'TICKET REVOCADO ⛔'
    );
  END IF;

  -- Ticket válido - actualizar estado atómicamente
  UPDATE public.tickets
  SET status = 'used', scanned_at = NOW()
  WHERE id = ticket_uuid;

  -- Retornar éxito con información del ticket
  RETURN json_build_object(
    'success', true,
    'message', 'ACCESO PERMITIDO ✅',
    'people_per_ticket', ticket_record.people_per_ticket,
    'description', ticket_record.description,
    'ticket_type', ticket_record.type_name
  );
END;
$$;

-- Habilitar realtime para tickets
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_types;

-- Insertar datos de ejemplo
INSERT INTO public.ticket_types (name, description, price, people_per_ticket, total_stock) VALUES
  ('ENTRADA GENERAL', 'Entrada estándar, 1 persona', 15.00, 1, 500),
  ('PROMO 2X1', 'Promoción 2 personas por ticket', 25.00, 2, 100),
  ('PROMO 4X (5) BOT', '4 BOTELLAS, HASTA 01:00 AM - 4 personas', 120.00, 4, 50),
  ('VIP MESA', 'Mesa VIP con servicio, hasta 6 personas', 300.00, 6, 20);