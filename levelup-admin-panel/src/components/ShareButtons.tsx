import { Facebook, Twitter, MessageCircle, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ShareButtons = ({
  url,
  title,
  description = "",
  className = "",
  size = "md"
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Error al copiar el enlace");
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToFacebook}
        className="border-slate-600 text-slate-300 hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-400"
        title="Compartir en Facebook"
      >
        <Facebook className={iconSizeClasses[size]} />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareToTwitter}
        className="border-slate-600 text-slate-300 hover:bg-sky-500/10 hover:border-sky-500 hover:text-sky-400"
        title="Compartir en Twitter"
      >
        <Twitter className={iconSizeClasses[size]} />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={shareToWhatsApp}
        className="border-slate-600 text-slate-300 hover:bg-green-500/10 hover:border-green-500 hover:text-green-400"
        title="Compartir en WhatsApp"
      >
        <MessageCircle className={iconSizeClasses[size]} />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="border-slate-600 text-slate-300 hover:bg-slate-500/10 hover:border-slate-500 hover:text-slate-400"
        title="Copiar enlace"
      >
        {copied ? (
          <Check className={iconSizeClasses[size]} />
        ) : (
          <Copy className={iconSizeClasses[size]} />
        )}
      </Button>

      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={shareNative}
          className="border-slate-600 text-slate-300 hover:bg-purple-500/10 hover:border-purple-500 hover:text-purple-400"
          title="Compartir"
        >
          <Share2 className={iconSizeClasses[size]} />
        </Button>
      )}
    </div>
  );
};
