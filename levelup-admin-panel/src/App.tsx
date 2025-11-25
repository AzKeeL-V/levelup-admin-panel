import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ProductProvider } from "./context/ProductContext";
import { UserProvider } from "./context/UserContext";
import { BlogProvider } from "./context/BlogContext";
import { OrderProvider } from "./context/OrderContext";
import { CartProvider } from "./context/CartContext";
import { ReviewProvider } from "./context/ReviewContext";
import { WishlistProvider } from "./context/WishlistContext";
import PageTransition from "./components/PageTransition";
import Index from "./pages/Index";
import Catalogo from "./pages/Catalogo";
import RewardsStore from "./pages/RewardsStore";
import RedemptionCheckout from "./pages/RedemptionCheckout";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import Comunidad from "./pages/Comunidad";
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Noticias from "./pages/Noticias";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Productos from "./pages/admin/Productos";
import Pedidos from "./pages/admin/Pedidos";
import Usuarios from "./pages/admin/Usuarios";
import Puntos from "./pages/admin/Puntos";
import AdminBlog from "./pages/admin/Blog";
import AdminNoticias from "./pages/admin/Noticias";
import Login from "./pages/usuario/Login";
import Register from "./pages/usuario/Register";
import ForgotPassword from "./pages/usuario/ForgotPassword";
import Perfil from "./pages/usuario/Perfil";
import Wishlist from "./pages/usuario/Wishlist";
import Pedido from "./pages/usuario/Pedido";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProductProvider>
      <UserProvider>
        <BlogProvider>
          <OrderProvider>
            <CartProvider>
              <WishlistProvider>
                <ReviewProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                      <AnimatePresence mode="wait">
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
                          <Route path="/catalogo" element={<PageTransition><Catalogo /></PageTransition>} />
                          <Route path="/rewards-store" element={<PageTransition><RewardsStore /></PageTransition>} />
                          <Route path="/redemption/product/:productId" element={<PageTransition><RedemptionCheckout /></PageTransition>} />
                          <Route path="/carrito" element={<PageTransition><Carrito /></PageTransition>} />
                          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
                          <Route path="/comunidad" element={<PageTransition><Comunidad /></PageTransition>} />
                          <Route path="/nosotros" element={<PageTransition><Nosotros /></PageTransition>} />
                          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                          <Route path="/blog/:id" element={<PageTransition><BlogDetail /></PageTransition>} />
                          <Route path="/noticias" element={<PageTransition><Noticias /></PageTransition>} />

                          {/* User Routes */}
                          <Route path="/usuario/login" element={<PageTransition><Login /></PageTransition>} />
                          <Route path="/usuario/register" element={<PageTransition><Register /></PageTransition>} />
                          <Route path="/usuario/forgot-password" element={<ForgotPassword />} />
                          <Route path="/usuario/perfil" element={<PageTransition><Perfil /></PageTransition>} />
                          <Route path="/usuario/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
                          <Route path="/usuario/pedido/:id" element={<PageTransition><Pedido /></PageTransition>} />

                          {/* Admin Routes */}
                          <Route path="/admin/dashboard" element={<PageTransition><AdminLayout><AdminDashboard /></AdminLayout></PageTransition>} />
                          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                          <Route path="/admin/productos" element={<PageTransition><AdminLayout><Productos /></AdminLayout></PageTransition>} />
                          <Route path="/admin/pedidos" element={<PageTransition><AdminLayout><Pedidos /></AdminLayout></PageTransition>} />
                          <Route path="/admin/usuarios" element={<PageTransition><AdminLayout><Usuarios /></AdminLayout></PageTransition>} />
                          <Route path="/admin/puntos" element={<PageTransition><AdminLayout><Puntos /></AdminLayout></PageTransition>} />
                          <Route path="/admin/blog" element={<PageTransition><AdminLayout><AdminBlog /></AdminLayout></PageTransition>} />
                          <Route path="/admin/noticias" element={<PageTransition><AdminLayout><AdminNoticias /></AdminLayout></PageTransition>} />

                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                        </Routes>
                      </AnimatePresence>
                    </BrowserRouter>
                  </TooltipProvider>
                </ReviewProvider>
              </WishlistProvider>
            </CartProvider>
          </OrderProvider>
        </BlogProvider>
      </UserProvider>
    </ProductProvider>
  </QueryClientProvider>
);


export default App;
