import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useEnhancedData";
import { LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Por favor ingresa usuario y contraseña");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      toast.success("Sesión iniciada correctamente");
    } catch (error) {
      toast.error("Credenciales incorrectas");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Impcore Records</CardTitle>
          <CardDescription>
            Sistema de Tickets - Acceso Administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario o Email</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ImpcoreRecords.vina"
                disabled={isLoading}
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="bg-secondary/30"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              Iniciar Sesión
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Credenciales de acceso:</p>
              <p className="font-mono text-xs">ImpcoreRecords.vina</p>
              <p className="font-mono text-xs">Immersive.2025$$</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}