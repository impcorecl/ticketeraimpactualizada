import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useEnhancedData";
import { LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Import supabase for testing
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Test function exists
      const { data, error } = await supabase.rpc('check_user_exists');
      
      if (error) {
        toast.error(`❌ Error BD: ${error.message}`);
        console.error('Supabase error:', error);
        return;
      }

      if (data?.success) {
        toast.success(`✅ BD OK - ${data.user_count} usuarios`);
        console.log('🎯 Usuario encontrado:', data.sample_user);
      } else {
        toast.error("⚠️ No hay usuarios en BD");
        console.log('📝 Respuesta:', data);
      }
      
      // Test env vars
      console.log('🔗 Variables:', {
        url: import.meta.env.VITE_SUPABASE_URL,
        key: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
      });
      
    } catch (error: any) {
      toast.error(`💥 Error: ${error.message}`);
      console.error('Test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Por favor ingresa usuario y contraseña");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(username, password);
      console.log('🎯 Login result:', result);
      toast.success("¡Sesión iniciada correctamente!");
      
      // Forzar navegación inmediata
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error: any) {
      const errorMsg = error?.message || "Credenciales incorrectas";
      toast.error(`❌ ${errorMsg}`);
      console.error('Error de login:', error);
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
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
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
              <Button 
                type="button"
                variant="outline"
                onClick={testConnection}
                disabled={isLoading}
                size="lg"
                className="px-3"
                title="Probar conexión"
              >
                🔧
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Credenciales de acceso:</p>
              <p className="font-mono text-xs">ImpcoreRecords.vina</p>
              <p className="font-mono text-xs">Immersive.2025$$</p>
            </div>
            <div className="mt-3 text-xs">
              <span>🔗 Supabase: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}</span>
              <span className="ml-2">🔑 Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}