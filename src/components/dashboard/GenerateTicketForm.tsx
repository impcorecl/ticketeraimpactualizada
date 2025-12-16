import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicketTypes, TicketStats } from "@/hooks/useTicketData";
import { useCreateCompleteSale, useAmbassadors } from "@/hooks/useEnhancedData";
import { Ticket, Plus, Loader2, User, Mail, Phone, Users } from "lucide-react";
import { toast } from "sonner";
import { QRCodeDisplay } from "./QRCodeDisplay";

const saleFormSchema = z.object({
  ticket_type_id: z.string().min(1, "Selecciona un tipo de ticket"),
  customer_name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  customer_email: z.string().email("Email inválido"),
  customer_phone: z.string().optional(),
  ambassador_id: z.string().optional(),
  payment_method: z.string().default("cash"),
  notes: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleFormSchema>;

interface GenerateTicketFormProps {
  stats: TicketStats[];
}

export function GenerateTicketForm({ stats }: GenerateTicketFormProps) {
  const [generatedTicketId, setGeneratedTicketId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const { data: ticketTypes } = useTicketTypes();
  const { data: ambassadors } = useAmbassadors();
  const createCompleteSale = useCreateCompleteSale();

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      ticket_type_id: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      ambassador_id: "",
      payment_method: "cash",
      notes: "",
    },
  });

  const selectedTypeId = form.watch("ticket_type_id");
  const selectedStat = stats.find((s) => s.ticketType.id === selectedTypeId);
  const canGenerate = selectedStat && selectedStat.ticketsAvailable > 0;

  const onSubmit = async (data: SaleFormData) => {
    if (!canGenerate) return;

    try {
      const result = await createCompleteSale.mutateAsync(data);
      if (result.success) {
        setGeneratedTicketId(result.ticket_id);
        setCustomerData({
          name: data.customer_name,
          email: data.customer_email,
          phone: data.customer_phone,
        });
        toast.success("Ticket generado y vendido exitosamente");
      } else {
        toast.error(result.message || "Error al procesar la venta");
      }
    } catch (error) {
      toast.error("Error al generar el ticket");
      console.error(error);
    }
  };

  const handleClose = () => {
    setGeneratedTicketId(null);
    setCustomerData(null);
    form.reset();
  };

  if (generatedTicketId && customerData) {
    const ticketType = ticketTypes?.find((t) => t.id === selectedTypeId);
    return (
      <QRCodeDisplay
        ticketId={generatedTicketId}
        ticketType={ticketType?.name || ""}
        customerData={customerData}
        onClose={handleClose}
      />
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ticket className="h-5 w-5 text-primary" />
          Generar Ticket / Venta Manual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Tipo de Ticket */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Ticket *</Label>
            <Select 
              value={form.watch("ticket_type_id")} 
              onValueChange={(value) => form.setValue("ticket_type_id", value)}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Seleccionar tipo de ticket..." />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes?.map((type) => {
                  const stat = stats.find((s) => s.ticketType.id === type.id);
                  const available = stat?.ticketsAvailable || 0;
                  
                  return (
                    <SelectItem 
                      key={type.id} 
                      value={type.id}
                      disabled={available === 0}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{type.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ${type.price.toLocaleString()} - ({available} disp.)
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {form.formState.errors.ticket_type_id && (
              <p className="text-sm text-destructive">{form.formState.errors.ticket_type_id.message}</p>
            )}
          </div>

          {/* Información del Cliente */}
          <div className="space-y-4 p-4 rounded-lg bg-secondary/20 border">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Datos del Cliente
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label htmlFor="customer_name" className="text-sm">Nombre Completo *</Label>
                <Input
                  id="customer_name"
                  {...form.register("customer_name")}
                  placeholder="Ej: Juan Pérez"
                  className="bg-background/50"
                />
                {form.formState.errors.customer_name && (
                  <p className="text-xs text-destructive">{form.formState.errors.customer_name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="customer_email" className="text-sm flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email *
                </Label>
                <Input
                  id="customer_email"
                  type="email"
                  {...form.register("customer_email")}
                  placeholder="ejemplo@correo.com"
                  className="bg-background/50"
                />
                {form.formState.errors.customer_email && (
                  <p className="text-xs text-destructive">{form.formState.errors.customer_email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="customer_phone" className="text-sm flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Teléfono (opcional)
                </Label>
                <Input
                  id="customer_phone"
                  {...form.register("customer_phone")}
                  placeholder="+56 9 1234 5678"
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          {/* Embajador */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4 text-primary" />
              Embajador (10% comisión)
            </Label>
            <Select 
              value={form.watch("ambassador_id")} 
              onValueChange={(value) => form.setValue("ambassador_id", value === "none" ? "" : value)}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Sin embajador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin embajador</SelectItem>
                {ambassadors?.filter(a => a.is_active).map((ambassador) => (
                  <SelectItem key={ambassador.id} value={ambassador.id}>
                    {ambassador.name} ({(ambassador.commission_rate * 100)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Método de Pago */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Método de Pago</Label>
            <Select 
              value={form.watch("payment_method")} 
              onValueChange={(value) => form.setValue("payment_method", value)}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">💵 Efectivo</SelectItem>
                <SelectItem value="transfer">🏦 Transferencia</SelectItem>
                <SelectItem value="card">💳 Tarjeta</SelectItem>
                <SelectItem value="digital">📱 Pago Digital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notas adicionales</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Información adicional sobre la venta..."
              className="bg-secondary/50 resize-none"
              rows={2}
            />
          </div>

          {/* Resumen */}
          {selectedStat && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2 text-sm">
              <div className="flex justify-between font-medium">
                <span>Precio total:</span>
                <span className="text-lg font-bold text-primary">
                  ${selectedStat.ticketType.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Personas por ticket:</span>
                <span className="font-medium">
                  {selectedStat.ticketType.people_per_ticket} personas
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Stock disponible:</span>
                <span className={`font-medium ${
                  selectedStat.ticketsAvailable < 5 ? 'text-destructive' : 'text-success'
                }`}>
                  {selectedStat.ticketsAvailable} tickets
                </span>
              </div>
              {form.watch("ambassador_id") && (
                <div className="flex justify-between text-muted-foreground pt-1 border-t border-border/50">
                  <span>Comisión embajador:</span>
                  <span className="font-medium text-amber-600">
                    ${(selectedStat.ticketType.price * 0.10).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Botón Submit */}
          <Button
            type="submit"
            disabled={!canGenerate || createCompleteSale.isPending}
            className="w-full"
            size="lg"
          >
            {createCompleteSale.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Procesar Venta y Generar Ticket
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
