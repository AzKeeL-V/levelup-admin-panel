import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowRight, Star, Users, Trophy, Zap, Cpu, Gamepad2, Shield, Sparkles, Target, Heart, Lightbulb, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const Nosotros = () => {
  const navigate = useNavigate();

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    animation: `animate-particle-${(i % 3) + 1}`,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Hero Banner Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/inicio/banner_nosotros.png"
            alt="Banner Nosotros LevelUp"
            className="w-full h-full object-cover scale-110 animate-zoom-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/30" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-50" />
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              <span className="block">Sobre</span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                LevelUp
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
              Somos la tienda gaming definitiva, nacida de la pasión por los videojuegos y la tecnología.
              Nuestra misión es conectar a la comunidad gamer con los mejores productos y experiencias.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-medium">Fundada en 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Comunidad activa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Tecnología premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="main-content">
        {/* Nuestra Historia Section */}
        <section
          className="relative overflow-hidden z-10 pt-20 pb-16"
          aria-labelledby="historia-heading"
          role="banner"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-400/5 via-slate-600/5 to-purple-500/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-12 animate-fade-in-up">
              <div className="space-y-6">
                <div className="relative">
                  <h2
                    id="historia-heading"
                    className="text-4xl md:text-5xl font-black text-pink-400 animate-neon-flicker tracking-wider"
                  >
                    Nuestra Historia
                  </h2>
                  <div className="absolute -inset-4 bg-gradient-to-br from-purple-300/20 via-slate-600/15 to-purple-400/10 rounded-3xl blur-3xl -z-10 animate-energy-pulse" />
                </div>

                <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
                  LevelUp nació de la visión de un grupo de apasionados gamers que querían crear un espacio donde la comunidad pudiera encontrar no solo productos de calidad, sino también un lugar donde compartir experiencias y crecer juntos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="glass-premium border-0 hover:border-pink-300/50 transition-all duration-700 transform hover:scale-105 focus-within:ring-4 focus-within:ring-pink-400 animate-fade-in-left animate-delay-200 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/nosotros/mision.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-black/60"></div>
                  <CardContent className="p-8 text-center relative z-10">

                    <h3 className="text-2xl font-bold text-white mb-4">Nuestra Misión</h3>
                    <p className="text-white leading-relaxed">
                      Ser el puente entre la tecnología gaming más avanzada y la comunidad gamer chilena, ofreciendo productos premium y experiencias inolvidables.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-premium border-0 hover:border-pink-500/50 transition-all duration-700 transform hover:scale-105 focus-within:ring-4 focus-within:ring-pink-400 animate-fade-in-up animate-delay-300 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/nosotros/vision.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-black/60"></div>
                  <CardContent className="p-8 text-center relative z-10">

                    <h3 className="text-2xl font-bold text-white mb-4">Nuestra Visión</h3>
                    <p className="text-white leading-relaxed">
                      Convertirnos en la referencia nacional del gaming, creando una comunidad unida donde todos puedan acceder a la mejor tecnología y compartir su pasión.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-premium border-0 hover:border-pink-400/50 transition-all duration-700 transform hover:scale-105 focus-within:ring-4 focus-within:ring-pink-400 animate-fade-in-right animate-delay-500 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/nosotros/valores.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-black/60"></div>
                  <CardContent className="p-8 text-center relative z-10">

                    <h3 className="text-2xl font-bold text-white mb-4">Nuestros Valores</h3>
                    <p className="text-white leading-relaxed">
                      Pasión por el gaming, compromiso con la calidad, atención personalizada y un fuerte sentido de comunidad que nos une a todos.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Nuestro Equipo Section */}
        <section
          className="py-20 bg-slate-900/40 relative z-10"
          aria-labelledby="equipo-heading"
          role="region"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 id="equipo-heading" className="text-4xl md:text-5xl font-bold text-pink-400 mb-6 tracking-wide">
                Nuestro Equipo
              </h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
                Un grupo de apasionados gamers y expertos en tecnología dedicados a hacer realidad tu experiencia gaming definitiva
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
              <Card className="glass-premium border-0 hover:border-pink-300/50 transition-all duration-700 transform hover:scale-105 hover:translate-y-[-4px] focus-within:ring-4 focus-within:ring-pink-400 animate-fade-in-left animate-delay-200 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/nosotros/expertos_gaming.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">Expertos en Gaming</h3>
                  <p className="text-white leading-relaxed mb-4">
                    Nuestro equipo conoce cada detalle de los productos que ofrecemos, desde las últimas tarjetas gráficas hasta los periféricos más innovadores.
                  </p>
                  <Badge variant="secondary" className="bg-pink-400/20 text-pink-200 border-pink-400/30">
                    Especialistas Certificados
                  </Badge>
                </CardContent>
              </Card>

              <Card className="glass-premium border-0 hover:border-pink-500/50 transition-all duration-700 transform hover:scale-105 hover:translate-y-[-4px] focus-within:ring-4 focus-within:ring-pink-400 animate-fade-in-up animate-delay-300 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/nosotros/atencion_personalizada.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">Atención Personalizada</h3>
                  <p className="text-white leading-relaxed mb-4">
                    Cada cliente es único. Nuestro equipo está preparado para asesorarte personalmente y encontrar la solución perfecta para tus necesidades.
                  </p>
                  <Badge variant="secondary" className="bg-slate-400/20 text-slate-200 border-slate-400/30">
                    Soporte 24/7
                  </Badge>
                </CardContent>
              </Card>

              <Card className="glass-premium border-0 hover:border-pink-400/50 transition-all duration-700 transform hover:scale-105 hover:translate-y-[-4px] focus-within:ring-4 focus-within:ring-pink-400 animate-fade-in-right animate-delay-500 group relative overflow-hidden" style={{ backgroundImage: 'url(/images/nosotros/innovacion_constante.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">Innovación Constante</h3>
                  <p className="text-white leading-relaxed mb-4">
                    Estamos siempre a la vanguardia de las tendencias gaming, trayendo las últimas novedades y tecnologías antes que nadie.
                  </p>
                  <Badge variant="secondary" className="bg-pink-400/20 text-pink-200 border-pink-400/30">
                    Tecnología de Punta
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>



        {/* Call to Action Section */}
        <section
          className="py-20 bg-gradient-to-b from-slate-900/50 via-pink-950/20 to-slate-900/50 relative z-10"
          aria-labelledby="cta-heading"
          role="region"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in-up">
              <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold text-pink-400 mb-6 tracking-wide">
                Únete a Nuestra Comunidad
              </h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed mb-12">
                Forma parte de la familia LevelUp y descubre por qué miles de gamers ya confían en nosotros para vivir la mejor experiencia gaming
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-delay-300">
                <Button
                  size="lg"
                  onClick={() => navigate("/catalogo")}
                  className="bg-gradient-to-r from-pink-400 via-slate-600 to-pink-500 hover:from-pink-300 hover:via-slate-500 hover:to-pink-400 text-white shadow-2xl shadow-pink-400/30 hover:shadow-pink-300/50 transition-all duration-500 text-xl px-10 py-5 rounded-2xl transform hover:scale-105 border border-pink-300/30 font-semibold"
                  aria-label="Explorar nuestro catálogo de productos"
                >
                  <Gamepad2 className="mr-3 w-6 h-6" />
                  Explorar Productos
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/comunidad")}
                  className="glass-premium border-pink-300/50 text-pink-200 hover:bg-pink-400/10 hover:text-pink-100 transition-all duration-500 text-xl px-10 py-5 rounded-2xl hover:shadow-lg hover:shadow-pink-400/20 font-semibold"
                  aria-label="Conocer nuestra comunidad"
                >
                  <Users className="mr-3 w-6 h-6" />
                  Nuestra Comunidad
                  <Heart className="ml-3 w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* WhatsApp Button with Tooltip */}
      <WhatsAppButton showTooltip={true} />
    </div>
  );
};

export default Nosotros;
