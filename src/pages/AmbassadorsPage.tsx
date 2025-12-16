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
import { Switch } from "@/components/ui/switch";
import { 
  useAmbassadors, 
  useCreateAmbassador, 
  useUpdateAmbassador, 
  useCommissionSummary 
} from "@/hooks/useEnhancedData";
import { 
  Users, 
  Plus, 
  Edit, 
  DollarSign, 
  TrendingUp, 
  Mail, 
  Phone,
  Award,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export function AmbassadorsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAmbassador, setEditingAmbassador] = useState<any>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    commission_rate: 0.10
  });
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    commission_rate: 0.10,
    is_active: true
  });

  const { data: ambassadors, isLoading } = useAmbassadors();
  const { commissionsData } = useCommissionSummary();
  const createAmbassador = useCreateAmbassador();
  const updateAmbassador = useUpdateAmbassador();

  const handleCreateAmbassador = async () => {
    try {
      await createAmbassador.mutateAsync({
        ...createForm,
        is_active: true,
        created_at: new Date().toISOString()
      });
      toast.success("Embajador creado exitosamente");
      setIsCreateOpen(false);
      setCreateForm({
        name: "",
        email: "",
        phone: "",
        commission_rate: 0.10
      });
    } catch (error) {
      toast.error("Error al crear embajador");
    }
  };

  const handleEditAmbassador = (ambassador: any) => {
    setEditingAmbassador(ambassador);
    setEditForm({
      name: ambassador.name,
      email: ambassador.email,
      phone: ambassador.phone || "",
      commission_rate: ambassador.commission_rate,
      is_active: ambassador.is_active
    });
  };

  const handleSaveAmbassador = async () => {
    if (!editingAmbassador) return;

    try {
      await updateAmbassador.mutateAsync({
        id: editingAmbassador.id,
        ...editForm
      });
      toast.success("Embajador actualizado exitosamente");
      setEditingAmbassador(null);
    } catch (error) {
      toast.error("Error al actualizar embajador");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <Users className="h-8 w-8 animate-pulse text-primary mx-auto" />
          <p>Cargando embajadores...</p>
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
              <Users className="h-8 w-8 text-primary" />
              Gestión de Embajadores
            </h1>
            <p className="text-muted-foreground">
              Administra tu equipo de embajadores y sus comisiones
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Embajador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Embajador</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo embajador a tu equipo de ventas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Nombre Completo</Label>
                  <Input
                    id="create-name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del embajador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-phone">Teléfono</Label>
                  <Input
                    id="create-phone"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-commission">Comisión (%)</Label>
                  <Input
                    id="create-commission"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={createForm.commission_rate}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ejemplo: 0.10 = 10%
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateAmbassador}
                  disabled={createAmbassador.isPending}
                >
                  {createAmbassador.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Crear Embajador
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards - Resumen de Comisiones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Embajadores Activos</p>
                  <p className="text-2xl font-bold text-primary">
                    {ambassadors?.filter(a => a.is_active).length || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Comisiones</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${commissionsData.reduce((acc, c) => acc + c.total_commission, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tickets por Embajadores</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {commissionsData.reduce((acc, c) => acc + c.tickets_sold, 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Embajadores */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Listado de Embajadores
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Embajador</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ventas</TableHead>
                  <TableHead>Comisiones Ganadas</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambassadors?.map((ambassador) => {
                  const commissionData = commissionsData.find(c => c.ambassador_name === ambassador.name);
                  
                  return (
                    <TableRow key={ambassador.id}>
                      <TableCell>
                        <div className="font-medium">{ambassador.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="font-mono">{ambassador.email}</span>
                          </div>
                          {ambassador.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="font-mono">{ambassador.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {(ambassador.commission_rate * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={ambassador.is_active ? "default" : "secondary"}
                          className={ambassador.is_active ? "bg-green-100 text-green-800 border-green-200" : ""}
                        >
                          {ambassador.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {commissionData?.tickets_sold || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            tickets vendidos
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-bold text-lg text-green-600">
                            ${(commissionData?.total_commission || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            de ${(commissionData?.total_sales || 0).toLocaleString()} en ventas
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditAmbassador(ambassador)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Embajador</DialogTitle>
                              <DialogDescription>
                                Actualizar información y configuración del embajador
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
                              <div className="space-y-2">
                                <Label htmlFor="edit-commission">Comisión (%)</Label>
                                <Input
                                  id="edit-commission"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="1"
                                  value={editForm.commission_rate}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) }))}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-active"
                                  checked={editForm.is_active}
                                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_active: checked }))}
                                />
                                <Label htmlFor="edit-active">Embajador activo</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={handleSaveAmbassador}
                                disabled={updateAmbassador.isPending}
                              >
                                {updateAmbassador.isPending ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Edit className="h-4 w-4 mr-2" />
                                )}
                                Guardar Cambios
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ranking de Embajadores */}
        {commissionsData.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Ranking de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissionsData
                  .sort((a, b) => b.total_commission - a.total_commission)
                  .map((data, index) => (
                    <div key={data.ambassador_name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'bg-secondary text-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{data.ambassador_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {data.tickets_sold} tickets vendidos
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ${data.total_commission.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          de ${data.total_sales.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}