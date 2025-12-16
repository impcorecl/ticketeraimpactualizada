import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSalesReport, useCustomers, useUpdateCustomer } from "@/hooks/useEnhancedData";
import { 
  Database, 
  Download, 
  Edit, 
  Mail, 
  Phone, 
  Search, 
  Users, 
  DollarSign,
  Calendar,
  Filter,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export function DatabasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const { data: salesReport, isLoading } = useSalesReport();
  const { data: customers } = useCustomers();
  const updateCustomer = useUpdateCustomer();

  // Filtrar datos según búsqueda
  const filteredSales = salesReport?.filter(sale => 
    sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.ticket_type_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Estadísticas generales
  const stats = {
    totalCustomers: new Set(salesReport?.map(s => s.customer_email)).size || 0,
    totalSales: salesReport?.reduce((acc, sale) => acc + sale.sale_price, 0) || 0,
    totalTickets: salesReport?.length || 0,
    totalCommissions: salesReport?.reduce((acc, sale) => acc + sale.commission_amount, 0) || 0
  };

  const handleEditCustomer = (sale: any) => {
    setEditingCustomer(sale);
    setEditForm({
      name: sale.customer_name,
      email: sale.customer_email,
      phone: sale.customer_phone || ""
    });
  };

  const handleSaveCustomer = async () => {
    if (!editingCustomer) return;

    try {
      const customer = customers?.find(c => c.email === editingCustomer.customer_email);
      if (customer) {
        await updateCustomer.mutateAsync({
          id: customer.id,
          ...editForm
        });
        toast.success("Cliente actualizado correctamente");
        setEditingCustomer(null);
      }
    } catch (error) {
      toast.error("Error al actualizar cliente");
    }
  };

  const exportToExcel = () => {
    const exportData = filteredSales.map(sale => ({
      'Fecha de Venta': format(new Date(sale.created_at), "dd/MM/yyyy HH:mm", { locale: es }),
      'Nombre Cliente': sale.customer_name,
      'Email Cliente': sale.customer_email,
      'Teléfono Cliente': sale.customer_phone || 'N/A',
      'Tipo de Ticket': sale.ticket_type_name,
      'Precio': sale.sale_price,
      'Embajador': sale.ambassador_name || 'Sin embajador',
      'Comisión': sale.commission_amount,
      'Método de Pago': sale.payment_method,
      'Estado Ticket': sale.ticket_status,
      'Fecha Escaneo': sale.scanned_at ? format(new Date(sale.scanned_at), "dd/MM/yyyy HH:mm", { locale: es }) : 'No escaneado'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Base de Datos Tickets");
    
    const fileName = `impcore_database_${format(new Date(), "yyyy-MM-dd_HH-mm")}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Base de datos exportada: ${fileName}`);
  };

  const exportCustomersOnly = () => {
    const uniqueCustomers = Array.from(
      new Map(salesReport?.map(sale => [
        sale.customer_email,
        {
          'Nombre': sale.customer_name,
          'Email': sale.customer_email,
          'Teléfono': sale.customer_phone || 'N/A',
          'Fecha Primera Compra': format(new Date(
            salesReport
              .filter(s => s.customer_email === sale.customer_email)
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
              .created_at
          ), "dd/MM/yyyy", { locale: es }),
          'Total Compras': salesReport.filter(s => s.customer_email === sale.customer_email).length,
          'Total Gastado': salesReport
            .filter(s => s.customer_email === sale.customer_email)
            .reduce((acc, s) => acc + s.sale_price, 0)
        }
      ]) || []).values()
    );

    const ws = XLSX.utils.json_to_sheet(uniqueCustomers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Base de Datos Clientes");
    
    const fileName = `impcore_clientes_${format(new Date(), "yyyy-MM-dd_HH-mm")}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Base de datos de clientes exportada: ${fileName}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <Database className="h-8 w-8 animate-pulse text-primary mx-auto" />
          <p>Cargando base de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Database className="h-8 w-8 text-primary" />
              Base de Datos de Clientes
            </h1>
            <p className="text-muted-foreground">
              Gestión completa de clientes y ventas para marketing
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={exportCustomersOnly} variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Exportar Clientes
            </Button>
            <Button onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Todo (Excel)
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clientes</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalCustomers}</p>
                </div>
                <Users className="h-8 w-8 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tickets Vendidos</p>
                  <p className="text-2xl font-bold">{stats.totalTickets}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalSales.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Comisiones</p>
                  <p className="text-2xl font-bold text-amber-600">${stats.totalCommissions.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, email o tipo de ticket..."
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <Badge variant="outline" className="whitespace-nowrap">
                {filteredSales.length} resultados
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Ventas */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historial de Ventas Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Embajador</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.ticket_id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(sale.created_at), "dd/MM/yy\nHH:mm", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{sale.customer_name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="font-mono">{sale.customer_email}</span>
                          </div>
                          {sale.customer_phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="font-mono">{sale.customer_phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-xs">{sale.ticket_type_name}</div>
                          <Badge variant="outline" className="text-xs">
                            {sale.payment_method}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-bold text-green-600">
                          ${sale.sale_price.toLocaleString()}
                        </div>
                        {sale.commission_amount > 0 && (
                          <div className="text-xs text-amber-600">
                            Comisión: ${sale.commission_amount.toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {sale.ambassador_name ? (
                          <Badge variant="secondary" className="text-xs">
                            {sale.ambassador_name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Directo</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={sale.ticket_status === 'used' ? 'default' : 'outline'}
                          className={`text-xs ${
                            sale.ticket_status === 'used' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : ''
                          }`}
                        >
                          {sale.ticket_status === 'used' ? 'Usado' : 'Válido'}
                        </Badge>
                        {sale.scanned_at && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(new Date(sale.scanned_at), "dd/MM HH:mm", { locale: es })}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditCustomer(sale)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Cliente</DialogTitle>
                              <DialogDescription>
                                Actualizar información de contacto del cliente
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Nombre</Label>
                                <Input
                                  id="edit-name"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={editForm.email}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-phone">Teléfono</Label>
                                <Input
                                  id="edit-phone"
                                  value={editForm.phone}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={handleSaveCustomer}
                                disabled={updateCustomer.isPending}
                              >
                                Guardar Cambios
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}