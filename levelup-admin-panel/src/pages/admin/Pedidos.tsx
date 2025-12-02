import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Edit, Trash2, Loader2, Package, Truck, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import OrderEditModal from "@/components/admin/OrderEditModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrders } from "@/context/OrderContext";
import { Order } from "@/types/Order";

const Pedidos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [mobilePage, setMobilePage] = useState(1);
  const MOBILE_ITEMS_PER_PAGE = 10;
  const { orders, loading, error, updateOrder, refreshOrders } = useOrders();

  // Auto-refresh orders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshOrders]);

  const resetMobilePage = () => {
    setMobilePage(1);
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      case "procesando":
        return <Package className="w-4 h-4" />;
      case "enviado":
        return <Truck className="w-4 h-4" />;
      case "entregado":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelado":
        return <XCircle className="w-4 h-4" />;
      case "rechazado":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "procesando":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "enviado":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "entregado":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "cancelado":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "rechazado":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default:
        return "bg-secondary";
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order.numeroOrden || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleSaveOrderChanges = (orderId: string, updates: Partial<Order>) => {
    updateOrder(orderId, updates);
  };

  const renderOrderTable = (filterEstado?: string) => {
    const displayOrders = filterEstado
      ? filteredOrders.filter((o) => o.estado === filterEstado)
      : filteredOrders;

    // Pagination for mobile view
    const totalMobilePages = Math.ceil(displayOrders.length / MOBILE_ITEMS_PER_PAGE);
    const paginatedMobileUsers = displayOrders.slice(
      (mobilePage - 1) * MOBILE_ITEMS_PER_PAGE,
      mobilePage * MOBILE_ITEMS_PER_PAGE
    );

    return (
      <div className="w-full">
        {/* Mobile Card View */}
        <div className="block md:hidden">
          {displayOrders.length > 0 ? (
            <>
              <div className="space-y-3 sm:space-y-4">
                {paginatedMobileUsers.map((order) => (
                  <Card key={order.id} className="p-3 transition-all hover:shadow-md sm:p-4">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Header with order number and actions */}
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-xs leading-tight sm:text-sm">{order.numeroOrden}</h3>
                          <p className="mt-1 text-[10px] text-muted-foreground truncate sm:text-xs">{order.userName}</p>
                          <p className="text-[10px] text-muted-foreground truncate sm:text-xs">{order.userEmail}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOrderDetails(order)}
                            className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                          >
                            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOrder(order)}
                            className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                          >
                            <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                        </div>
                      </div>
                      {/* Order details */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground sm:text-xs">Fecha:</span>
                          <span className="text-[10px] sm:text-xs">{new Date(order.fechaCreacion).toLocaleDateString("es-CL")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground sm:text-xs">Estado:</span>
                          <Badge className={`text-[10px] sm:text-xs ${getEstadoColor(order.estado)}`}>
                            {getEstadoIcon(order.estado)}
                            <span className="ml-1 capitalize">{order.estado}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground sm:text-xs">Total:</span>
                          <span className="text-xs font-semibold text-primary sm:text-sm">${(order.total || 0).toLocaleString("es-CL")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground sm:text-xs">Puntos:</span>
                          <div className="text-[10px] sm:text-xs">
                            <p className="text-green-600">+{order.puntosGanados}</p>
                            {order.puntosUsados > 0 && (
                              <p className="text-red-600">-{order.puntosUsados}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {/* Pagination for mobile */}
              {totalMobilePages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMobilePage(Math.max(1, mobilePage - 1))}
                    disabled={mobilePage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground self-center">
                    {mobilePage} de {totalMobilePages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMobilePage(Math.min(totalMobilePages, mobilePage + 1))}
                    disabled={mobilePage === totalMobilePages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No se encontraron pedidos</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="h-10 px-2 text-[10px] font-medium md:h-11 md:px-2.5 md:text-xs lg:px-3 lg:text-sm w-[14%]">N° Orden</TableHead>
                    <TableHead className="h-10 px-2 text-[10px] font-medium md:h-11 md:px-2.5 md:text-xs lg:px-3 lg:text-sm w-[22%]">Cliente</TableHead>
                    <TableHead className="h-10 px-2 text-[10px] font-medium md:h-11 md:px-2.5 md:text-xs lg:px-3 lg:text-sm w-[11%]">Fecha</TableHead>
                    <TableHead className="h-10 px-2 text-[10px] font-medium md:h-11 md:px-2.5 md:text-xs lg:px-3 lg:text-sm w-[14%]">Estado</TableHead>
                    <TableHead className="h-10 px-2 text-[10px] font-medium md:h-11 md:px-2.5 md:text-xs lg:px-3 lg:text-sm w-[13%]">Total</TableHead>
                    <TableHead className="h-10 px-2 text-[10px] font-medium md:h-11 md:px-2.5 md:text-xs lg:px-3 lg:text-sm w-[10%]">Puntos</TableHead>
                    <TableHead className="h-10 px-2 text-[10px] font-medium md:h-11 md:px-2.5 md:text-xs lg:px-3 lg:text-sm w-[16%]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOrders.length > 0 ? (
                    displayOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="px-2 py-2.5 font-mono font-semibold text-xs md:px-2.5 md:py-3 lg:px-3 lg:text-sm">
                          <div className="truncate">{order.numeroOrden}</div>
                        </TableCell>
                        <TableCell className="px-2 py-2.5 md:px-2.5 md:py-3 lg:px-3">
                          <div className="max-w-[200px]">
                            <p className="font-medium text-xs lg:text-sm truncate">{order.userName}</p>
                            <p className="text-muted-foreground text-[10px] lg:text-xs truncate">{order.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2.5 text-muted-foreground text-xs md:px-2.5 md:py-3 lg:px-3 lg:text-sm">
                          <div className="whitespace-nowrap">
                            {new Date(order.fechaCreacion).toLocaleDateString("es-CL")}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2.5 md:px-2.5 md:py-3 lg:px-3">
                          <Badge className={`text-[10px] lg:text-xs whitespace-nowrap ${getEstadoColor(order.estado)}`}>
                            {getEstadoIcon(order.estado)}
                            <span className="ml-1 capitalize">{order.estado}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 py-2.5 font-semibold text-primary text-xs md:px-2.5 md:py-3 lg:px-3 lg:text-sm">
                          <div className="whitespace-nowrap">
                            ${(order.total || 0).toLocaleString("es-CL")}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2.5 md:px-2.5 md:py-3 lg:px-3">
                          <div className="text-xs lg:text-sm whitespace-nowrap">
                            <p className="text-green-600">+{order.puntosGanados}</p>
                            {order.puntosUsados > 0 && (
                              <p className="text-red-600">-{order.puntosUsados}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-2 py-2.5 md:px-2.5 md:py-3 lg:px-3">
                          <div className="flex gap-1 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewOrderDetails(order)}
                              className="h-7 px-2 text-[10px] lg:h-8 lg:px-2.5 lg:text-xs"
                            >
                              <Eye className="mr-0.5 h-3 w-3 lg:mr-1 lg:h-3.5 lg:w-3.5" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditOrder(order)}
                              className="h-7 px-2 text-[10px] lg:h-8 lg:px-2.5 lg:text-xs"
                            >
                              <Edit className="mr-0.5 h-3 w-3 lg:mr-1 lg:h-3.5 lg:w-3.5" />
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-xs md:text-sm">
                        No se encontraron pedidos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando pedidos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      {/* Header Section */}
      <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">Pedidos</h1>
            <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm md:text-base">
              Gestiona todos los pedidos y su estado de entrega
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3 md:mt-6 lg:mt-8 lg:grid-cols-6 lg:gap-4">
            <Card
              className={`p-3 transition-all hover:shadow-md sm:p-4 lg:p-5 cursor-pointer ${activeTab === "pendiente" ? "ring-2 ring-primary" : ""}`}
              onClick={() => setActiveTab("pendiente")}
            >
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-[10px] font-medium text-muted-foreground leading-tight sm:text-xs md:text-sm">Pendientes</p>
                <p className="mt-1 text-base font-bold text-yellow-400 sm:text-lg md:text-xl lg:text-2xl">
                  {orders.filter((o) => o.estado === "pendiente").length}
                </p>
              </div>
            </Card>
            <Card
              className={`p-3 transition-all hover:shadow-md sm:p-4 lg:p-5 cursor-pointer ${activeTab === "procesando" ? "ring-2 ring-primary" : ""}`}
              onClick={() => setActiveTab("procesando")}
            >
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-[10px] font-medium text-muted-foreground leading-tight sm:text-xs md:text-sm">Procesando</p>
                <p className="mt-1 text-base font-bold text-blue-400 sm:text-lg md:text-xl lg:text-2xl">
                  {orders.filter((o) => o.estado === "procesando").length}
                </p>
              </div>
            </Card>
            <Card
              className={`p-3 transition-all hover:shadow-md sm:p-4 lg:p-5 cursor-pointer ${activeTab === "enviado" ? "ring-2 ring-primary" : ""}`}
              onClick={() => setActiveTab("enviado")}
            >
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-[10px] font-medium text-muted-foreground leading-tight sm:text-xs md:text-sm">Enviados</p>
                <p className="mt-1 text-base font-bold text-purple-400 sm:text-lg md:text-xl lg:text-2xl">
                  {orders.filter((o) => o.estado === "enviado").length}
                </p>
              </div>
            </Card>
            <Card
              className={`p-3 transition-all hover:shadow-md sm:p-4 lg:p-5 cursor-pointer ${activeTab === "entregado" ? "ring-2 ring-primary" : ""}`}
              onClick={() => setActiveTab("entregado")}
            >
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-[10px] font-medium text-muted-foreground leading-tight sm:text-xs md:text-sm">Entregados</p>
                <p className="mt-1 text-base font-bold text-green-400 sm:text-lg md:text-xl lg:text-2xl">
                  {orders.filter((o) => o.estado === "entregado").length}
                </p>
              </div>
            </Card>
            <Card
              className={`p-3 transition-all hover:shadow-md sm:p-4 lg:p-5 cursor-pointer ${activeTab === "cancelado" ? "ring-2 ring-primary" : ""}`}
              onClick={() => setActiveTab("cancelado")}
            >
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-[10px] font-medium text-muted-foreground leading-tight sm:text-xs md:text-sm">Cancelados</p>
                <p className="mt-1 text-base font-bold text-red-400 sm:text-lg md:text-xl lg:text-2xl">
                  {orders.filter((o) => o.estado === "cancelado").length}
                </p>
              </div>
            </Card>
            <Card
              className={`p-3 transition-all hover:shadow-md sm:p-4 lg:p-5 cursor-pointer ${activeTab === "rechazado" ? "ring-2 ring-primary" : ""}`}
              onClick={() => setActiveTab("rechazado")}
            >
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <p className="text-[10px] font-medium text-muted-foreground leading-tight sm:text-xs md:text-sm">Rechazados</p>
                <p className="mt-1 text-base font-bold text-orange-400 sm:text-lg md:text-xl lg:text-2xl">
                  {orders.filter((o) => o.estado === "rechazado").length}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 pb-6 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="shadow-sm">
            <div className="p-4 md:p-6">
              {/* Mobile: Tabs first, then Search */}
              <div className="block md:hidden">
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="flex h-auto w-full overflow-x-auto justify-start gap-2 bg-transparent p-0">
                    <TabsTrigger value="todos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border px-4 py-2 text-xs">
                      Todos
                    </TabsTrigger>
                    <TabsTrigger value="pendiente" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white rounded-full border px-4 py-2 text-xs">
                      Pendientes
                    </TabsTrigger>
                    <TabsTrigger value="procesando" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-full border px-4 py-2 text-xs">
                      Procesando
                    </TabsTrigger>
                    <TabsTrigger value="enviado" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-full border px-4 py-2 text-xs">
                      Enviados
                    </TabsTrigger>
                    <TabsTrigger value="entregado" className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-full border px-4 py-2 text-xs">
                      Entregados
                    </TabsTrigger>
                    <TabsTrigger value="cancelado" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-full border px-4 py-2 text-xs">
                      Cancelados
                    </TabsTrigger>
                    <TabsTrigger value="rechazado" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-full border px-4 py-2 text-xs">
                      Rechazados
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="todos" className="mt-4">
                    {renderOrderTable()}
                  </TabsContent>
                  <TabsContent value="pendiente" className="mt-4">
                    {renderOrderTable("pendiente")}
                  </TabsContent>
                  <TabsContent value="procesando" className="mt-4">
                    {renderOrderTable("procesando")}
                  </TabsContent>
                  <TabsContent value="enviado" className="mt-4">
                    {renderOrderTable("enviado")}
                  </TabsContent>
                  <TabsContent value="entregado" className="mt-4">
                    {renderOrderTable("entregado")}
                  </TabsContent>
                  <TabsContent value="cancelado" className="mt-4">
                    {renderOrderTable("cancelado")}
                  </TabsContent>
                  <TabsContent value="rechazado" className="mt-4">
                    {renderOrderTable("rechazado")}
                  </TabsContent>
                </Tabs>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pedidos por número, cliente o email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      resetMobilePage();
                    }}
                    className="h-10 pl-10 pr-4"
                  />
                </div>
              </div>

              {/* Desktop: Search first, then Tabs */}
              <div className="hidden md:block">
                {/* Search and Filters */}
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pedidos por número, cliente o email..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        resetMobilePage();
                      }}
                      className="h-10 pl-10 pr-4 md:h-11"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                  <TabsList className="grid h-10 w-full grid-cols-7 md:h-11">
                    <TabsTrigger value="todos" className="text-xs md:text-sm">
                      Todos
                    </TabsTrigger>
                    <TabsTrigger value="pendiente" className="text-xs md:text-sm">
                      Pendientes
                    </TabsTrigger>
                    <TabsTrigger value="procesando" className="text-xs md:text-sm">
                      Procesando
                    </TabsTrigger>
                    <TabsTrigger value="enviado" className="text-xs md:text-sm">
                      Enviados
                    </TabsTrigger>
                    <TabsTrigger value="entregado" className="text-xs md:text-sm">
                      Entregados
                    </TabsTrigger>
                    <TabsTrigger value="cancelado" className="text-xs md:text-sm">
                      Cancelados
                    </TabsTrigger>
                    <TabsTrigger value="rechazado" className="text-xs md:text-sm">
                      Rechazados
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="todos" className="mt-4">
                    {renderOrderTable()}
                  </TabsContent>
                  <TabsContent value="pendiente" className="mt-4">
                    {renderOrderTable("pendiente")}
                  </TabsContent>
                  <TabsContent value="procesando" className="mt-4">
                    {renderOrderTable("procesando")}
                  </TabsContent>
                  <TabsContent value="enviado" className="mt-4">
                    {renderOrderTable("enviado")}
                  </TabsContent>
                  <TabsContent value="entregado" className="mt-4">
                    {renderOrderTable("entregado")}
                  </TabsContent>
                  <TabsContent value="cancelado" className="mt-4">
                    {renderOrderTable("cancelado")}
                  </TabsContent>
                  <TabsContent value="rechazado" className="mt-4">
                    {renderOrderTable("rechazado")}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Mostrando {filteredOrders.length} de {orders.length} pedidos
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <OrderDetailModal
        order={selectedOrder}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />

      <OrderEditModal
        order={selectedOrder}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveOrderChanges}
      />
    </div>
  );
};

export default Pedidos;
