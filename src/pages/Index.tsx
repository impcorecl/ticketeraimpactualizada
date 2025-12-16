import { Navigation } from "@/components/layout/Navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TicketTable } from "@/components/dashboard/TicketTable";
import { GenerateTicketForm } from "@/components/dashboard/GenerateTicketForm";
import { useTicketStats, useRealtimeTickets } from "@/hooks/useTicketData";
import { Ticket, Users, Package, UserCheck, Loader2 } from "lucide-react";

const Index = () => {
  useRealtimeTickets();
  const { stats, totals, isLoading } = useTicketStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard de Control
          </h1>
          <p className="text-muted-foreground">
            Gestión de tickets y control de aforo en tiempo real
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Tickets Vendidos"
            value={totals.totalSold}
            subtitle={`de ${totals.totalStock} total`}
            icon={<Ticket className="h-5 w-5" />}
            variant="primary"
          />
          <StatsCard
            title="Tickets Disponibles"
            value={totals.totalAvailable}
            icon={<Package className="h-5 w-5" />}
          />
          <StatsCard
            title="Aforo Esperado"
            value={totals.totalPeopleExpected}
            subtitle="personas"
            icon={<Users className="h-5 w-5" />}
            variant="warning"
          />
          <StatsCard
            title="Personas Ingresadas"
            value={totals.totalPeopleEntered}
            subtitle={`${totals.totalUsed} tickets usados`}
            icon={<UserCheck className="h-5 w-5" />}
            variant="success"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Table */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Resumen por Tipo</h2>
            <TicketTable stats={stats} />
          </div>

          {/* Generate Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Generar Ticket</h2>
            <GenerateTicketForm stats={stats} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
