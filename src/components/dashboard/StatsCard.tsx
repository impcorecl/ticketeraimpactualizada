import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = "default",
  className 
}: StatsCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/50",
      variant === "primary" && "border-primary/30 card-glow",
      variant === "success" && "border-success/30",
      variant === "warning" && "border-warning/30",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className={cn(
              "text-3xl font-bold font-mono tracking-tight",
              variant === "primary" && "text-primary",
              variant === "success" && "text-success",
              variant === "warning" && "text-warning"
            )}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn(
              "p-3 rounded-lg bg-secondary",
              variant === "primary" && "bg-primary/10 text-primary",
              variant === "success" && "bg-success/10 text-success",
              variant === "warning" && "bg-warning/10 text-warning"
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
