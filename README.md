# 🎵 Ticketera Impcore Records

Sistema completo de gestión de tickets para eventos con funcionalidades avanzadas de ventas, gestión de clientes y embajadores.

## 🚀 Características Principales

- ✅ **Sistema de autenticación** seguro para administradores
- ✅ **Generación de tickets** con códigos QR únicos
- ✅ **Validación de tickets** mediante scanner QR o entrada manual
- ✅ **Gestión completa de clientes** con base de datos exportable
- ✅ **Sistema de embajadores** con cálculo automático de comisiones (10%)
- ✅ **Envío automático de tickets por email** con diseño profesional tipo Passline
- ✅ **Exportación de datos** a Excel/CSV para marketing
- ✅ **Dashboard en tiempo real** con estadísticas de ventas
- ✅ **Responsive design** - funciona perfectamente en móviles

## 🎫 Tipos de Tickets

Configurado según tu proyección de ventas:

- **PREVENTA** - $5,000 (1 persona) - 25 tickets
- **PROMO 2X (10)** - $8,000 (2 personas) - 10 tickets  
- **PROMO 4X (5)** - $15,000 (4 personas) - 3 tickets
- **PROMO 4X (5) BOT** - $25,000 (4 personas + 4 botellas) - 3 tickets
- **PREVENTA 2** - $8,000 (1 persona hasta 01:30) - 25 tickets
- **GENERAL** - $10,000 (1 persona sin límite) - 20 tickets

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/ui
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Sistema personalizado con bcrypt
- **Formularios**: React Hook Form + Zod validation
- **QR Codes**: qrcode library + html5-qrcode scanner
- **Exportación**: XLSX library
- **Emails**: Templates HTML personalizados

## 📦 Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/impcorecl/ticketera-impcore.git
cd ticketera-impcore

# Instalar dependencias
npm install

# Configurar Supabase (crear proyecto en supabase.com)
# Copiar .env.example a .env.local y configurar:
# VITE_SUPABASE_URL=tu_url_de_supabase
# VITE_SUPABASE_ANON_KEY=tu_clave_anonima

# Ejecutar migraciones (requiere Docker Desktop)
npx supabase db reset

# Iniciar desarrollo
npm run dev
```

## 🔑 Credenciales de Admin

- **Email**: `Impcorecl@gmail.com`
- **Usuario**: `ImpcoreRecords.vina`  
- **Contraseña**: `Immersive.2025$$`

## 📱 Secciones del Sistema

### 📊 Dashboard
- Estadísticas en tiempo real de ventas
- Formulario completo de generación de tickets
- Control de stock por tipo de ticket

### 📷 Escáner
- Validación por QR Code con cámara
- Entrada manual de UUID
- Feedback visual inmediato (verde/rojo)
- Registro automático de ingresos

### 🗃️ Base de Datos
- Lista completa de clientes y ventas
- Búsqueda avanzada y filtros
- Edición en tiempo real de datos
- **Exportación Excel/CSV** para mailing

### 👥 Embajadores
- CRUD completo de embajadores
- Configuración de comisiones personalizables
- Ranking de performance y ventas
- Cálculo automático de comisiones (10% default)

## 💼 Sistema de Ventas Completo

Cada venta captura:
- ✅ Datos del cliente (nombre, email, teléfono)
- ✅ Selección de embajador y comisión automática
- ✅ Método de pago (efectivo, transferencia, tarjeta, digital)
- ✅ Notas personalizadas
- ✅ Generación automática de QR único
- ✅ Envío por email con diseño profesional

## 📧 Sistema de Emails

Cada ticket se envía automáticamente por email con:
- 🎨 Diseño profesional tipo Passline
- 📱 QR Code embebido para uso offline  
- ✨ Branding Impcore Records
- 📋 Información completa del evento
- 📖 Instrucciones de uso claras

## 📈 Exportación para Marketing

### Exportar Todo
- Base de datos completa con historial de ventas
- Información de embajadores y comisiones
- Métodos de pago y notas

### Exportar Solo Clientes  
- Base optimizada para campañas de mailing
- Datos únicos por email
- Estadísticas de compra por cliente
- Segmentación por valor gastado

## 🔒 Seguridad

- 🔐 Autenticación obligatoria para acceder
- ✅ Validación de tickets atómica (previene doble uso)
- 🛡️ Sanitización de inputs
- 🔑 Tokens de sesión seguros

## 📞 Contacto y Soporte

- **Email**: Impcorecl@gmail.com
- **GitHub**: https://github.com/impcorecl
- **Desarrollado para**: Impcore Records

---

**🎵 Desarrollado con ❤️ para Impcore Records** 

> Sistema profesional de ticketing listo para eventos en vivo
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
