import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/context/UserContext";
import { useProducts } from "@/context/ProductContext"; // Also missing based on usage
import { RedemptionOrderRepository } from "@/repositories/RedemptionOrderRepository"; // Also likely missing
import { RedemptionOrder, RedemptionReceipt as ReceiptType } from "@/types/RedemptionOrder"; // Also likely missing
import { Product } from "@/types/Product"; // Also likely missing
import { ArrowLeft, Package, MapPin, Truck, AlertCircle } from "lucide-react"; // Also likely missing
import Header from "@/components/Header"; // Also likely missing
import Footer from "@/components/Footer"; // Also likely missing
import RedemptionReceipt from "../components/RedemptionReceipt"; // Also likely missing
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Also likely missing
import { Alert, AlertDescription } from "@/components/ui/alert"; // Also likely missing
import { toast } from "sonner";

const RedemptionCheckout = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();

  const [metodoRetiro, setMetodoRetiro] = useState<"retiro" | "envio">("retiro");
  const [selectedDireccion, setSelectedDireccion] = useState<string>("");
  const [customDireccion, setCustomDireccion] = useState({
    calle: "",
    numero: "",
    departamento: "",
    ciudad: "",
    region: "",
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useUsers();
  const product = products.find(p => p.codigo === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-white text-lg">Producto no encontrado</p>
          <Button onClick={() => navigate("/rewards-store")} className="mt-4">
            Volver a Tienda de Recompensas
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const requiredPoints = product.puntos || 0;
  const userPoints = currentUser.puntos || 0;
  const hasEnoughPoints = userPoints >= requiredPoints;

  const handleSubmitRedemption = async () => {
    if (!hasEnoughPoints) {
      toast.warning("No tienes suficientes puntos");
      return;
    }

    if (!selectedDireccion && (!customDireccion.calle || !customDireccion.ciudad)) {
      toast.warning("Debes ingresar una dirección de envío");
      return;
    }

    setLoading(true);

    try {
      // Determinar dirección
      let direccionEnvio = customDireccion;
      if (selectedDireccion && currentUser.direcciones) {
        const dirSeleccionada = currentUser.direcciones.find(
          (d: any) => d.id === selectedDireccion
        );
        if (dirSeleccionada) {
          direccionEnvio = {
            calle: dirSeleccionada.calle,
            numero: dirSeleccionada.numero,
            departamento: dirSeleccionada.apartamento || "",
            ciudad: dirSeleccionada.ciudad,
            region: dirSeleccionada.region
          };
        }
      }

      // Crear orden de canje
      const redemptionOrder: RedemptionOrder = {
        id: `${product.codigo}_${Date.now()}`,
        usuarioId: currentUser.id,
        productId: product.codigo,
        productName: product.nombre,
        productImage: product.imagen,
        puntosUsados: requiredPoints,
        cantidad: 1,
        direccionEnvio,
        metodoRetiro,
        estado: "pendiente",
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        notas: `Canje de recompensas - Método: ${metodoRetiro === "retiro" ? "Retiro en sucursal" : "Envío a domicilio"}`,
      };

      // Guardar orden
      RedemptionOrderRepository.create(redemptionOrder);

      // Descontar puntos del usuario
      const updatedUser = {
        ...currentUser,
        puntos: userPoints - requiredPoints,
      };
      localStorage.setItem("current_user", JSON.stringify(updatedUser));

      // Crear recibo
      const orderNumber = RedemptionOrderRepository.generateOrderNumber();
      const receiptData: ReceiptType = {
        id: `receipt_${redemptionOrder.id}`,
        redemptionOrderId: redemptionOrder.id,
        numeroRecibo: orderNumber,
        fecha: new Date().toLocaleDateString("es-CL"),
        usuario: {
          nombre: currentUser.nombre,
          correo: currentUser.correo,
        },
        producto: {
          nombre: product.nombre,
          codigo: product.codigo,
          puntosRequeridos: requiredPoints,
        },
        puntosUsados: requiredPoints,
        puntosRestantes: userPoints - requiredPoints,
        direccionEnvio: `${direccionEnvio.calle} ${direccionEnvio.numero}, ${direccionEnvio.ciudad}, ${direccionEnvio.region}`,
        metodoRetiro: metodoRetiro === "retiro" ? "Retiro en sucursal" : "Envío a domicilio",
        estado: "Canje confirmado - Pendiente de procesamiento",
      };

      setReceipt(receiptData);
      setShowReceipt(true);
    } catch (error) {
      console.error("Error processing redemption:", error);
      toast.error("Error al procesar el canje. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (showReceipt && receipt) {
    return (
      <RedemptionReceipt
        receipt={receipt}
        onClose={() => navigate("/rewards-store")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/rewards-store")}
            className="text-slate-400 hover:text-white p-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">Canjear Producto</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Detalles del Producto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {product.nombre}
                    </h2>
                    <p className="text-slate-400 text-sm mb-4">
                      {product.descripcion}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        🏆 {requiredPoints} puntos
                      </Badge>
                      {product.marca && (
                        <Badge variant="outline" className="text-slate-300">
                          {product.marca}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Points Check */}
            {hasEnoughPoints ? (
              <Alert className="bg-green-500/10 border-green-500/20">
                <AlertCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">
                  ✅ Tienes suficientes puntos para este canje
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  ❌ Te faltan {requiredPoints - userPoints} puntos para este canje
                </AlertDescription>
              </Alert>
            )}

            {/* Dirección de Envío */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved Addresses */}
                {currentUser.direcciones && currentUser.direcciones.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-white">Mis direcciones guardadas</Label>
                    <RadioGroup value={selectedDireccion} onValueChange={setSelectedDireccion}>
                      {currentUser.direcciones.map((dir: any) => (
                        <div key={dir.id} className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg">
                          <RadioGroupItem value={dir.id} id={dir.id} />
                          <Label htmlFor={dir.id} className="text-slate-300 cursor-pointer flex-1">
                            {dir.calle} {dir.numero}, {dir.ciudad}, {dir.region}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Divider */}
                {currentUser.direcciones && currentUser.direcciones.length > 0 && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 bg-slate-800 text-slate-400">O</span>
                    </div>
                  </div>
                )}

                {/* New Address */}
                <div className="space-y-3">
                  <Label className="text-white">
                    {currentUser.direcciones && currentUser.direcciones.length > 0
                      ? "Ingresar nueva dirección"
                      : "Dirección de envío"}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="calle" className="text-xs text-slate-400">
                        Calle
                      </Label>
                      <Input
                        id="calle"
                        placeholder="Ej: Av. Principal"
                        value={customDireccion.calle}
                        onChange={(e) =>
                          setCustomDireccion({ ...customDireccion, calle: e.target.value })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="numero" className="text-xs text-slate-400">
                        Número
                      </Label>
                      <Input
                        id="numero"
                        placeholder="Ej: 123"
                        value={customDireccion.numero}
                        onChange={(e) =>
                          setCustomDireccion({ ...customDireccion, numero: e.target.value })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="departamento" className="text-xs text-slate-400">
                        Departamento (opcional)
                      </Label>
                      <Input
                        id="departamento"
                        placeholder="Ej: Depto 5B"
                        value={customDireccion.departamento}
                        onChange={(e) =>
                          setCustomDireccion({
                            ...customDireccion,
                            departamento: e.target.value,
                          })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ciudad" className="text-xs text-slate-400">
                        Ciudad
                      </Label>
                      <Input
                        id="ciudad"
                        placeholder="Ej: Santiago"
                        value={customDireccion.ciudad}
                        onChange={(e) =>
                          setCustomDireccion({ ...customDireccion, ciudad: e.target.value })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="region" className="text-xs text-slate-400">
                        Región
                      </Label>
                      <Input
                        id="region"
                        placeholder="Ej: RM"
                        value={customDireccion.region}
                        onChange={(e) =>
                          setCustomDireccion({ ...customDireccion, region: e.target.value })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Método de Retiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={metodoRetiro} onValueChange={(val: any) => setMetodoRetiro(val)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg">
                      <RadioGroupItem value="retiro" id="retiro" />
                      <Label
                        htmlFor="retiro"
                        className="text-slate-300 cursor-pointer flex-1 flex items-center justify-between"
                      >
                        <span>Retiro en sucursal</span>
                        <Badge className="bg-green-500/20 text-green-400">Gratis</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-slate-700/50 rounded-lg">
                      <RadioGroupItem value="envio" id="envio" />
                      <Label
                        htmlFor="envio"
                        className="text-slate-300 cursor-pointer flex-1 flex items-center justify-between"
                      >
                        <span>Envío a domicilio</span>
                        <Badge variant="outline" className="text-yellow-400">
                          Consultar costo
                        </Badge>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-20">
              <CardHeader>
                <CardTitle className="text-white">Resumen del Canje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Puntos disponibles:</span>
                    <span className="font-medium text-yellow-400">{userPoints}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Puntos a usar:</span>
                    <span className="font-medium">{requiredPoints}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between text-white font-bold">
                      <span>Puntos restantes:</span>
                      <span
                        className={
                          userPoints - requiredPoints >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {userPoints - requiredPoints}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-yellow-400 text-xs">
                    📦 El producto será {metodoRetiro === "retiro" ? "disponible para retiro en sucursal" : "enviado a tu domicilio"}
                  </p>
                </div>

                <Button
                  onClick={handleSubmitRedemption}
                  disabled={!hasEnoughPoints || loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Procesando..." : "Confirmar Canje"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/rewards-store")}
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RedemptionCheckout;
