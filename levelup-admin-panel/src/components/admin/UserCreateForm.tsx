import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, UserPlus, X } from "lucide-react";
import { useUsers } from "@/context/UserContext";
import { User } from "@/types/User";
import { validateRut } from "@/utils/validationUtils";

// Lista de intereses disponibles para el usuario (categorías de productos)
const AVAILABLE_INTERESTS = [
  "Juegos de Mesa",
  "Accesorios",
  "Consolas",
  "Computadores Gamers",
  "Sillas Gamers",
  "Mouse",
  "Mousepad",
  "Poleras Personalizadas"
];

// Regiones de Chile con sus ciudades principales
const CHILEAN_REGIONS_CITIES: Record<string, string[]> = {
  "Arica y Parinacota": ["Arica", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte"],
  "Antofagasta": ["Antofagasta", "Calama", "Tocopilla"],
  "Atacama": ["Copiapó", "Vallenar", "Chañaral"],
  "Coquimbo": ["La Serena", "Coquimbo", "Ovalle"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Metropolitana de Santiago": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Peñalolén", "Las Condes", "Providencia"],
  "Libertador General Bernardo O'Higgins": ["Rancagua", "Rengo", "San Vicente"],
  "Maule": ["Talca", "Curicó", "Linares"],
  "Ñuble": ["Chillán", "Chillán Viejo", "Bulnes"],
  "Biobío": ["Concepción", "Talcahuano", "Chiguayante"],
  "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica"],
  "Los Ríos": ["Valdivia", "La Unión", "Río Bueno"],
  "Los Lagos": ["Puerto Montt", "Puerto Varas", "Osorno"],
  "Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Puerto Aysén", "Chile Chico"],
  "Magallanes y de la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir"]
};

const CHILEAN_REGIONS = Object.keys(CHILEAN_REGIONS_CITIES);

interface UserCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

interface ValidationErrors {
  nombre?: string;
  correo?: string;
  contraseña?: string;
  rut?: string;
  telefono?: string;
  calle?: string;
  numero?: string;
  ciudad?: string;
  region?: string;
  comuna?: string;
  codigoPostal?: string;
}

interface FieldValidation {
  isValid: boolean;
  error?: string;
}

