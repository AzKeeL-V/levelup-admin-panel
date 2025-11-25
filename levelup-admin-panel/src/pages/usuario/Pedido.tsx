import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { Order } from "@/types/Order";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Download, FileText } from "lucide-react";
import ReceiptModal from "@/components/ReceiptModal";

const Pedido = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { orders, loading } = useOrders();
    const [order, setOrder] = useState<Order | null>(null);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

    useEffect(() => {
        if (id && orders.length > 0) {
            const foundOrder = orders.find((o) => o.id === id);
            if (foundOrder) {
                setOrder(foundOrder);
            }
        }
    }, [id, orders]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-white">Cargando pedido...</span>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <Package className="w-16 h-16 text-slate-600 mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Pedido no encontrado</h1>
                    <p className="text-slate-400 mb-6">El pedido que buscas no existe o no tienes permisos para verlo.</p>
                    <Button onClick={() => navigate("/usuario/perfil")} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Perfil
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex flex-col">
            <Header />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/usuario/perfil")}
                    className="mb-6 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Mis Pedidos
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            Pedido #{order.numeroOrden}
                            <Badge
                                className={`text-sm ${order.estado === "entregado"
                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                        : order.estado === "pendiente"
                                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    } border`}
                            >
                                {order.estado.toUpperCase()}
                            </Badge>
                        </h1>
                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Realizado el {new Date(order.fechaCreacion).toLocaleDateString("es-CL", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsReceiptModalOpen(true)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Boleta
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Productos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-slate-700/30 rounded-lg">
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-20 h-20 object-cover rounded-lg bg-slate-800"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-white font-medium">{item.productName}</h3>
                                                    <p className="text-slate-400 text-sm">Cantidad: {item.quantity}</p>
                                                </div>
                                                <p className="text-white font-bold">{formatPrice(item.totalPrice)}</p>
                                            </div>
                                            {item.puntosGanados > 0 && (
                                                <p className="text-yellow-400 text-sm mt-2">
                                                    +{item.puntosGanados * item.quantity} pts ganados
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Dirección de Envío
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-slate-300">
                                    <p className="font-medium text-white">{order.direccionEnvio.nombre}</p>
                                    <p>{order.direccionEnvio.calle} {order.direccionEnvio.numero}</p>
                                    {order.direccionEnvio.apartamento && <p>{order.direccionEnvio.apartamento}</p>}
                                    <p>{order.direccionEnvio.ciudad}, {order.direccionEnvio.region}</p>
                                    <p>Teléfono: {order.direccionEnvio.telefono}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Summary */}
                    <div className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Resumen de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-300">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    {order.descuentoDuoc > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Descuento DUOC</span>
                                            <span>-{formatPrice(order.descuentoDuoc)}</span>
                                        </div>
                                    )}
                                    {order.descuentoPuntos > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Descuento Puntos</span>
                                            <span>-{formatPrice(order.descuentoPuntos)}</span>
                                        </div>
                                    )}
                                    <Separator className="bg-slate-600 my-2" />
                                    <div className="flex justify-between text-white font-bold text-lg">
                                        <span>Total</span>
                                        <span>{formatPrice(order.total)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-700">
                                    <p className="text-sm text-slate-400 mb-1">Método de Pago</p>
                                    <p className="text-white capitalize">{order.metodoPago}</p>
                                </div>

                                {order.puntosGanados > 0 && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                        <p className="text-yellow-400 text-sm text-center font-medium">
                                            🎉 Ganaste {order.puntosGanados} puntos
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />

            <ReceiptModal
                isOpen={isReceiptModalOpen}
                onClose={() => setIsReceiptModalOpen(false)}
                order={order}
            />
        </div>
    );
};

export default Pedido;
