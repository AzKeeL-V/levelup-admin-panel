import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    Package,
    Search,
    Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { Order } from "@/types/Order";

const Ventas = () => {
    const navigate = useNavigate();
    const { orders, loading } = useOrders();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState<string>("all");
    const [filterPeriodo, setFilterPeriodo] = useState<string>("all");

    // Calculate statistics
    const totalVentas = orders.length;
    const totalIngresos = orders.reduce((sum, order) => sum + order.total, 0);
    const ventasCompletadas = orders.filter(o => o.estado === "entregado").length;
    const ventasPendientes = orders.filter(o => o.estado === "pendiente" || o.estado === "procesando").length;

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesEstado = filterEstado === "all" || order.estado === filterEstado;

        let matchesPeriodo = true;
        if (filterPeriodo !== "all") {
            const orderDate = new Date(order.fechaCreacion);
            const now = new Date();

            switch (filterPeriodo) {
                case "today":
                    matchesPeriodo = orderDate.toDateString() === now.toDateString();
                    break;
                case "week":
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesPeriodo = orderDate >= weekAgo;
                    break;
                case "month":
                    matchesPeriodo =
                        orderDate.getMonth() === now.getMonth() &&
                        orderDate.getFullYear() === now.getFullYear();
                    break;
            }
        }

        return matchesSearch && matchesEstado && matchesPeriodo;
    });

    const getEstadoBadgeColor = (estado: string) => {
        switch (estado) {
            case "entregado":
                return "bg-green-500/10 text-green-400 border-green-500/20";
            case "pendiente":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "procesando":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "cancelado":
                return "bg-red-500/10 text-red-400 border-red-500/20";
            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                        Ventas Realizadas
                    </h1>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">
                                Total Ventas
                            </CardTitle>
                            <ShoppingBag className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{totalVentas}</div>
                            <p className="text-xs text-slate-400">Pedidos registrados</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">
                                Ingresos Totales
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-400">
                                {formatCurrency(totalIngresos)}
                            </div>
                            <p className="text-xs text-slate-400">Suma de todos los pedidos</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">
                                Completadas
                            </CardTitle>
                            <Package className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{ventasCompletadas}</div>
                            <p className="text-xs text-slate-400">Pedidos entregados</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">
                                Pendientes
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-400">{ventasPendientes}</div>
                            <p className="text-xs text-slate-400">En proceso</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="bg-slate-800/50 border-slate-700 mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Buscar por número, cliente o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                />
                            </div>

                            <Select value={filterEstado} onValueChange={setFilterEstado}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Filtrar por estado" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="all" className="text-white hover:bg-slate-600">
                                        Todos los estados
                                    </SelectItem>
                                    <SelectItem value="pendiente" className="text-white hover:bg-slate-600">
                                        Pendiente
                                    </SelectItem>
                                    <SelectItem value="procesando" className="text-white hover:bg-slate-600">
                                        Procesando
                                    </SelectItem>
                                    <SelectItem value="entregado" className="text-white hover:bg-slate-600">
                                        Entregado
                                    </SelectItem>
                                    <SelectItem value="cancelado" className="text-white hover:bg-slate-600">
                                        Cancelado
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Filtrar por período" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                    <SelectItem value="all" className="text-white hover:bg-slate-600">
                                        Todo el tiempo
                                    </SelectItem>
                                    <SelectItem value="today" className="text-white hover:bg-slate-600">
                                        Hoy
                                    </SelectItem>
                                    <SelectItem value="week" className="text-white hover:bg-slate-600">
                                        Última semana
                                    </SelectItem>
                                    <SelectItem value="month" className="text-white hover:bg-slate-600">
                                        Este mes
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Sales Table */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            Listado de Ventas ({filteredOrders.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingBag className="mb-4 h-16 w-16 text-slate-500" />
                                <h3 className="mb-2 text-lg font-semibold text-white">
                                    No se encontraron ventas
                                </h3>
                                <p className="text-slate-400">
                                    {searchTerm || filterEstado !== "all" || filterPeriodo !== "all"
                                        ? "Intenta ajustar los filtros de búsqueda"
                                        : "Aún no hay ventas registradas en el sistema"}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-700 hover:bg-slate-700/50">
                                            <TableHead className="text-slate-300">N° Orden</TableHead>
                                            <TableHead className="text-slate-300">Fecha</TableHead>
                                            <TableHead className="text-slate-300">Cliente</TableHead>
                                            <TableHead className="text-slate-300">Productos</TableHead>
                                            <TableHead className="text-slate-300">Total</TableHead>
                                            <TableHead className="text-slate-300">Estado</TableHead>
                                            <TableHead className="text-slate-300 text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((order) => (
                                            <TableRow
                                                key={order.id}
                                                className="border-slate-700 hover:bg-slate-700/50 transition-colors"
                                            >
                                                <TableCell className="font-medium text-white">
                                                    #{order.numeroOrden}
                                                </TableCell>
                                                <TableCell className="text-slate-300">
                                                    {new Date(order.fechaCreacion).toLocaleDateString("es-CL", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium">
                                                            {order.userName}
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            {order.userEmail}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-300">
                                                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                                </TableCell>
                                                <TableCell className="font-semibold text-green-400">
                                                    {formatCurrency(order.total)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`capitalize border ${getEstadoBadgeColor(order.estado)}`}
                                                    >
                                                        {order.estado}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => navigate(`/usuario/pedido/${order.id}`)}
                                                            className="text-slate-300 hover:text-white hover:bg-slate-600"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Ventas;
