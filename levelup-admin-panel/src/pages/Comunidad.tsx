
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  BookOpen,
  Users,
  Calendar,
  Play,
  ArrowRight,
  TrendingUp,
  Star
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBlog } from "@/context/BlogContext";

const Comunidad = () => {
  const navigate = useNavigate();
  const { blogItems } = useBlog();

  // Get stats for the community section
  const blogCount = blogItems.filter(item => item.tipo === "nota").length;
  const videoCount = blogItems.filter(item => item.tipo === "video").length;
  const eventCount = blogItems.filter(item => item.tipo === "evento").length;
  const totalItems = blogItems.length;

  const communitySections = [
    {
      id: "blog",
      title: "Blog",
      description: "Artículos, guías y tutoriales sobre gaming",
      icon: BookOpen,
      count: blogCount,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10 border-purple-500/20",
      textColor: "text-purple-400",
      path: "/blog",
      features: ["Reviews de productos", "Guías de configuración", "Tutoriales avanzados", "Análisis técnicos"],
      image: "/images/blog_noticia/pc_gaming.png"
    },
    {
      id: "noticias",
      title: "Noticias",
      description: "",
      icon: TrendingUp,
      count: videoCount + eventCount, // Videos and events as news
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      textColor: "text-blue-400",
      path: "/noticias",
      features: [],
      image: "/images/blog_noticia/esports.png"
    }
  ];

  const recentActivity = blogItems
    .filter(item => item.estado === "activo")
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/blog_noticia/banner_comunidad.png"
            alt="Banner Comunidad LevelUp"
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
              <span className="block">Comunidad</span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                LevelUp
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
              Conecta con la comunidad gaming más apasionada. Encuentra contenido exclusivo,
              participa en eventos y mantente al día con las últimas tendencias.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-300">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span className="font-medium">{totalItems} publicaciones activas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Comunidad creciente</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Contenido premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Community Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {communitySections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card
                key={section.id}
                className={`${section.bgColor} border-2 hover:border-opacity-50 transition-all duration-300 cursor-pointer group overflow-hidden relative`}
                onClick={() => navigate(section.path)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {section.image ? (
                  // Full card image
                  <div className="relative h-full min-h-[320px]">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/20" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Button
                        className={`w-full bg-gradient-to-r ${section.color} hover:opacity-90 text-white font-medium shadow-lg`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(section.path);
                        }}
                      >
                        Explorar {section.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Fallback if no image
                  <div className="relative h-full min-h-[320px] bg-secondary/20 flex items-center justify-center">
                    <IconComponent className={`w-20 h-20 ${section.textColor} opacity-50`} />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Button
                        className={`w-full bg-gradient-to-r ${section.color} hover:opacity-90 text-white font-medium shadow-lg`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(section.path);
                        }}
                      >
                        Explorar {section.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <Separator className="bg-slate-700 mb-12" />

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Actividad Reciente</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentActivity.map((item) => (
                <Card
                  key={item.id}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(item.tipo === "nota" ? `/blog/${item.id}` : "/noticias")}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${item.tipo === "video" ? "bg-purple-500/20 text-purple-400 border-purple-500/50" :
                        item.tipo === "evento" ? "bg-blue-500/20 text-blue-400 border-blue-500/50" :
                          "bg-green-500/20 text-green-400 border-green-500/50"
                        }`}>
                        {item.tipo === "video" && <Play className="w-3 h-3 mr-1" />}
                        {item.tipo === "evento" && <Calendar className="w-3 h-3 mr-1" />}
                        {item.tipo === "nota" && <MessageSquare className="w-3 h-3 mr-1" />}
                        {item.tipo}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {new Date(item.fecha).toLocaleDateString("es-ES")}
                      </span>
                    </div>

                    <CardTitle className="text-white group-hover:text-purple-400 transition-colors line-clamp-2 text-lg">
                      {item.titulo}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                      {item.descripcion}
                    </p>

                    {item.categoria && (
                      <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                        {item.categoria}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}


      </div>

      <Footer />
    </div>
  );
};

export default Comunidad;
