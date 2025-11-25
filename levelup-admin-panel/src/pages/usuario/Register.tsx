import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Gamepad2, Eye, EyeOff, AlertCircle, CheckCircle, FileText, Shield, Plus, X, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CHILEAN_REGIONS, getCitiesForRegion } from "@/utils/chileData";
import { useUsers } from "@/context/UserContext";
import {
  validateEmail,
  validateMinimumAge,
  validateChileanPhone,
  validateRut,
  validateCardNumber,
  validateExpiryDate,
  validateCardHolder,
  validateBirthDate,
  formatCardNumber,
  formatExpiryDate,
  formatChileanPhone
} from "@/utils/validationUtils";

const Register = () => {
  const { users, addUser } = useUsers();
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    fechaNacimiento: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
    telefono: "+569",
    direcciones: [{ calle: "", numero: "", edificio: "", region: "", ciudad: "" }],
    tarjeta: {
      tipo: "",
      numero: "",
      expiracion: "",
      cvv: ""
    },
    codigoReferido: "", // Campo opcional para código de referido
    aceptaTerminos: false,
    aceptaPoliticaPrivacidad: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<"normal" | "duoc">("normal");

  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();

  // Detectar tipo de usuario basado en el dominio del email
  useEffect(() => {
    if (formData.correo.includes("@duocuc.cl")) {
      setTipoUsuario("duoc");
    } else {
      setTipoUsuario("normal");
    }
  }, [formData.correo]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFechaNacimientoChange = (value: string) => {
    // Permitir formato dd-mm-yyyy (10 caracteres)
    const digitsOnly = value.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digitsOnly.length >= 1) formatted += digitsOnly.slice(0, 2);
    if (digitsOnly.length >= 3) formatted += "-" + digitsOnly.slice(2, 4);
    if (digitsOnly.length >= 5) formatted += "-" + digitsOnly.slice(4, 8);
    setFormData(prev => ({ ...prev, fechaNacimiento: formatted }));
    // Clear field error when user starts typing
    if (fieldErrors.fechaNacimiento) {
      setFieldErrors(prev => ({ ...prev, fechaNacimiento: "" }));
    }
  };



  const handleFieldBlur = (field: string) => {
    // Validate specific fields on blur
    if (field === "nombre") {
      if (!formData.nombre.trim()) {
        setFieldErrors(prev => ({ ...prev, nombre: "El nombre es requerido" }));
      } else {
        const nombreWords = formData.nombre.trim().split(/\s+/);
        if (nombreWords.length < 2) {
          setFieldErrors(prev => ({ ...prev, nombre: "El nombre completo debe tener al menos nombre y apellido" }));
        } else {
          setFieldErrors(prev => ({ ...prev, nombre: "" }));
        }
      }
    } else if (field === "rut") {
      if (!formData.rut.trim()) {
        setFieldErrors(prev => ({ ...prev, rut: "El RUT es requerido" }));
      } else if (!validateRut(formData.rut)) {
        setFieldErrors(prev => ({ ...prev, rut: "El RUT no es válido" }));
      } else {
        setFieldErrors(prev => ({ ...prev, rut: "" }));
      }
    } else if (field === "fechaNacimiento") {
      const validation = validateBirthDate(formData.fechaNacimiento);
      if (!validation.isValid) {
        setFieldErrors(prev => ({ ...prev, fechaNacimiento: validation.error || "Fecha de nacimiento inválida" }));
      } else {
        setFieldErrors(prev => ({ ...prev, fechaNacimiento: "" }));
      }
    } else if (field === "correo") {
      if (!formData.correo.trim()) {
        setFieldErrors(prev => ({ ...prev, correo: "El correo es requerido" }));
      } else if (!validateEmail(formData.correo)) {
        setFieldErrors(prev => ({ ...prev, correo: "El correo electrónico no es válido" }));
      } else {
        setFieldErrors(prev => ({ ...prev, correo: "" }));
      }
    } else if (field === "telefono") {
      if (!formData.telefono.trim()) {
        setFieldErrors(prev => ({ ...prev, telefono: "El teléfono es requerido" }));
      } else if (!validateChileanPhone(formData.telefono)) {
        setFieldErrors(prev => ({ ...prev, telefono: "El teléfono chileno no es válido" }));
      } else {
        setFieldErrors(prev => ({ ...prev, telefono: "" }));
      }
    } else if (field === "contraseña") {
      if (!formData.contraseña) {
        setFieldErrors(prev => ({ ...prev, contraseña: "La contraseña es requerida" }));
      } else if (formData.contraseña.length < 6) {
        setFieldErrors(prev => ({ ...prev, contraseña: "La contraseña debe tener al menos 6 caracteres" }));
      } else {
        setFieldErrors(prev => ({ ...prev, contraseña: "" }));
      }
    } else if (field === "confirmarContraseña") {
      if (!formData.confirmarContraseña) {
        setFieldErrors(prev => ({ ...prev, confirmarContraseña: "Debes confirmar tu contraseña" }));
      } else if (formData.contraseña !== formData.confirmarContraseña) {
        setFieldErrors(prev => ({ ...prev, confirmarContraseña: "Las contraseñas no coinciden" }));
      } else {
        setFieldErrors(prev => ({ ...prev, confirmarContraseña: "" }));
      }
    }
  };

  const handleTelefonoChange = (value: string) => {
    // Asegurar que siempre empiece con +569 y permita solo 8 dígitos después
    if (value.startsWith("+569")) {
      const digits = value.slice(4).replace(/\D/g, "").slice(0, 8);
      setFormData(prev => ({ ...prev, telefono: "+569" + digits }));
    } else {
      setFormData(prev => ({ ...prev, telefono: "+569" }));
    }
  };

  const handleRutChange = (value: string) => {
    // Limpiar el valor de puntos, guiones y espacios
    const cleanValue = value.replace(/[.\-\s]/g, "");

    // Solo permitir dígitos y K/k, máximo 9 caracteres
    const digitsOnly = cleanValue.replace(/[^0-9kK]/g, "").slice(0, 9);

    // Si tiene menos de 8 dígitos, mostrar sin formato para mejor UX
    if (digitsOnly.length < 8) {
      setFormData(prev => ({ ...prev, rut: digitsOnly }));
    } else {
      // Formatear cuando tenga al menos 8 dígitos
      const rutNumber = digitsOnly.slice(0, -1);
      const dv = digitsOnly.slice(-1);
      const formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const formattedRut = formattedNumber + '-' + dv;
      setFormData(prev => ({ ...prev, rut: formattedRut }));
    }
  };



  const handleDireccionChange = (index: number, field: string, value: string) => {
    const newDirecciones = [...formData.direcciones];
    newDirecciones[index] = { ...newDirecciones[index], [field]: value };
    setFormData(prev => ({ ...prev, direcciones: newDirecciones }));
  };

  const addDireccion = () => {
    setFormData(prev => ({ ...prev, direcciones: [...prev.direcciones, { calle: "", numero: "", edificio: "", region: "", ciudad: "" }]}));
  };

  const removeDireccion = (index: number) => {
    if (formData.direcciones.length > 1) {
      const newDirecciones = formData.direcciones.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, direcciones: newDirecciones }));
    }
  };

  const handleRegionChange = (index: number, value: string) => {
    console.log(`Region changed for address ${index + 1}:`, value);

    setFormData(prev => {
      const newDirecciones = [...prev.direcciones];
      // Update region and reset city
      newDirecciones[index] = {
        ...newDirecciones[index],
        region: value,
        ciudad: "" // Reset city when region changes
      };
      return { ...prev, direcciones: newDirecciones };
    });
  };

  const handleCityChange = (index: number, value: string) => {
    console.log(`City changed for address ${index + 1}:`, value);
    handleDireccionChange(index, "ciudad", value);
  };

  const handleTarjetaChange = (field: string, value: string) => {
    let formattedValue = value;
    if (field === "numero") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiracion") {
      formattedValue = formatExpiryDate(value);
    }
    setFormData(prev => ({
      ...prev,
      tarjeta: { ...prev.tarjeta, [field]: formattedValue }
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) return "El nombre es requerido";
    const nombreWords = formData.nombre.trim().split(/\s+/);
    if (nombreWords.length < 2) return "El nombre completo debe tener al menos nombre y apellido";
    if (!formData.rut.trim()) return "El RUT es requerido";
    if (!validateRut(formData.rut)) return "El RUT no es válido";
    if (!formData.fechaNacimiento) return "La fecha de nacimiento es requerida";

    // Validación de edad mínima usando la función importada
    if (!validateMinimumAge(formData.fechaNacimiento)) return "Debes tener al menos 18 años para registrarte";

    if (!formData.correo.trim()) return "El correo es requerido";
    if (!validateEmail(formData.correo)) return "El correo electrónico no es válido";

    if (!formData.contraseña) return "La contraseña es requerida";
    if (formData.contraseña.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (formData.contraseña !== formData.confirmarContraseña) return "Las contraseñas no coinciden";

    if (!formData.telefono.trim()) return "El teléfono es requerido";
    if (!validateChileanPhone(formData.telefono)) return "El teléfono chileno no es válido";

    // Validación de direcciones
    for (let i = 0; i < formData.direcciones.length; i++) {
      const dir = formData.direcciones[i];
      if (dir.calle.trim() || dir.numero.trim() || dir.edificio.trim() || dir.region.trim() || dir.ciudad.trim()) {
        // Si se llenó algún campo de la dirección, validar que todos los requeridos estén
        if (!dir.calle.trim()) return `La calle es requerida en la dirección ${i + 1}`;
        if (!dir.numero.trim()) return `El número es requerido en la dirección ${i + 1}`;
        if (!dir.region.trim()) return `La región es requerida en la dirección ${i + 1}`;
        if (!dir.ciudad.trim()) return `La ciudad es requerida en la dirección ${i + 1}`;
      }
    }

    // Validación de tarjeta de crédito si se proporciona
    if (formData.tarjeta.numero || formData.tarjeta.expiracion || formData.tarjeta.cvv) {
      if (!validateCardNumber(formData.tarjeta.numero)) return "El número de tarjeta no es válido";
      if (!validateExpiryDate(formData.tarjeta.expiracion)) return "La fecha de expiración no es válida";
      if (!validateCardHolder(formData.nombre.trim())) return "El nombre del titular no es válido";
    }

    if (!formData.aceptaTerminos) return "Debes aceptar los términos y condiciones";
    if (!formData.aceptaPoliticaPrivacidad) return "Debes aceptar la política de privacidad";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const existingUser = users.find((u: any) => u.correo === formData.correo);
      if (existingUser) {
        setError("Ya existe una cuenta con este correo electrónico");
        return;
      }

      // Verificar código de referido si se proporcionó
      let puntosIniciales = 0;
      if (formData.codigoReferido.trim()) {
        const referrer = users.find((u: any) => u.codigoReferido === formData.codigoReferido.trim());
        if (referrer) {
          // Los puntos por referido serán configurados por el administrador
          // Por ahora, asignamos puntos iniciales al nuevo usuario
          puntosIniciales = 50; // Puntos por registro con referido (configurable por admin)
        } else {
          setError("El código de referido no es válido");
          return;
        }
      }

      // Create new user
      const newUser = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        contraseña: formData.contraseña,
        rut: formData.rut.trim(),
        tipo: tipoUsuario,
        puntos: puntosIniciales, // Puntos iniciales si usó código de referido
        nivel: "bronce" as "bronce" | "plata" | "oro" | "diamante",
        rol: (formData.correo === "admin@levelup.cl" ? "admin" : "user") as "admin" | "user", // Rol de administrador para el email específico
        telefono: formData.telefono,
        direcciones: formData.direcciones.filter(d => d.calle.trim() || d.numero.trim() || d.edificio.trim()).map(d => ({
          calle: d.calle,
          numero: d.numero,
          edificio: d.edificio || undefined,
          ciudad: d.ciudad,
          region: d.region,
          codigoPostal: undefined,
          pais: "Chile"
        })),
        metodosPago: formData.tarjeta.numero ? [{
          id: Date.now().toString(),
          tipo: "tarjeta" as const,
          esPredeterminado: true,
          tarjeta: {
            numero: formData.tarjeta.numero,
            fechaExpiracion: formData.tarjeta.expiracion,
            titular: formData.nombre.trim()
          }
        }] : [],
        metodoPagoPreferido: formData.tarjeta.numero ? ("tarjeta" as const) : undefined,
        intereses: [], // Sin intereses
        aceptaTerminos: formData.aceptaTerminos,
        aceptaPoliticaPrivacidad: formData.aceptaPoliticaPrivacidad,
        captchaVerificado: true,
        activo: true,
        codigoReferido: `REF${Date.now().toString().slice(-6)}`,
        referidoPor: formData.codigoReferido.trim() || null, // Guardar quién lo refirió
        preferenciasComunicacion: {
          email: true,
          sms: false
        },
        newsletter: true
      };

      // Add user using context
      await addUser(newUser);

      setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/usuario/login");
      }, 2000);

    } catch (err) {
      console.error("Register.tsx: Error creating account:", err);
      const errorMessage = err instanceof Error ? err.message : "Error al crear la cuenta";
      console.error("Register.tsx: Error message:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Generate floating particles (stars/noise)
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    animation: `animate-particle-${(i % 3) + 1}`,
    delay: Math.random() * 5,
  }));

  // Generate transparent cubes
  const cubes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    animation: `animate-float-${(i % 2) + 1}`,
    delay: Math.random() * 3,
  }));

  const termsContent = `
    TÉRMINOS Y CONDICIONES DE USO - LEVELUP

    1. ACEPTACIÓN DE LOS TÉRMINOS
    Al acceder y utilizar LevelUp, aceptas estar sujeto a estos términos y condiciones de uso.

    2. DESCRIPCIÓN DEL SERVICIO
    LevelUp es una plataforma gaming que permite a los usuarios participar en torneos, competiciones y actividades relacionadas con videojuegos.

    3. REQUISITOS DE USUARIO
    - Debes tener al menos 13 años de edad
    - Proporcionar información veraz y actualizada
    - Mantener la confidencialidad de tu contraseña

    4. CONDUCTA DEL USUARIO
    - No violar derechos de terceros
    - No publicar contenido ofensivo o ilegal
    - Respetar a otros usuarios de la plataforma

    5. PROPIEDAD INTELECTUAL
    Todo el contenido de LevelUp está protegido por derechos de autor y otras leyes de propiedad intelectual.

    6. LIMITACIÓN DE RESPONSABILIDAD
    LevelUp no se hace responsable por daños indirectos, incidentales o consecuentes.

    7. MODIFICACIONES
    Nos reservamos el derecho de modificar estos términos en cualquier momento.

    8. LEY APLICABLE
    Estos términos se rigen por las leyes de Chile.
  `;

  const privacyContent = `
    POLÍTICA DE PRIVACIDAD - LEVELUP

    1. INFORMACIÓN QUE RECOPILAMOS
    - Información personal proporcionada voluntariamente
    - Datos de uso de la plataforma
    - Información técnica del dispositivo

    2. USO DE LA INFORMACIÓN
    - Proporcionar y mejorar nuestros servicios
    - Comunicarnos contigo
    - Cumplir con obligaciones legales

    3. COMPARTICIÓN DE INFORMACIÓN
    Solo compartimos tu información cuando:
    - Das tu consentimiento expreso
    - Es requerido por ley
    - Es necesario para proteger nuestros derechos

    4. SEGURIDAD DE LOS DATOS
    Implementamos medidas de seguridad técnicas y organizativas para proteger tu información.

    5. TUS DERECHOS
    Tienes derecho a acceder, rectificar, eliminar y oponerte al tratamiento de tus datos personales.

    6. COOKIES Y TECNOLOGÍAS SIMILARES
    Utilizamos cookies para mejorar tu experiencia en la plataforma.

    7. CAMBIOS A ESTA POLÍTICA
    Podemos actualizar esta política notificándote por email o mediante un aviso en la plataforma.

    8. CONTACTO
    Para preguntas sobre privacidad, contáctanos en privacidad@levelup.cl
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex flex-col">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 z-0">
        {/* Dark background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        {/* Animated particles (stars/noise) */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s',
            }}
          />
        ))}

        {/* Transparent cubes with neon borders */}
        {cubes.map((cube) => (
          <div
            key={cube.id}
            className="absolute border border-cyan-400/30 bg-transparent backdrop-blur-sm"
            style={{
              left: `${cube.x}%`,
              top: `${cube.y}%`,
              width: `${cube.size}px`,
              height: `${cube.size}px`,
              transform: `rotate(${cube.rotation}deg)`,
              animationDelay: `${cube.delay}s`,
              animationDuration: '6s',
              animationName: 'float',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            }}
          >
            {/* Inner cube with magenta border */}
            <div className="absolute inset-2 border border-pink-400/20 bg-transparent" />
          </div>
        ))}

        {/* Neon connection lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#00ffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ff00ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path d="M10,20 L30,40 L50,20 L70,60 L90,30" stroke="url(#cyanGradient)" strokeWidth="0.2" fill="none" className="animate-pulse" />
          <path d="M20,80 L40,60 L60,80 L80,40 L95,70" stroke="url(#pinkGradient)" strokeWidth="0.2" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
          <path d="M5,50 L25,30 L45,50 L65,30 L85,50" stroke="url(#cyanGradient)" strokeWidth="0.15" fill="none" className="animate-pulse" style={{ animationDelay: '2s' }} />
        </svg>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-40" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-cyan-400 rounded-full animate-ping opacity-30" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-25" />
      </div>

      <Header />

      {/* Main Content with Side Banners */}
      <div className="flex flex-1 relative z-10">
        {/* Left Banner */}
        <div className="hidden lg:block w-1/6">
          <img
            src="/images/inicio/banner_login_lateral.png"
            alt="Banner Lateral Izquierdo"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Register Form */}
        <div className="flex-1 flex items-center justify-center p-4 py-8">
          <Card className="w-full max-w-2xl bg-slate-800/50 border-2 border-pink-500/50 shadow-lg shadow-pink-500/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Únete a LevelUp</CardTitle>
              <p className="text-slate-400">Crea tu cuenta de gamer</p>
              {tipoUsuario === "duoc" && (
                <div className="mt-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full inline-block">
                  <p className="text-xs text-cyan-400 font-medium">Cuenta Estudiante DUOC UC</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-slate-300">Nombre completo</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    onBlur={() => handleFieldBlur("nombre")}
                    placeholder="Tu nombre completo"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  {fieldErrors.nombre && (
                    <p className="text-xs text-red-400">{fieldErrors.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rut" className="text-slate-300">RUT</Label>
                  <Input
                    id="rut"
                    type="text"
                    value={formData.rut}
                    onChange={(e) => handleRutChange(e.target.value)}
                    onBlur={() => handleFieldBlur("rut")}
                    placeholder="12.345.678-9"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  <p className="text-xs text-slate-400">
                    Los puntos y guion se agregan automáticamente. Ej: 12345678-9
                  </p>
                  {fieldErrors.rut && (
                    <p className="text-xs text-red-400">{fieldErrors.rut}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento" className="text-slate-300">Fecha de nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    type="text"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleFechaNacimientoChange(e.target.value)}
                    onBlur={() => handleFieldBlur("fechaNacimiento")}
                    placeholder="dd-mm-yyyy"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  <p className="text-xs text-slate-400">
                    Formato: dd-mm-yyyy (ej: 15-08-1990)
                  </p>
                  {fieldErrors.fechaNacimiento && (
                    <p className="text-xs text-red-400">{fieldErrors.fechaNacimiento}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correo" className="text-slate-300">Correo electrónico</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleInputChange("correo", e.target.value)}
                    placeholder="tu@email.com"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                  {tipoUsuario === "duoc" && (
                    <div className="mt-1 px-2 py-1 bg-green-500/20 border border-green-500/50 rounded-md">
                      <p className="text-xs text-green-400">✓ Beneficio DUOC detectado: +50 puntos extra al registrarte</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-slate-300">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleTelefonoChange(e.target.value)}
                    placeholder="+569XXXXXXXX"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    maxLength={12}
                    required
                  />
                  <p className="text-xs text-slate-400">
                    El teléfono debe tener exactamente 8 dígitos después de +569
                  </p>
                </div>

                {/* Direcciones */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Direcciones de envío</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDireccion}
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar dirección
                    </Button>
                  </div>
                  {formData.direcciones.map((direccion, index) => (
                    <div key={index} className="space-y-2 p-4 border border-slate-600/50 rounded-lg bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-300">Dirección {index + 1}</h4>
                        {formData.direcciones.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeDireccion(index)}
                            className="bg-red-600 border-red-600 text-white hover:bg-red-700 px-3"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`calle-${index}`} className="text-xs text-slate-400">Calle</Label>
                          <Input
                            id={`calle-${index}`}
                            type="text"
                            value={direccion.calle}
                            onChange={(e) => handleDireccionChange(index, "calle", e.target.value)}
                            placeholder="Nombre de la calle"
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`numero-${index}`} className="text-xs text-slate-400">Número</Label>
                          <Input
                            id={`numero-${index}`}
                            type="text"
                            value={direccion.numero}
                            onChange={(e) => handleDireccionChange(index, "numero", e.target.value)}
                            placeholder="Número"
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edificio-${index}`} className="text-xs text-slate-400">Edificio (opcional)</Label>
                          <Input
                            id={`edificio-${index}`}
                            type="text"
                            value={direccion.edificio}
                            onChange={(e) => handleDireccionChange(index, "edificio", e.target.value)}
                            placeholder="Edificio, piso, etc."
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor={`region-${index}`} className="text-xs text-slate-400">Región</Label>
                          <Select
                            key={`region-select-${index}`}
                            value={direccion.region}
                            onValueChange={(value) => handleRegionChange(index, value)}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Selecciona una región">
                                {direccion.region || "Selecciona una región"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {CHILEAN_REGIONS.map((region) => (
                                <SelectItem key={region} value={region} className="text-white hover:bg-slate-600">
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`ciudad-${index}`} className="text-xs text-slate-400">Ciudad</Label>
                          <Select
                            value={direccion.ciudad}
                            onValueChange={(value) => handleCityChange(index, value)}
                            disabled={!direccion.region}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Selecciona una ciudad" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {direccion.region ? getCitiesForRegion(direccion.region).map((city) => (
                                <SelectItem key={city} value={city} className="text-white hover:bg-slate-600">
                                  {city}
                                </SelectItem>
                              )) : null}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tarjeta de crédito */}
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Tarjeta de crédito (opcional)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="tipoTarjeta" className="text-xs text-slate-400">Tipo</Label>
                      <Select
                        value={formData.tarjeta.tipo}
                        onValueChange={(value) => handleTarjetaChange("tipo", value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="visa" className="text-white hover:bg-slate-600">Visa</SelectItem>
                          <SelectItem value="mastercard" className="text-white hover:bg-slate-600">Mastercard</SelectItem>
                          <SelectItem value="amex" className="text-white hover:bg-slate-600">American Express</SelectItem>
                          <SelectItem value="diners" className="text-white hover:bg-slate-600">Diners Club</SelectItem>
                          <SelectItem value="discover" className="text-white hover:bg-slate-600">Discover</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="numeroTarjeta" className="text-xs text-slate-400">Número</Label>
                      <Input
                        id="numeroTarjeta"
                        type="text"
                        value={formData.tarjeta.numero}
                        onChange={(e) => handleTarjetaChange("numero", e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="Número de tarjeta"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiracionTarjeta" className="text-xs text-slate-400">Expiración</Label>
                      <Input
                        id="expiracionTarjeta"
                        type="text"
                        value={formData.tarjeta.expiracion}
                        onChange={(e) => handleTarjetaChange("expiracion", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="MM/YY"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvvTarjeta" className="text-xs text-slate-400">CVV</Label>
                      <Input
                        id="cvvTarjeta"
                        type="text"
                        value={formData.tarjeta.cvv}
                        onChange={(e) => handleTarjetaChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="CVV"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoReferido" className="text-slate-300">Código de referido (opcional)</Label>
                  <Input
                    id="codigoReferido"
                    type="text"
                    value={formData.codigoReferido}
                    onChange={(e) => handleInputChange("codigoReferido", e.target.value)}
                    placeholder="Ingresa código de referido si tienes uno"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  <p className="text-xs text-slate-400">
                    Si tienes un código de referido, ingrésalo aquí para obtener puntos extra al registrarte
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.contraseña}
                      onChange={(e) => handleInputChange("contraseña", e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmarContraseña}
                      onChange={(e) => handleInputChange("confirmarContraseña", e.target.value)}
                      placeholder="Repite tu contraseña"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Terms and Privacy Section */}
                <div className="space-y-6">
                  <div className="border border-pink-500/30 rounded-lg p-6 bg-slate-800/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-pink-400" />
                      Términos y Condiciones
                    </h3>
                    <div className="max-h-40 overflow-y-auto text-sm text-slate-300 mb-4 whitespace-pre-line border border-slate-600/50 rounded p-3 bg-slate-900/50">
                      {termsContent}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terminos"
                        checked={formData.aceptaTerminos}
                        onCheckedChange={(checked) => handleInputChange("aceptaTerminos", checked)}
                        className="border-slate-600 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                      />
                      <Label htmlFor="terminos" className="text-sm text-slate-300 cursor-pointer">
                        Acepto los términos y condiciones
                      </Label>
                    </div>
                  </div>

                  <div className="border border-pink-500/30 rounded-lg p-6 bg-slate-800/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-pink-400" />
                      Política de Privacidad
                    </h3>
                    <div className="max-h-40 overflow-y-auto text-sm text-slate-300 mb-4 whitespace-pre-line border border-slate-600/50 rounded p-3 bg-slate-900/50">
                      {privacyContent}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacidad"
                        checked={formData.aceptaPoliticaPrivacidad}
                        onCheckedChange={(checked) => handleInputChange("aceptaPoliticaPrivacidad", checked)}
                        className="border-slate-600 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                      />
                      <Label htmlFor="privacidad" className="text-sm text-slate-300 cursor-pointer">
                        Acepto la política de privacidad
                      </Label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creando cuenta...
                    </div>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-400">
                  ¿Ya tienes cuenta?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-purple-400 hover:text-purple-300"
                    onClick={() => navigate("/usuario/login")}
                  >
                    Inicia sesión
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Banner */}
        <div className="hidden lg:block w-1/6">
          <img
            src="/images/inicio/banner_login_lateral.png"
            alt="Banner Lateral Derecho"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
};

export default Register;
