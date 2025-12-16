import { useState, useCallback } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { QRScanner } from "@/components/scanner/QRScanner";
import { ValidationResult } from "@/components/scanner/ValidationResult";
import { useValidateTicket, ValidationResult as ValidationResultType } from "@/hooks/useTicketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanLine, Keyboard, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Scanner = () => {
  const [result, setResult] = useState<ValidationResultType | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [manualInput, setManualInput] = useState("");
  const [showManual, setShowManual] = useState(false);
  const validateTicket = useValidateTicket();

  const handleScan = useCallback(async (ticketId: string) => {
    if (validateTicket.isPending || result) return;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ticketId)) {
      toast.error("Código QR inválido");
      return;
    }

    setIsScanning(false);

    try {
      const validationResult = await validateTicket.mutateAsync(ticketId);
      setResult(validationResult);
    } catch (error) {
      console.error("Validation error:", error);
      setResult({
        success: false,
        message: "ERROR DE CONEXIÓN ⚠️",
      });
    }
  }, [validateTicket, result]);

  const handleReset = () => {
    setResult(null);
    setIsScanning(true);
    setManualInput("");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
    }
  };

  if (result) {
    return <ValidationResult result={result} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Validar Ticket</h1>
            <p className="text-muted-foreground">
              Escanea el código QR del ticket
            </p>
          </div>

          {/* Scanner */}
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              {isScanning && !showManual ? (
                <QRScanner onScan={handleScan} isActive={isScanning} />
              ) : validateTicket.isPending ? (
                <div className="flex items-center justify-center h-80 bg-secondary/30">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Validando ticket...</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Manual Input Toggle */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setShowManual(!showManual)}
              className="gap-2"
            >
              <Keyboard className="h-4 w-4" />
              {showManual ? "Usar cámara" : "Ingresar código manualmente"}
            </Button>
          </div>

          {/* Manual Input Form */}
          {showManual && (
            <Card className="border-border/50 animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-primary" />
                  Código Manual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <Input
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Ingresa el UUID del ticket..."
                    className="font-mono text-sm"
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!manualInput.trim() || validateTicket.isPending}
                  >
                    {validateTicket.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ScanLine className="h-4 w-4 mr-2" />
                    )}
                    Validar Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>Apunta la cámara al código QR del ticket</p>
            <p>La validación es automática y única</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scanner;
