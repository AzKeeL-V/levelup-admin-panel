import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, LogOut, ShoppingCart, Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { useUsers } from "@/context/UserContext";
import { useWishlist } from "@/context/WishlistContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser: user, logout } = useUsers();
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCart();
  const { wishlist } = useWishlist();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const itemCount = getItemCount();

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/images/logo/logo-home.jpg"
              alt="LevelUp Logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-pink-500">LevelUp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-8">
            <Link
              to="/"
              className={`${isActive("/") && location.pathname === "/"
                ? "text-pink-500 font-medium"
                : "text-slate-300 hover:text-white"
                } transition-colors duration-200`}
            >
              Inicio
            </Link>
            <Link
              to="/catalogo"
              className={`${isActive("/catalogo")
                ? "text-pink-500 font-medium"
                : "text-slate-300 hover:text-white"
                } transition-colors duration-200`}
            >
              Catálogo
            </Link>
            <Link
              to="/comunidad"
              className={`${isActive("/comunidad") || isActive("/blog") || isActive("/noticias")
                ? "text-pink-500 font-medium"
                : "text-slate-300 hover:text-white"
                } transition-colors duration-200`}
            >
              Comunidad
            </Link>
            <Link
              to="/nosotros"
              className={`${isActive("/nosotros")
                ? "text-pink-500 font-medium"
                : "text-slate-300 hover:text-white"
                } transition-colors duration-200`}
            >
              Nosotros
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:ring-purple-500 focus:border-purple-500"
              />
            </form>
          </div>

          {/* Cart and User Menu / Login */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist Icon */}
            <Link to="/usuario/wishlist" className="relative">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-pink-500 hover:bg-pink-600"
                  >
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart Icon - Show for all users */}
            <Link to="/carrito" className="relative">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-slate-300 hover:text-white cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      {user.nombre}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 z-[100]">
                    {user.rol === "admin" ? (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        Panel Administrativo
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => navigate("/usuario/perfil")}
                        className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                      >
                        Mi Perfil
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            ) : (
              <Button
                onClick={() => navigate("/usuario/login")}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-800 py-4">
            <div className="px-4 mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </form>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`${isActive("/") && location.pathname === "/"
                  ? "text-pink-500 font-medium"
                  : "text-slate-300 hover:text-white"
                  } transition-colors duration-200`}
              >
                Inicio
              </Link>
              <Link
                to="/catalogo"
                onClick={() => setIsMenuOpen(false)}
                className={`${isActive("/catalogo")
                  ? "text-pink-500 font-medium"
                  : "text-slate-300 hover:text-white"
                  } transition-colors duration-200`}
              >
                Catálogo
              </Link>
              <Link
                to="/comunidad"
                onClick={() => setIsMenuOpen(false)}
                className={`${isActive("/comunidad") || isActive("/blog") || isActive("/noticias")
                  ? "text-pink-500 font-medium"
                  : "text-slate-300 hover:text-white"
                  } transition-colors duration-200`}
              >
                Comunidad
              </Link>
              <Link
                to="/nosotros"
                onClick={() => setIsMenuOpen(false)}
                className={`${isActive("/nosotros")
                  ? "text-pink-500 font-medium"
                  : "text-slate-300 hover:text-white"
                  } transition-colors duration-200`}
              >
                Nosotros
              </Link>

              {/* Mobile Wishlist */}
              <Link
                to="/usuario/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
              >
                <Heart className="w-4 h-4 mr-2" />
                Lista de Deseos
                {wishlist.length > 0 && (
                  <Badge variant="default" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-pink-500">
                    {wishlist.length}
                  </Badge>
                )}
              </Link>

              {/* Mobile Cart */}
              <Link
                to="/carrito"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
                {itemCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Link>

              {user ? (
                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <p className="text-slate-300">{user.nombre}</p>
                  {user.rol === "admin" ? (
                    <Button
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      Panel Administrativo
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate("/usuario/perfil");
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      Mi Perfil
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/usuario/login");
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Iniciar Sesión
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
