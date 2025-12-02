import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, UserPlus } from "lucide-react";
import { useUsers } from "@/context/UserContext";
import { User } from "@/types/User";
import { validateRut } from "@/utils/validationUtils";

// Regiones de Chile
const CHILEAN_REGIONS = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena"
];

interface UserCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

interface FieldValidation {
  isValid: boolean;
  error?: string;
}

const UserCreateForm = ({ open, onOpenChange, onUserCreated }: UserCreateFormProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rut: "",
    telefono: "+569",
    tipo: "normal" as "normal" | "duoc",
    rol: "user" as "user" | "admin",
    // Dirección
    calle: "",
    numero: "",
    apartamento: "",
    ciudad: "",
    region: "",

    aceptaTerminos: false,
    aceptaPoliticaPrivacidad: false,
  });

  const [fieldValidation, setFieldValidation] = useState<Record<string, FieldValidation>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [duocBenefitDetected, setDuocBenefitDetected] = useState(false);

  const { addUser } = useUsers();

  // Validación de campos
  const validateField = (fieldName: string, value: any): FieldValidation => {
    switch (fieldName) {
      case 'nombre':
        if (!value?.trim()) return { isValid: false, error: "El nombre es obligatorio" };
        if (value.trim().length < 2) return { isValid: false, error: "Mínimo 2 caracteres" };
        return { isValid: true };

      case 'correo':
        if (!value?.trim()) return { isValid: false, error: "El correo es obligatorio" };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return { isValid: false, error: "Formato inválido" };
        return { isValid: true };

      case 'contraseña':
        if (!value?.trim()) return { isValid: false, error: "La contraseña es obligatoria" };
        if (value.length < 6) return { isValid: false, error: "Mínimo 6 caracteres" };
        return { isValid: true };

      case 'rut':
        if (!value?.trim()) return { isValid: false, error: "El RUT es obligatorio" };
        if (!validateRut(value)) return { isValid: false, error: "RUT inválido (ej: 12.345.678-5)" };
        return { isValid: true };

      case 'telefono':
        if (!value?.trim()) return { isValid: false, error: "El teléfono es obligatorio" };
        const phoneRegex = /^\+569\d{8}$/;
        if (!phoneRegex.test(value)) return { isValid: false, error: "Debe ser +569 seguido de 8 dígitos" };
        return { isValid: true };

      case 'calle':
        if (!value?.trim()) return { isValid: false, error: "La calle es obligatoria" };
        return { isValid: true };

      case 'numero':
        if (!value?.trim()) return { isValid: false, error: "El número es obligatorio" };
        return { isValid: true };

      case 'ciudad':
        if (!value?.trim()) return { isValid: false, error: "La ciudad es obligatoria" };
        return { isValid: true };

      case 'region':
        if (!value?.trim()) return { isValid: false, error: "La región es obligatoria" };
        return { isValid: true };



      default:
        return { isValid: true };
    }
  };

  // Formatear número de teléfono
  const formatPhoneNumber = (value: string) => {
    // Remover todo excepto dígitos
    const digits = value.replace(/\D/g, '');

    // Si empieza con 569, mantenerlo, sino agregarlo
    if (digits.startsWith('569')) {
      return '+' + digits.slice(0, 11); // +569 + 8 dígitos = 11 total
    } else {
      // Tomar solo los últimos dígitos después de 569
      const phoneDigits = digits.replace(/^569/, '').slice(0, 8);
      return '+569' + phoneDigits;
    }
  };

  // Actualizar campo
  const updateField = (fieldName: string, value: any) => {
    let processedValue = value;

    // Formatear teléfono automáticamente
    if (fieldName === 'telefono') {
      processedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [fieldName]: processedValue }));

    // Validar
    const validation = validateField(fieldName, processedValue);
    setFieldValidation(prev => ({ ...prev, [fieldName]: validation }));

    if (submitError) setSubmitError(null);

    // Detectar beneficio DUOC
    if (fieldName === 'correo' && value) {
      const isDuocEmail = value.toLowerCase().includes('@duoc.cl') || value.toLowerCase().includes('@duocuc.cl');
      setDuocBenefitDetected(isDuocEmail);
      if (isDuocEmail) {
        setFormData(prev => ({ ...prev, tipo: "duoc" }));
      }
    }
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    const requiredFields = ['nombre', 'correo', 'contraseña', 'rut', 'telefono', 'calle', 'numero', 'ciudad', 'region'];
    const allRequiredValid = requiredFields.every(field => fieldValidation[field]?.isValid === true);
    const termsAccepted = formData.aceptaTerminos && formData.aceptaPoliticaPrivacidad;
    return allRequiredValid && termsAccepted;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      setSubmitError("Por favor complete todos los campos correctamente");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const userData: Omit<User, "id"> = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim().toLowerCase(),
        contraseña: formData.contraseña,
        rut: formData.rut,
        tipo: formData.tipo,
        puntos: 0,
        nivel: "bronce",
        telefono: formData.telefono,
        rol: formData.rol,
        direcciones: [{
          calle: formData.calle.trim(),
          numero: formData.numero.trim(),
          apartamento: formData.apartamento.trim() || undefined,
          ciudad: formData.ciudad.trim(),
          region: formData.region
        }],
        preferenciasComunicacion: { email: true, sms: false },
        intereses: [],
        aceptaTerminos: formData.aceptaTerminos,
        aceptaPoliticaPrivacidad: formData.aceptaPoliticaPrivacidad,
        captchaVerificado: true,
        fechaRegistro: new Date().toISOString(),
        activo: true,
        codigoReferido: `REF-${Date.now()}`,
      };

      await addUser(userData);

      // Limpiar formulario
      setFormData({
        nombre: "",
        correo: "",
        contraseña: "",
        rut: "",
        telefono: "+569",
        tipo: "normal",
        rol: "user",
        calle: "",
        numero: "",
        apartamento: "",
        ciudad: "",
        region: "",
        aceptaTerminos: false,
        aceptaPoliticaPrivacidad: false,
      });

      setFieldValidation({});
      onOpenChange(false);
      onUserCreated?.();

    } catch (error) {
      console.error("Error al crear usuario:", error);
      setSubmitError(error instanceof Error ? error.message : "Error al crear el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar modal
  const handleClose = () => {
    if (isSubmitting) return;
    setFormData({
      nombre: "",
      correo: "",
      contraseña: "",
      rut: "",
      telefono: "+569",
      tipo: "normal",
      rol: "user",
      calle: "",
      numero: "",
      apartamento: "",
      ciudad: "",
      region: "",
      aceptaTerminos: false,
      aceptaPoliticaPrivacidad: false,
    });
    setFieldValidation({});
    setSubmitError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Agregar Nuevo Usuario
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <div className="relative">
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => updateField('nombre', e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className={fieldValidation.nombre?.isValid === false ? "border-red-500" : fieldValidation.nombre?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.nombre && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.nombre.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldValidation.nombre?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.nombre.error}</p>
                )}
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico *</Label>
                <div className="relative">
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => updateField('correo', e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    className={fieldValidation.correo?.isValid === false ? "border-red-500" : fieldValidation.correo?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.correo && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.correo.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldValidation.correo?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.correo.error}</p>
                )}
                {duocBenefitDetected && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Beneficio DUOC detectado
                    </p>
                  </div>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="contraseña">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="contraseña"
                    type="password"
                    value={formData.contraseña}
                    onChange={(e) => updateField('contraseña', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={fieldValidation.contraseña?.isValid === false ? "border-red-500" : fieldValidation.contraseña?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.contraseña && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.contraseña.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldValidation.contraseña?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.contraseña.error}</p>
                )}
              </div>

              {/* RUT */}
              <div className="space-y-2">
                <Label htmlFor="rut">RUT *</Label>
                <div className="relative">
                  <Input
                    id="rut"
                    value={formData.rut}
                    onChange={(e) => updateField('rut', e.target.value)}
                    placeholder="12.345.678-9"
                    className={fieldValidation.rut?.isValid === false ? "border-red-500" : fieldValidation.rut?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.rut && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.rut.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldValidation.rut?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.rut.error}</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <div className="relative">
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => updateField('telefono', e.target.value)}
                    placeholder="+56912345678"
                    className={fieldValidation.telefono?.isValid === false ? "border-red-500" : fieldValidation.telefono?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.telefono && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.telefono.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldValidation.telefono?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.telefono.error}</p>
                )}
                <p className="text-xs text-muted-foreground">Formato: +569 seguido de 8 dígitos</p>
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Usuario *</Label>
                <Select value={formData.tipo} onValueChange={(value) => updateField('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="duoc">DUOC UC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rol */}
              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select value={formData.rol} onValueChange={(value) => updateField('rol', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dirección</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Calle */}
              <div className="space-y-2">
                <Label htmlFor="calle">Calle *</Label>
                <Input
                  id="calle"
                  value={formData.calle}
                  onChange={(e) => updateField('calle', e.target.value)}
                  placeholder="Ej: Avenida Providencia"
                />
                {fieldValidation.calle?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.calle.error}</p>
                )}
              </div>

              {/* Número */}
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => updateField('numero', e.target.value)}
                  placeholder="123"
                />
                {fieldValidation.numero?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.numero.error}</p>
                )}
              </div>

              {/* Apartamento */}
              <div className="space-y-2">
                <Label htmlFor="apartamento">Apartamento (opcional)</Label>
                <Input
                  id="apartamento"
                  value={formData.apartamento}
                  onChange={(e) => updateField('apartamento', e.target.value)}
                  placeholder="4B"
                />
              </div>

              {/* Región */}
              <div className="space-y-2">
                <Label htmlFor="region">Región *</Label>
                <Select value={formData.region} onValueChange={(value) => updateField('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una región" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHILEAN_REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldValidation.region?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.region.error}</p>
                )}
              </div>



              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Input
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={(e) => updateField('ciudad', e.target.value)}
                  placeholder="Ej: Santiago"
                />
                {fieldValidation.ciudad?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.ciudad.error}</p>
                )}
              </div>
            </div>
          </div>

          {/* Términos y Condiciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Términos y Condiciones</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onCheckedChange={(checked) => updateField('aceptaTerminos', checked)}
                />
                <Label htmlFor="aceptaTerminos" className="text-sm">
                  Acepto los términos y condiciones de uso *
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aceptaPoliticaPrivacidad"
                  checked={formData.aceptaPoliticaPrivacidad}
                  onCheckedChange={(checked) => updateField('aceptaPoliticaPrivacidad', checked)}
                />
                <Label htmlFor="aceptaPoliticaPrivacidad" className="text-sm">
                  Acepto la política de privacidad *
                </Label>
              </div>
            </div>
          </div>

          {/* Error de envío */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creando...
                </div>
              ) : (
                "Crear Usuario"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateForm;
