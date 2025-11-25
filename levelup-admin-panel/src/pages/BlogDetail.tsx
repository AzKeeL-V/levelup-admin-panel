import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  ArrowLeft,
  Play,
  Clock,
  Tag,
  Share2,
  Heart,
  MessageSquare
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBlog } from "@/context/BlogContext";
import { BlogItem } from "@/types/BlogItem";
import { ShareButtons } from "@/components/ShareButtons";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogItems, loading } = useBlog();
  const [blogPost, setBlogPost] = useState<BlogItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogItem[]>([]);

  useEffect(() => {
    if (id && blogItems.length > 0) {
      const post = blogItems.find(item => item.id === id);
      if (post) {
        setBlogPost(post);

        // Get related posts (same category, excluding current)
        const related = blogItems
          .filter(item =>
            item.id !== id &&
            item.categoria === post.categoria &&
            item.estado === "activo"
          )
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [id, blogItems]);

  // Helper function to get correct image path
  const getImagePath = (imageUrl?: string) => {
    if (!imageUrl) return "/images/blog_noticia/logo_noticias.png";

    // If it's already a full path, return it
    if (imageUrl.startsWith('/images/')) return imageUrl;

    // Map common image names to available images
    const imageMap: { [key: string]: string } = {
      'pc_gaming': '/images/blog_noticia/pc_gaming.png',
      'esports': '/images/blog_noticia/esports.png',
      'controlador_juego': '/images/blog_noticia/controlador_juego.png',
      'tarjeta_video': '/images/blog_noticia/tarjeta_video.png',
      'microsoft': '/images/blog_noticia/microsoft.png',
      'logo_noticias': '/images/blog_noticia/logo_noticias.png'
    };

    // Check if the imageUrl contains any of the keys
    for (const [key, path] of Object.entries(imageMap)) {
      if (imageUrl.toLowerCase().includes(key)) {
        return path;
      }
    }

    // Default fallback
    return "/images/blog_noticia/logo_noticias.png";
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Reviews":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "Guías":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Noticias":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "LevelUp":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Tutoriales":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "Análisis":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "video":
        return <Play className="w-5 h-5" />;
      case "nota":
        return <MessageSquare className="w-5 h-5" />;
      case "evento":
        return <Calendar className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white">Cargando artículo...</span>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Artículo no encontrado</h1>
          <p className="text-slate-400 mb-8">El artículo que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => navigate("/blog")} className="bg-purple-500 hover:bg-purple-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/blog")}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Blog
          </Button>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className={getCategoryColor(blogPost.categoria)}>
              {blogPost.categoria || "General"}
            </Badge>
            <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">
              {getTypeIcon(blogPost.tipo)}
              <span className="ml-1 capitalize">{blogPost.tipo}</span>
            </Badge>
            {blogPost.puntos && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                <Heart className="w-3 h-3 mr-1" />
                {blogPost.puntos} puntos
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {blogPost.titulo}
          </h1>

          <p className="text-xl text-slate-300 mb-6 leading-relaxed">
            {blogPost.descripcion}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            {blogPost.autor && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blogPost.autor}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blogPost.fecha)}</span>
            </div>
            {blogPost.tiempoLectura && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blogPost.tiempoLectura} min de lectura</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image or Video */}
        <div className="mb-8">
          {blogPost.videoUrl ? (
            getYouTubeId(blogPost.videoUrl) ? (
              <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-2xl border border-slate-700">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeId(blogPost.videoUrl)}`}
                  title={blogPost.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
                <img
                  src={getImagePath(blogPost.imagen)}
                  alt={blogPost.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-purple-500 hover:bg-purple-600"
                    onClick={() => window.open(blogPost.videoUrl, '_blank')}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Ver Video
                  </Button>
                </div>
              </div>
            )
          ) : (
            <img
              src={getImagePath(blogPost.imagen)}
              alt={blogPost.titulo}
              className="w-full max-h-96 object-cover rounded-lg shadow-lg"
            />
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-8">
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {blogPost.contenidoCompleto || blogPost.descripcion}
          </div>
        </div>

        {/* Tags */}
        {blogPost.etiquetas && blogPost.etiquetas.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Etiquetas:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {blogPost.etiquetas.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="bg-slate-700 mb-8" />

        {/* Share and Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">Compartir:</span>
            <ShareButtons
              url={window.location.href}
              title={blogPost.titulo}
              description={blogPost.descripcion}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Heart className="w-4 h-4" />
            <span>Comparte si te gustó</span>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Artículos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={getImagePath(post.imagen)}
                      alt={post.titulo}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className={`absolute top-2 left-2 ${getCategoryColor(post.categoria)} text-xs`}>
                      {post.categoria || "General"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {post.titulo}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {post.descripcion}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;
