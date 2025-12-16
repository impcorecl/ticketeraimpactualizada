import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TicketStats } from "@/hooks/useTicketData";
import { cn } from "@/lib/utils";

interface TicketTableProps {
  stats: TicketStats[];
}

export function TicketTable({ stats }: TicketTableProps) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-foreground">Tipo de Ticket</TableHead>
            <TableHead className="text-center font-semibold text-foreground">Personas/Ticket</TableHead>
            <TableHead className="text-center font-semibold text-foreground">Stock Total</TableHead>
            <TableHead className="text-center font-semibold text-foreground">Vendidos</TableHead>
            <TableHead className="text-center font-semibold text-foreground">Disponibles</TableHead>
            <TableHead className="text-center font-semibold text-foreground">Usados</TableHead>
            <TableHead className="text-center font-semibold text-primary">Aforo (Esperado)</TableHead>
            <TableHead className="text-center font-semibold text-success">Personas (Ingresadas)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => (
            <TableRow 
              key={stat.ticketType.id}
              className="hover:bg-secondary/30 transition-colors"
            >
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{stat.ticketType.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {stat.ticketType.description}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="font-mono">
                  {stat.ticketType.people_per_ticket}
                </Badge>
              </TableCell>
              <TableCell className="text-center font-mono text-muted-foreground">
                {stat.ticketType.total_stock}
              </TableCell>
              <TableCell className="text-center font-mono">
                {stat.ticketsSold}
              </TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "font-mono font-medium",
                  stat.ticketsAvailable <= 10 ? "text-warning" : "text-foreground",
                  stat.ticketsAvailable === 0 && "text-destructive"
                )}>
                  {stat.ticketsAvailable}
                </span>
              </TableCell>
              <TableCell className="text-center font-mono text-success">
                {stat.ticketsUsed}
              </TableCell>
              <TableCell className="text-center">
                <span className="font-mono font-bold text-primary">
                  {stat.peopleExpected}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className="font-mono font-bold text-success">
                  {stat.peopleEntered}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
