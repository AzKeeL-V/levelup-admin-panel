import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Blog from "./Blog";
import Noticias from "./Noticias";
import Eventos from "./Eventos";

const ComunidadHub = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-background">
        <h1 className="text-3xl font-bold mb-6">Panel Comunidad</h1>
        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="noticias">Noticias</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
          </TabsList>
          <TabsContent value="blog">
            <Blog />
          </TabsContent>
          <TabsContent value="noticias">
            <Noticias />
          </TabsContent>
          <TabsContent value="eventos">
            <Eventos />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ComunidadHub;
