import { ValidationResult as ValidationResultType } from "@/hooks/useTicketData";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ValidationResultProps {
  result: ValidationResultType;
  onReset: () => void;
}

export function ValidationResult({ result, onReset }: ValidationResultProps) {
  const isSuccess = result.success;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center p-6",
        isSuccess ? "bg-success animate-pulse-success" : "bg-destructive animate-pulse-error"
      )}
      onClick={onReset}
    >
      <div className="text-center space-y-6 max-w-md animate-scale-in">
        {isSuccess ? (
          <>
            <CheckCircle className="h-32 w-32 mx-auto text-success-foreground" />
            <h1 className="text-4xl md:text-5xl font-black text-success-foreground text-glow">
              ACCESO PERMITIDO
            </h1>
            
            <div className="bg-success-foreground/20 rounded-2xl p-8 space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Users className="h-16 w-16 text-success-foreground" />
                <span className="text-7xl md:text-8xl font-black text-success-foreground text-glow">
                  {result.people_per_ticket}
                </span>
              </div>
              <p className="text-2xl font-bold text-success-foreground uppercase">
                {result.people_per_ticket === 1 ? "PERSONA" : "PERSONAS"}
              </p>
            </div>

            {result.ticket_type && (
              <p className="text-xl font-semibold text-success-foreground/90">
                {result.ticket_type}
              </p>
            )}

            {result.description && (
              <div className="bg-success-foreground/10 rounded-lg p-4">
                <p className="text-lg text-success-foreground font-medium">
                  {result.description}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {result.message.includes("YA USADO") ? (
              <AlertTriangle className="h-32 w-32 mx-auto text-destructive-foreground" />
            ) : (
              <XCircle className="h-32 w-32 mx-auto text-destructive-foreground" />
            )}
            
            <h1 className="text-4xl md:text-5xl font-black text-destructive-foreground text-glow">
              {result.message.includes("YA USADO") ? "TICKET YA USADO" : "TICKET INVÁLIDO"}
            </h1>

            <p className="text-2xl text-destructive-foreground/90 font-semibold">
              {result.message}
            </p>

            {result.scanned_at && (
              <div className="bg-destructive-foreground/10 rounded-lg p-4">
                <p className="text-lg text-destructive-foreground">
                  Escaneado: {format(new Date(result.scanned_at), "PPpp", { locale: es })}
                </p>
              </div>
            )}
          </>
        )}

        <Button
          onClick={onReset}
          size="lg"
          className={cn(
            "mt-8 text-lg px-8 py-6",
            isSuccess 
              ? "bg-success-foreground text-success hover:bg-success-foreground/90" 
              : "bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
          )}
        >
          Escanear Otro Ticket
        </Button>
      </div>
    </div>
  );
}
