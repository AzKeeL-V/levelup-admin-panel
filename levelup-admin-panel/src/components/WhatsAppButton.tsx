import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  variant?: "floating" | "inline";
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

export const WhatsAppButton = ({
  phoneNumber = "56912345678", // Número por defecto, cambiar según necesidad
  message = "Hola, necesito ayuda con LevelUp Gamer",
  className = "",
  variant = "floating",
  size = "md",
  showTooltip = false
}: WhatsAppButtonProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleClick = () => {
    if (showTooltip) {
      setIsTooltipVisible(true);
      setTimeout(() => setIsTooltipVisible(false), 3000); // Ocultar después de 3 segundos
    } else {
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (variant === "floating") {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        {isTooltipVisible && (
          <div className="absolute bottom-16 right-0 mb-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg border border-slate-700 animate-fade-in-up">
            Comunicándose con soporte...
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
          </div>
        )}

        <Button
          onClick={handleClick}
          className={`w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${className}`}
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="sr-only">Contactar por WhatsApp</span>
        </Button>
      </div>
    );
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <Button
      onClick={handleClick}
      className={`bg-green-500 hover:bg-green-600 text-white ${sizeClasses[size]} ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      WhatsApp
    </Button>
  );
};
