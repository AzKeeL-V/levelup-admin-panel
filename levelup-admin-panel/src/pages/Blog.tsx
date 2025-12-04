import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, User, Search, ArrowRight, Play, Trophy, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBlog } from "@/context/BlogContext";
import { BlogItem } from "@/types/BlogItem";

const Blog = () => {
  const navigate = useNavigate();
  const { blogItems, loading } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Use only real blog data from context (admin-created content)
  // Filter only events as requested by user
  const blogPosts = blogItems
    .filter(item => item.tipo === "evento")
    .map(item => ({
      id: item.id,
      title: item.titulo,
      excerpt: item.descripcion,
      content: item.contenidoCompleto || item.descripcion,
      author: item.autor || "LevelUp Team",
      date: item.fecha,
      category: item.categoria || "General",
      image: item.imagen || "/images/blog_noticia/logo_noticias.png",
      readTime: item.tiempoLectura || 5,
      tipo: item.tipo,
      videoUrl: item.videoUrl,
      etiquetas: item.etiquetas,
      estado: item.estado,
      puntos: item.puntos,
      direccion: item.direccion || "", // Agregar dirección para eventos
      ubicacionUrl: item.ubicacionUrl || "",
    }));

  const categories = ["todos", ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Reviews":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "Guías":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Noticias":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "LevelUp":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Hero Banner Section - Full Width Dramatic */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/blog_noticia/banner_noticia.png"
            alt="Banner Blog LevelUp"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/30" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50" />
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[70vh] md:min-h-[80vh] flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 drop-shadow-2xl tracking-tight leading-none">
                <span className="block">Blog</span>
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  LevelUp
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-slate-200 max-w-3xl mx-auto drop-shadow-xl leading-relaxed font-medium mb-12">
                Mantente informado con las últimas noticias, reviews y guías del mundo gaming
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center space-x-4 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Contenido Actualizado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Reviews Expertas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Guías Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-slate-900">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Search and Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-purple-500 hover:bg-purple-600" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
                >
                  {category === "todos" ? "Todos" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden group flex flex-col h-full">
              {/* Image Section */}
              <div className="relative overflow-hidden h-56">
                {post.tipo === "video" && post.videoUrl ? (
                  <div className="relative h-full">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white opacity-80" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                {/* Category Badge */}
                <Badge className={`absolute top-3 left-3 ${getCategoryColor(post.category)} font-semibold`}>
                  {post.category}
                </Badge>

                {/* Type Badge */}
                {post.tipo === "video" && (
                  <Badge className="absolute top-3 right-3 bg-purple-500/30 text-purple-200 border-purple-400/50 backdrop-blur-sm">
                    <Play className="w-3 h-3 mr-1" />
                    Video
                  </Badge>
                )}
                {post.tipo === "evento" && (
                  <Badge className="absolute top-3 right-3 bg-primary/30 text-primary-foreground border-primary/50 backdrop-blur-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    Evento
                  </Badge>
                )}
              </div>

              {/* Content Section */}
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 flex-grow space-y-4">
                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(post.date).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>{post.readTime} min lectura</span>
                  </div>
                </div>

                {/* Points Badge for Events */}
                {post.tipo === 'evento' && post.puntos && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-lg">
                    <Trophy className="w-5 h-5" />
                    <span>¡Gana {post.puntos} puntos!</span>
                  </div>
                )}
              </CardContent>

              {/* Action Buttons */}
              <CardFooter className="flex flex-col gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-200 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  Leer Más
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {post.tipo === "evento" && post.direccion && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={() => {
                      const url = post.ubicacionUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.direccion)}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver Ubicación
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
