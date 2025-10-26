import { Button } from "@/components/ui/button";
import { Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="text-center space-y-8 px-4">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)] animate-pulse">
            <Award className="w-12 h-12 text-background" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          LevelUp
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Sistema de gestión de productos tecnológicos con puntos y recompensas
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/admin")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[var(--shadow-glow)] transition-all duration-300 text-lg px-8"
        >
          Acceder al Panel Admin
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
