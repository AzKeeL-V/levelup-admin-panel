import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, User, Search, ExternalLink, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useBlog } from "@/context/BlogContext";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
  isBreaking?: boolean;
  externalLink?: string;
}

const Noticias = () => {
  const { blogItems, loading } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Filter news items (everything except events)
  const newsItems: NewsItem[] = blogItems
    .filter(item => item.tipo !== "evento")
    .map(item => ({
      id: item.id,
      title: item.titulo,
      summary: item.descripcion,
      content: item.contenidoCompleto || item.descripcion,
      author: item.autor || "Equipo LevelUp",
      date: item.fecha,
      category: item.categoria || "General",
      image: item.imagen || "/images/blog_noticia/logo_noticias.png",
      readTime: item.tiempoLectura || 5,
      isBreaking: item.etiquetas?.includes("breaking") || false,
      externalLink: item.videoUrl
    }));

  const categories = ["todos", ...Array.from(new Set(newsItems.map(item => item.category)))];

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Consolas":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Hardware":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Juegos":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "Periféricos":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "VR":
        return "bg-pink-500/20 text-pink-400 border-pink-500/50";
      case "Portátiles":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
      case "Eventos":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const breakingNews = newsItems.filter(item => item.isBreaking);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      {/* Hero Section - Full Width */}
      <div className="relative w-full overflow-hidden mb-8">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/blog_noticia/banner_noticia.png"
            alt="Banner Noticias LevelUp"
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
              <span className="block">Centro de</span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Noticias
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
              Mantente al día con las últimas novedades del mundo gaming, reseñas de hardware y tecnología.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breaking News Banner */}
        {breakingNews.length > 0 && (
          <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-semibold">NOTICIA DE ÚLTIMA HORA</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{breakingNews[0].title}</h3>
              <p className="text-slate-300 mb-4">{breakingNews[0].summary}</p>
              <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                Leer Noticia Completa
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-purple-500 hover:bg-purple-600" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
                >
                  {category === "todos" ? "Todas" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredNews.map((item) => (
            <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 overflow-hidden group flex flex-col h-full">
              <div className="relative overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className={`absolute top-2 left-2 ${getCategoryColor(item.category)}`}>
                  {item.category}
                </Badge>
                {item.isBreaking && (
                  <Badge className="absolute top-2 right-2 bg-red-500/20 text-red-400 border-red-500/50">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Breaking
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-2 shrink-0">
                <CardTitle className="text-white group-hover:text-purple-400 transition-colors line-clamp-2 h-14">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 flex flex-col flex-grow">
                <p className="text-slate-400 text-sm mb-4 line-clamp-3 h-[60px]">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4 mt-auto">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.date).toLocaleDateString("es-ES")}</span>
                  </div>
                  <span>{item.readTime} min</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white group-hover:border-purple-500 group-hover:text-purple-400 mt-auto"
                >
                  Leer Noticia
                  {item.externalLink ? <ExternalLink className="w-3 h-3 ml-1" /> : <span className="ml-1">→</span>}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More / Pagination would go here */}
        <div className="text-center">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
            Cargar Más Noticias
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Noticias;
