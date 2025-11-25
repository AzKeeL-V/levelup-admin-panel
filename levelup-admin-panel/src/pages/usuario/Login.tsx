import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/context/UserContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUsers();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Login: Starting login process for email:", email);

      await login(email, password);

      console.log("Login: Login successful");

      // Obtener el usuario actual desde localStorage para redirección inmediata
      // (ya que el estado del contexto puede tardar un ciclo en actualizarse)
      const userStr = localStorage.getItem("current_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        // Redirect based on role
        if (user.rol === "admin") {
          console.log("Login: Redirecting to admin dashboard");
          navigate("/admin/dashboard");
        } else {
          console.log("Login: Redirecting to home page");
          navigate("/");
        }
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Login: Error:", err);
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex flex-col">
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
        <div className="hidden lg:block w-1/4">
          <img
            src="/images/inicio/banner_login_lateral.png"
            alt="Banner Lateral Izquierdo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img
                  src="/images/logo/logo-home.jpg"
                  alt="LevelUp Logo"
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white">LevelUp Gamer</CardTitle>
              <p className="text-slate-400">Inicia sesión en tu cuenta</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
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
                  <div className="text-right mt-1">
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-xs text-purple-400 hover:text-purple-300"
                      onClick={() => navigate("/usuario/forgot-password")}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Iniciando sesión...
                    </div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  ¿No tienes cuenta?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-purple-400 hover:text-purple-300"
                    onClick={() => navigate("/usuario/register")}
                  >
                    Regístrate aquí
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Banner */}
        <div className="hidden lg:block w-1/4">
          <img
            src="/images/inicio/banner_login_lateral.png"
            alt="Banner Lateral Derecho"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
