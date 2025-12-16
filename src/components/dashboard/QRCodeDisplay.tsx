import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Copy, Check, Download, Mail, User } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { sendTicketEmail } from "@/lib/emailService";
import { useTicketTypes } from "@/hooks/useTicketData";

interface QRCodeDisplayProps {
  ticketId: string;
  ticketType: string;
  customerData?: {
    name: string;
    email: string;
    phone?: string;
  };
  onClose: () => void;
}

export function QRCodeDisplay({ ticketId, ticketType, customerData, onClose }: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const { data: ticketTypes } = useTicketTypes();

  useEffect(() => {
    QRCode.toDataURL(ticketId, {
      width: 300,
      margin: 2,
      color: {
        dark: "#0d1117",
        light: "#ffffff",
      },
    }).then(setQrDataUrl);
  }, [ticketId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ticketId);
    setCopied(true);
    toast.success("UUID copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `ticket-${ticketId.slice(0, 8)}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success("QR descargado");
  };

  const handleSendEmail = async () => {
    if (!customerData?.email || !qrDataUrl) {
      toast.error("No hay email del cliente o QR no generado");
      return;
    }

    const ticketTypeData = ticketTypes?.find(t => t.name === ticketType);
    if (!ticketTypeData) {
      toast.error("No se encontraron los datos del tipo de ticket");
      return;
    }

    setIsEmailSending(true);
    
    try {
      const emailResult = await sendTicketEmail({
        to: customerData.email,
        customerName: customerData.name,
        ticketId: ticketId,
        ticketType: ticketType,
        price: ticketTypeData.price,
        people_per_ticket: ticketTypeData.people_per_ticket,
        description: ticketTypeData.description,
        qrCodeDataUrl: qrDataUrl,
      });

      if (emailResult.success) {
        setEmailSent(true);
        toast.success(`✓ Ticket enviado exitosamente a ${customerData.email}`);
      } else {
        throw new Error(emailResult.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Error enviando email:", error);
      toast.error("Error al enviar el ticket por email");
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <Card className="border-primary/30 card-glow animate-scale-in">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Ticket Generado Exitosamente</h3>
            <p className="text-sm text-muted-foreground">{ticketType}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Datos del Cliente */}
        {customerData && (
          <div className="p-4 bg-secondary/20 rounded-lg border">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-primary" />
              Información del Cliente
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-medium">{customerData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono text-xs">{customerData.email}</span>
              </div>
              {customerData.phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-mono text-xs">{customerData.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          {qrDataUrl && (
            <div className="p-4 bg-white rounded-xl shadow-lg">
              <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            UUID del Ticket
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-secondary rounded-lg font-mono text-xs break-all">
              {ticketId}
            </code>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-3">
          {customerData?.email && (
            <Button 
              onClick={handleSendEmail} 
              disabled={emailSent || isEmailSending}
              className="w-full"
              size="lg"
            >
              {emailSent ? (
                <Check className="h-4 w-4 mr-2 text-success" />
              ) : isEmailSending ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              {emailSent ? "✓ Email Enviado" : 
               isEmailSending ? "Enviando..." : 
               `📧 Enviar a ${customerData.email}`}
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Descargar QR
            </Button>
            <Button onClick={onClose} className="flex-1">
              Generar Otro Ticket
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
