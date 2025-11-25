import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/images/logo/logo-home.jpg"
                alt="LevelUp Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-white">LevelUp</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tu tienda gamer definitiva. Productos tecnológicos de calidad con sistema de puntos y recompensas.
              ¡Únete a la comunidad LevelUp y lleva tu experiencia gaming al siguiente nivel!
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/noticias"
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Noticias
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Contacto
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Envíos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Devoluciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 LevelUp. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Términos de Servicio
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