const UserCreateForm = ({ open, onOpenChange, onUserCreated }: UserCreateFormProps) => {
  // Estado del formulario - datos del nuevo usuario
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    rut: "",
    telefono: "",
    tipo: "normal" as "normal" | "duoc",
    // Dirección
    calle: "",
    numero: "",
    apartamento: "",
    ciudad: "",
    comuna: "",
    region: "",
    codigoPostal: "",
    // Preferencias
    newsletter: false,
    intereses: [] as string[],
    aceptaTerminos: false,
    aceptaPoliticaPrivacidad: false,
  });

  // Función para obtener las ciudades de una región
  const getCitiesForRegion = (region: string) => {
    return CHILEAN_REGIONS_CITIES[region] || [];
  };

  // Limpiar ciudad cuando cambia la región
  useEffect(() => {
    if (formData.region && !getCitiesForRegion(formData.region).includes(formData.ciudad)) {
      updateField('ciudad', '');
    }
  }, [formData.region]);

  // Estado de validación de campos
  const [fieldValidation, setFieldValidation] = useState<Record<string, FieldValidation>>({});

  // Estado de carga y errores
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Estado para beneficio DUOC detectado
  const [duocBenefitDetected, setDuocBenefitDetected] = useState(false);

  // Hook para acceder a las funciones del contexto de usuarios
  const { addUser } = useUsers();

  // Función para validar un campo individual en tiempo real
  const validateField = (fieldName: string, value: any): FieldValidation => {
    switch (fieldName) {
      case 'nombre':
        if (!value?.trim()) {
          return { isValid: false, error: "El nombre es obligatorio" };
        }
        if (value.trim().length < 2) {
          return { isValid: false, error: "El nombre debe tener al menos 2 caracteres" };
        }
        return { isValid: true };

      case 'correo':
        if (!value?.trim()) {
          return { isValid: false, error: "El correo es obligatorio" };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, error: "Formato de correo inválido" };
        }
        return { isValid: true };

      case 'contraseña':
        if (!value?.trim()) {
          return { isValid: false, error: "La contraseña es obligatoria" };
        }
        if (value.length < 6) {
          return { isValid: false, error: "La contraseña debe tener al menos 6 caracteres" };
        }
        return { isValid: true };

      case 'rut':
        if (!value?.trim()) {
          return { isValid: false, error: "El RUT es obligatorio" };
        }
        // Validación completa del RUT usando la función validateRut
        if (!validateRut(value)) {
          return { isValid: false, error: "El RUT no es válido (ej: 12.345.678-5)" };
        }
        return { isValid: true };

      case 'telefono':
        if (!value?.trim()) {
          return { isValid: false, error: "El teléfono es obligatorio" };
        }
        const phoneRegex = /^\+569\d{8}$/;
        if (!phoneRegex.test(value)) {
          return { isValid: false, error: "Formato inválido (ej: +56912345678)" };
        }
        return { isValid: true };

      case 'calle':
        if (!value?.trim()) {
          return { isValid: false, error: "La calle es obligatoria" };
        }
        return { isValid: true };

      case 'numero':
        if (!value?.trim()) {
          return { isValid: false, error: "El número es obligatorio" };
        }
        if (isNaN(Number(value))) {
          return { isValid: false, error: "El número debe ser válido" };
        }
        return { isValid: true };

      case 'ciudad':
        if (!value?.trim()) {
          return { isValid: false, error: "La ciudad es obligatoria" };
        }
        return { isValid: true };

      case 'region':
        if (!value?.trim()) {
          return { isValid: false, error: "La región es obligatoria" };
        }
        return { isValid: true };

      case 'comuna':
        if (!value?.trim()) {
          return { isValid: false, error: "La comuna es obligatoria" };
        }
        return { isValid: true };

      case 'codigoPostal':
        if (!value?.trim()) {
          return { isValid: false, error: "El código postal es obligatorio" };
        }
        if (value.length !== 7 || isNaN(Number(value))) {
          return { isValid: false, error: "Código postal debe tener 7 dígitos" };
        }
        return { isValid: true };

      default:
        return { isValid: true };
    }
  };

  // Función para actualizar un campo del formulario y validar en tiempo real
  const updateField = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    // Validar el campo inmediatamente
    const validation = validateField(fieldName, value);
    setFieldValidation(prev => ({
      ...prev,
      [fieldName]: validation
    }));

    // Limpiar error de submit si existe
    if (submitError) {
      setSubmitError(null);
    }

    // Detectar beneficio DUOC cuando se escribe el correo
    if (fieldName === 'correo' && value) {
      const isDuocEmail = value.toLowerCase().includes('@duoc.cl') || value.toLowerCase().includes('@duocuc.cl');
      setDuocBenefitDetected(isDuocEmail);

      // Si es correo DUOC, cambiar automáticamente el tipo a "duoc"
      if (isDuocEmail) {
        setFormData(prev => ({ ...prev, tipo: "duoc" }));
      }
    }
  };

  // Función para agregar/quitar intereses
  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      intereses: prev.intereses.includes(interest)
        ? prev.intereses.filter(i => i !== interest)
        : [...prev.intereses, interest]
    }));
  };

  // Función para verificar si todos los campos requeridos son válidos
  const isFormValid = () => {
    const requiredFields = ['nombre', 'correo', 'contraseña', 'rut', 'telefono', 'calle', 'numero', 'ciudad', 'region', 'codigoPostal'];

    // Verificar que todos los campos requeridos estén validados y sean válidos
    const allRequiredValid = requiredFields.every(field =>
      fieldValidation[field]?.isValid === true
    );

    // Verificar términos y condiciones
    const termsAccepted = formData.aceptaTerminos && formData.aceptaPoliticaPrivacidad;

    return allRequiredValid && termsAccepted;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      setSubmitError("Por favor complete todos los campos requeridos correctamente");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Preparar los datos del usuario para enviar al backend
      const userData: Omit<User, "id"> = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim().toLowerCase(),
        contraseña: formData.contraseña, // En producción se hashea
        rut: formData.rut,
        tipo: formData.tipo,
        puntos: 0, // Valor inicial
        nivel: "bronce", // Nivel inicial
        telefono: formData.telefono,
        direcciones: [{
          calle: formData.calle.trim(),
          numero: formData.numero.trim(),
          apartamento: formData.apartamento.trim() || undefined,
          ciudad: formData.ciudad || "",
          comuna: formData.comuna.trim(),
          region: formData.region,
          codigoPostal: formData.codigoPostal,
          pais: "Chile"
        }],
        preferenciasComunicacion: {
          email: true,
          sms: false
        },
        newsletter: formData.newsletter,
        intereses: formData.intereses,
        aceptaTerminos: formData.aceptaTerminos,
        aceptaPoliticaPrivacidad: formData.aceptaPoliticaPrivacidad,
        captchaVerificado: true, // Simulado para el formulario
        fechaRegistro: new Date().toISOString(),
        activo: true,
        codigoReferido: `REF-${Date.now()}`, // Código único generado
      };

      // Llamar a la función del contexto para crear el usuario
      await addUser(userData);

      // Limpiar el formulario
      setFormData({
        nombre: "",
        correo: "",
        contraseña: "",
        rut: "",
        telefono: "",
        tipo: "normal",
        calle: "",
        numero: "",
        apartamento: "",
        ciudad: "",
        comuna: "",
        region: "",
        codigoPostal: "",
        newsletter: false,
        intereses: [],
        aceptaTerminos: false,
        aceptaPoliticaPrivacidad: false,
      });

      // Resetear validaciones
      setFieldValidation({});

      // Cerrar el modal
      onOpenChange(false);

      // Notificar al componente padre
      onUserCreated?.();

    } catch (error) {
      console.error("Error al crear usuario:", error);
      setSubmitError(error instanceof Error ? error.message : "Error al crear el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para cerrar el modal y limpiar el estado
  const handleClose = () => {
    if (isSubmitting) return; // No cerrar si está enviando

    setFormData({
      nombre: "",
      correo: "",
      contraseña: "",
      rut: "",
      telefono: "",
      tipo: "normal",
      calle: "",
      numero: "",
      apartamento: "",
      ciudad: "",
      comuna: "",
      region: "",
      codigoPostal: "",
      newsletter: false,
      intereses: [],
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
                {/* Mensaje de beneficio DUOC detectado */}
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
                <div className="relative">
                  <Input
                    id="calle"
                    value={formData.calle}
                    onChange={(e) => updateField('calle', e.target.value)}
                    placeholder="Ej: Avenida Providencia"
                    className={fieldValidation.calle?.isValid === false ? "border-red-500" : fieldValidation.calle?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.calle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.calle.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldValidation.calle?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.calle.error}</p>
                )}
              </div>

              {/* Número */}
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <div className="relative">
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => updateField('numero', e.target.value)}
                    placeholder="123"
                    className={fieldValidation.numero?.isValid === false ? "border-red-500" : fieldValidation.numero?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.numero && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.numero.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
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
                  <SelectTrigger className={fieldValidation.region?.isValid === false ? "border-red-500" : fieldValidation.region?.isValid === true ? "border-green-500" : ""}>
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

              {/* Comuna */}
              <div className="space-y-2">
                <Label htmlFor="comuna">Comuna *</Label>
                <div className="relative">
                  <Input
                    id="comuna"
                    value={formData.comuna}
                    onChange={(e) => updateField('comuna', e.target.value)}
                    placeholder="Ej: Santiago"
                    className={fieldValidation.comuna?.isValid === false ? "border-red-500" : fieldValidation.comuna?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.comuna && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.comuna.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldValidation.comuna?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.comuna.error}</p>
                )}
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Select value={formData.ciudad} onValueChange={(value) => updateField('ciudad', value)}>
                  <SelectTrigger className={fieldValidation.ciudad?.isValid === false ? "border-red-500" : fieldValidation.ciudad?.isValid === true ? "border-green-500" : ""}>
                    <SelectValue placeholder="Seleccione una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.region && getCitiesForRegion(formData.region).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldValidation.ciudad?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.ciudad.error}</p>
                )}
              </div>

              {/* Código Postal */}
              <div className="space-y-2">
                <Label htmlFor="codigoPostal">Código Postal *</Label>
                <div className="relative">
                  <Input
                    id="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={(e) => updateField('codigoPostal', e.target.value)}
                    placeholder="7500000"
                    className={fieldValidation.codigoPostal?.isValid === false ? "border-red-500" : fieldValidation.codigoPostal?.isValid === true ? "border-green-500" : ""}
                  />
                  {fieldValidation.codigoPostal && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldValidation.codigoPostal.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldValidation.codigoPostal?.error && (
                  <p className="text-sm text-red-500">{fieldValidation.codigoPostal.error}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferencias</h3>

            {/* Newsletter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={formData.newsletter}
                onCheckedChange={(checked) => updateField('newsletter', checked)}
              />
              <Label htmlFor="newsletter">Suscribirse al newsletter</Label>
            </div>

            {/* Intereses */}
            <div className="space-y-2">
              <Label>Intereses (opcional)</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.intereses.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              {formData.intereses.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Intereses seleccionados: {formData.intereses.join(", ")}
                </p>
              )}
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
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateForm;
