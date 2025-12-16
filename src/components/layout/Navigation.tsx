import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  ScanLine, 
  Ticket, 
  Database, 
  Users, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useEnhancedData";
import { toast } from "sonner";

export function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/scanner", label: "Escáner", icon: ScanLine },
    { to: "/database", label: "Base de Datos", icon: Database },
    { to: "/ambassadors", label: "Embajadores", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg">
                Impcore Records
              </span>
              <div className="text-xs text-muted-foreground -mt-1">
                Sistema de Tickets
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={location.pathname === link.to ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2",
                    location.pathname === link.to && "bg-primary text-primary-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{link.label}</span>
                </Button>
              </Link>
            ))}
            
            {/* User Info & Logout */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border/50">
              {user && (
                <div className="hidden sm:block text-sm">
                  <div className="font-medium">{user.username}</div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
