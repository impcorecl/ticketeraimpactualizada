// Template profesional estilo Passline para Bounce2Bounce - Impcore Aniversario
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
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>🎵 Tu Entrada - Bounce2Bounce | Impcore Aniversario</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; 
            line-height: 1.4; 
            color: #fff; 
            background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 50%, #FF6B9D 100%);
            margin: 0;
            padding: 20px;
        }
        .email-container { 
            max-width: 650px; 
            margin: 0 auto; 
            background: #000;
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }
        .header-section { 
            width: 100%; 
            background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 50%, #FF6B9D 100%);
            padding: 40px 30px;
            text-align: center;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
        }
        .main-title {
            font-size: 36px;
            font-weight: 800;
            color: #fff;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .event-name {
            font-size: 24px;
            font-weight: 600;
            opacity: 0.9;
            color: #FFB347;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .ticket-section {
            background: #111;
            padding: 30px;
        }
        .ticket-card {
            background: #1a1a1a;
            border: 2px solid #333;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
        }
        .ticket-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #FF6B9D, #4A90E2, #7B68EE);
        }
        .qr-event-flex {
            display: flex;
            align-items: flex-start;
            gap: 40px;
            justify-content: center;
            margin-bottom: 40px;
            padding: 20px;
        }
        .qr-section {
            flex-shrink: 0;
            text-align: center;
        }
        .qr-container {
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(255,107,157,0.4);
            margin-bottom: 10px;
        }
        .qr-container img {
            width: 180px;
            height: 180px;
            display: block;
            border-radius: 8px;
        }
        .qr-label {
            color: #FF6B9D;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .event-photo {
            flex-shrink: 0;
            text-align: center;
        }
        .event-photo img {
            width: 180px;
            height: 180px;
            object-fit: cover;
            border-radius: 15px;
            border: 4px solid #FF6B9D;
            box-shadow: 0 10px 30px rgba(75,144,226,0.4);
            margin-bottom: 10px;
        }
        .event-label {
            color: #4A90E2;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .ticket-info-section {
            background: #0a0a0a;
            padding: 25px;
            margin-top: 0;
        }
        .ticket-type {
            font-size: 28px;
            font-weight: 800;
            color: #FF6B9D;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: center;
        }
        .ticket-details {
            display: grid;
            gap: 8px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #333;
        }
        .detail-label {
            color: #999;
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .detail-value {
            color: #fff;
            font-size: 16px;
            font-weight: 700;
        }
        .price-value {
            color: #4CAF50;
            font-size: 20px;
        }
        .event-info {
            background: #0a0a0a;
            padding: 25px;
            text-align: center;
        }
        .venue-card {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }
        .venue-title {
            color: #4CAF50;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .venue-address {
            color: #ccc;
            font-size: 16px;
            line-height: 1.5;
        }
        .instructions {
            background: #0d47a1;
            border-left: 4px solid #2196F3;
            padding: 20px;
            margin: 20px 0;
        }
        .instructions h3 {
            color: #64B5F6;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .instructions p {
            color: #E3F2FD;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .footer {
            background: #000;
            color: #666;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #333;
        }
        .footer-logo {
            color: #FF6B9D;
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .footer p {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            color: #FF6B9D;
            text-decoration: none;
            margin: 0 15px;
            font-weight: 600;
        }


        
            @media (max-width: 650px) {
            body { padding: 10px; }
            .email-container { margin: 0; border-radius: 15px; }
            .main-title { font-size: 28px; }
            .event-name { font-size: 18px; }
            .qr-event-flex { 
                flex-direction: column; 
                gap: 30px;
                align-items: center;
            }
            .qr-container img, .event-photo img { 
                width: 160px; 
                height: 160px; 
            }
            .ticket-type { font-size: 22px; }
            .detail-row { flex-direction: column; align-items: flex-start; gap: 5px; }
            .venue-address { font-size: 14px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header-section">
            <div class="main-title">Aquí está tu ticket:</div>
            <div class="event-name">Bounce2Bounce | Impcore Aniversario</div>
        </div>

        <!-- QR y Foto del Evento -->
        <div class="ticket-section">
            <div class="qr-event-flex">
                <div class="qr-section">
                    <div class="qr-container">
                        <img src="${ticketData.qrCodeDataUrl}" alt="Código QR del Ticket" />
                    </div>
                    <div class="qr-label">📱 Escanea para validar</div>
                </div>
                
                <div class="event-photo">
                    <img src="/flayer aniversario1080x1080.png" alt="Bounce2Bounce Event" onerror="this.style.display='none'" />
                    <div class="event-label">🎵 Evento Oficial</div>
                </div>
            </div>
        </div>
        
        <!-- Información del Ticket -->
        <div class="ticket-info-section">
            <div class="ticket-type">${ticketData.ticketType}</div>
            <div class="ticket-details">
                <div class="detail-row">
                                <span class="detail-label">Cliente</span>
                                <span class="detail-value">${ticketData.customerName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Precio</span>
                                <span class="detail-value price-value">$${ticketData.price.toLocaleString()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Personas</span>
                                <span class="detail-value">${ticketData.people_per_ticket} ${ticketData.people_per_ticket === 1 ? 'persona' : 'personas'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Ticket ID</span>
                                <span class="detail-value" style="font-family: monospace; font-size: 12px; word-break: break-all;">${ticketData.ticketId}</span>
                            </div>
                            ${ticketData.description ? `
                            <div class="detail-row">
                                <span class="detail-label">Acceso</span>
                                <span class="detail-value">${ticketData.description}</span>
                            </div>
                            ` : ''}
                        </div>
            </div>
        
        <!-- Event Info -->
        <div class="event-info">
            <div class="venue-card">
                <div class="venue-title">📍 UBICACIÓN DEL EVENTO</div>
                <div class="venue-address">
                    <strong>Bounce2Bounce | Impcore Aniversario</strong><br>
                    Fecha: Por confirmar<br>
                    Hora: Por confirmar<br>
                    Lugar: Por confirmar
                </div>
            </div>

            <!-- Instructions -->
            <div class="instructions">
                <h3>📱 INSTRUCCIONES DE USO</h3>
                <p>• Descarga este email en tu teléfono para acceso offline</p>
                <p>• Presenta el código QR en la entrada del evento</p>
                <p>• El ticket es de uso único y no transferible</p>
                <p>• Llega temprano para evitar filas</p>
                <p>• Conserva tu ticket hasta el final del evento</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">IMPCORE RECORDS</div>
            <p>Experiencias musicales inmersivas</p>
            <p>Para soporte: Impcorecl@gmail.com</p>
            <div class="social-links">
                <a href="https://instagram.com/impcore.records">Instagram</a>
                <a href="mailto:Impcorecl@gmail.com">Soporte</a>
            </div>
        </div>
    </div>
</body>
</html>
  `;
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
          from: 'Impcore Records <delivered@resend.dev>',
          to: [emailData.to],
          subject: `🎵 Tu Ticket: ${emailData.ticketType} - Impcore Records`,
          html: emailHTML,
          reply_to: 'contact@impcore.cl',
          headers: {
            'X-Entity-Ref-ID': emailData.ticketId,
            'X-Priority': '1',
            'Importance': 'high'
          },
          tags: [
            { name: 'category', value: 'ticket' },
            { name: 'event', value: 'impcore-records' }
          ]
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email enviado exitosamente:', result);
        return {
          success: true,
          messageId: result.id,
          message: `Ticket enviado correctamente a ${emailData.to}`
        };
      } else {
        const error = await response.json();
        console.error('❌ Error de Resend:', error);
        console.error('Status:', response.status, response.statusText);
        throw new Error(`Resend Error: ${error.message || response.statusText}`);
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
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;
  
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_USER_ID) {
    console.log('❌ EmailJS no configurado, usando fallback');
    return openMailClient(emailData, emailHTML);
  }

  console.log('📧 Enviando con EmailJS...', {
    service: EMAILJS_SERVICE_ID,
    template: EMAILJS_TEMPLATE_ID,
    to: emailData.to
  });

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: {
          to_email: emailData.to,
          customer_name: emailData.customerName,
          ticket_type: emailData.ticketType,
          price: emailData.price.toLocaleString(),
          people_count: emailData.people_per_ticket,
          ticket_id: emailData.ticketId,
          qr_code: emailData.qrCodeDataUrl,
          from_name: 'Impcore Records',
          reply_to: 'Impcorecl@gmail.com'
        }
      }),
    });

    if (response.ok) {
      const result = await response.text();
      console.log('✅ EmailJS enviado:', result);
      return {
        success: true,
        messageId: `emailjs_${Date.now()}`,
        message: `Ticket enviado correctamente a ${emailData.to}`
      };
    } else {
      const error = await response.text();
      console.error('❌ Error EmailJS:', error);
      throw new Error(`EmailJS Error: ${error}`);
    }
  } catch (error) {
    console.error('💥 Error enviando con EmailJS:', error);
    return openMailClient(emailData, emailHTML);
  }
}

function openMailClient(emailData: any, emailHTML: string) {
  console.log('📬 Abriendo cliente de email como fallback');
  
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