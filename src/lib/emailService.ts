// Utility para generar el HTML del email estilo Passline
export function generateTicketEmailHTML(ticketData: {
  ticketId: string;
  ticketType: string;
  customerName: string;
  eventName: string;
  qrCodeDataUrl: string;
  price: number;
  people_per_ticket: number;
  description?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu Ticket - Impcore Records</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f8f9fa; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
        }
        .header h1 { 
            font-size: 32px; 
            font-weight: 800; 
            margin-bottom: 8px; 
            letter-spacing: -0.5px; 
        }
        .header p { 
            font-size: 18px; 
            opacity: 0.9; 
            font-weight: 300; 
        }
        .ticket-section { 
            padding: 40px 30px; 
            text-align: center; 
            border-bottom: 2px dashed #e9ecef; 
        }
        .ticket-title { 
            font-size: 24px; 
            font-weight: 700; 
            color: #495057; 
            margin-bottom: 10px; 
        }
        .ticket-subtitle { 
            font-size: 16px; 
            color: #6c757d; 
            margin-bottom: 30px; 
        }
        .qr-container { 
            background: white; 
            padding: 20px; 
            border-radius: 16px; 
            display: inline-block; 
            box-shadow: 0 8px 25px rgba(0,0,0,0.15); 
            margin-bottom: 30px; 
        }
        .qr-container img { 
            width: 200px; 
            height: 200px; 
            border-radius: 8px; 
        }
        .ticket-info { 
            background: #f8f9fa; 
            border-radius: 12px; 
            padding: 25px; 
            margin: 30px 0; 
        }
        .info-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
        }
        .info-row:last-child { 
            border-bottom: none; 
        }
        .info-label { 
            font-weight: 600; 
            color: #6c757d; 
            font-size: 14px; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
        }
        .info-value { 
            font-weight: 700; 
            color: #212529; 
            font-size: 16px; 
        }
        .price-highlight { 
            color: #28a745; 
            font-size: 20px; 
        }
        .people-highlight { 
            color: #007bff; 
            font-size: 20px; 
        }
        .uuid-section { 
            background: #343a40; 
            color: white; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
        .uuid-label { 
            font-size: 12px; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
            opacity: 0.7; 
            margin-bottom: 8px; 
        }
        .uuid-code { 
            font-family: 'Courier New', monospace; 
            font-size: 14px; 
            word-break: break-all; 
            background: rgba(255,255,255,0.1); 
            padding: 10px; 
            border-radius: 4px; 
        }
        .instructions { 
            background: #e3f2fd; 
            border-left: 4px solid #2196f3; 
            padding: 20px; 
            margin: 30px 0; 
        }
        .instructions h3 { 
            color: #1976d2; 
            font-size: 18px; 
            margin-bottom: 10px; 
        }
        .instructions p { 
            color: #424242; 
            margin-bottom: 8px; 
        }
        .footer { 
            background: #212529; 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .footer h3 { 
            color: #ffffff; 
            margin-bottom: 15px; 
            font-size: 20px; 
        }
        .footer p { 
            color: #adb5bd; 
            margin-bottom: 8px; 
        }
        .social-links { 
            margin-top: 20px; 
        }
        .social-links a { 
            color: #ffffff; 
            text-decoration: none; 
            margin: 0 10px; 
            font-weight: 600; 
        }
        .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            color: #856404; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 20px 0; 
            font-size: 14px; 
        }
        
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 12px; }
            .header { padding: 30px 20px; }
            .header h1 { font-size: 24px; }
            .ticket-section { padding: 30px 20px; }
            .info-row { flex-direction: column; align-items: flex-start; }
            .info-value { margin-top: 5px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎵 IMPCORE RECORDS</h1>
            <p>Tu ticket está listo</p>
        </div>

        <!-- Ticket Section -->
        <div class="ticket-section">
            <div class="ticket-title">${ticketData.ticketType}</div>
            <div class="ticket-subtitle">Evento: ${ticketData.eventName}</div>
            
            <div class="qr-container">
                <img src="${ticketData.qrCodeDataUrl}" alt="Código QR del Ticket" />
            </div>

            <div class="ticket-info">
                <div class="info-row">
                    <span class="info-label">Cliente</span>
                    <span class="info-value">${ticketData.customerName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Precio Pagado</span>
                    <span class="info-value price-highlight">$${ticketData.price.toLocaleString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Personas Incluidas</span>
                    <span class="info-value people-highlight">${ticketData.people_per_ticket} ${ticketData.people_per_ticket === 1 ? 'persona' : 'personas'}</span>
                </div>
                ${ticketData.description ? `
                <div class="info-row">
                    <span class="info-label">Detalles</span>
                    <span class="info-value">${ticketData.description}</span>
                </div>
                ` : ''}
            </div>

            <div class="uuid-section">
                <div class="uuid-label">Código UUID del Ticket</div>
                <div class="uuid-code">${ticketData.ticketId}</div>
            </div>
        </div>

        <!-- Instructions -->
        <div class="instructions">
            <h3>📱 Instrucciones de Uso</h3>
            <p><strong>• Descarga este email</strong> en tu teléfono para acceso offline</p>
            <p><strong>• Presenta el código QR</strong> en la entrada del evento</p>
            <p><strong>• El ticket es de uso único</strong> y no se puede duplicar</p>
            <p><strong>• Llega con anticipación</strong> para evitar filas</p>
        </div>

        <div class="warning">
            <strong>⚠️ Importante:</strong> Este ticket es personal e intransferible. Guárdalo en un lugar seguro y no lo compartas en redes sociales.
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3>IMPCORE RECORDS</h3>
            <p>Experiencias musicales únicas</p>
            <p>Para soporte: Impcorecl@gmail.com</p>
            <div class="social-links">
                <a href="https://instagram.com/impcore.records">Instagram</a>
                <a href="mailto:Impcorecl@gmail.com">Email</a>
            </div>
        </div>
    </div>
</body>
</html>
  `.trim();
}

// Función para enviar email (simulada por ahora)
export async function sendTicketEmail(emailData: {
  to: string;
  customerName: string;
  ticketId: string;
  ticketType: string;
  price: number;
  people_per_ticket: number;
  description?: string;
  qrCodeDataUrl: string;
}) {
  const emailHTML = generateTicketEmailHTML({
    ...emailData,
    eventName: "Fiesta Impcore Records",
  });

  console.log("Email HTML generado:", emailHTML);
  
  // Método 1: Resend API (recomendado para producción)
  const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
  
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Impcore Records <onboarding@resend.dev>',
          to: [emailData.to],
          subject: `🎵 Tu Ticket: ${emailData.ticketType} - Impcore Records`,
          html: emailHTML,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          messageId: result.id,
          message: `Ticket enviado correctamente a ${emailData.to}`
        };
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error enviando email');
      }
    } catch (error: any) {
      console.error('Error con Resend:', error);
      
      // Fallback a EmailJS si falla Resend
      return sendWithEmailJS(emailData, emailHTML);
    }
  }
  
  // Método 2: EmailJS (funciona desde el browser, no requiere backend)
  return sendWithEmailJS(emailData, emailHTML);
}

async function sendWithEmailJS(emailData: any, emailHTML: string) {
  try {
    // Usar EmailJS para envío directo desde el cliente
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_impcore', // Necesitas configurar esto en EmailJS
        template_id: 'template_ticket', // Necesitas configurar esto en EmailJS
        user_id: 'YOUR_EMAILJS_USER_ID', // Necesitas configurar esto
        template_params: {
          to_email: emailData.to,
          to_name: emailData.customerName,
          subject: `🎵 Tu Ticket: ${emailData.ticketType} - Impcore Records`,
          html_content: emailHTML,
        }
      }),
    });

    if (response.ok) {
      return {
        success: true,
        messageId: `emailjs_${Date.now()}`,
        message: `Ticket enviado correctamente a ${emailData.to}`
      };
    } else {
      throw new Error('Error con EmailJS');
    }
  } catch (error) {
    console.error('Error enviando email:', error);
    
    // Como último recurso, abrir cliente de email
    const subject = encodeURIComponent(`🎵 Tu Ticket: ${emailData.ticketType} - Impcore Records`);
    const body = encodeURIComponent(`Hola ${emailData.customerName},\n\nTu ticket ha sido generado correctamente.\n\nID: ${emailData.ticketId}\nTipo: ${emailData.ticketType}\nPrecio: $${emailData.price.toLocaleString()}\n\n¡Te esperamos en el evento!\n\nImpcore Records`);
    
    const mailtoLink = `mailto:${emailData.to}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
    
    return {
      success: true,
      messageId: `mailto_${Date.now()}`,
      message: `Cliente de email abierto para enviar a ${emailData.to}`
    };
  }
}