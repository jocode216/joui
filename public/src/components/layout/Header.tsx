import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import CategoryBar from "../CategoryBar";

const Header = () => {
  const { totalItems } = useCart();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-border"
        style={{ backgroundColor: "#232f3e" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center">
            <img
              src="/kanahos.jpg"
              alt="Kanaho Logo"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/products"
              className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
            >
              Products
            </Link>
            <Link
              to="/howitworks"
              className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
            >
              How it Works
            </Link>
            <Link
              to="/createstore"
              className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
            >
              Create Store
            </Link>
            {token && role === "ADMIN" && (
              <Link
                to="/admin"
                className="text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors bg-white/10 px-3 py-1 rounded-md"
              >
                Admin Dashboard
              </Link>
            )}
            {token && role === "STORE_OWNER" && (
              <Link
                to="/store"
                className="text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors bg-white/10 px-3 py-1 rounded-md"
              >
                My Store Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {deferredPrompt && (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white mr-2"
                onClick={handleInstallClick}
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-white hover:text-gray-300 hover:bg-transparent"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gray-300 hover:bg-transparent"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-[#232f3e] text-xs font-medium flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-gray-300 hover:bg-transparent"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48"
                style={{ backgroundColor: "#232f3e", borderColor: "#374151" }}
              >
                <DropdownMenuItem asChild className="hover:bg-gray-700">
                  <Link to="/products" className="text-white hover:text-white">
                    Products
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-gray-700">
                  <Link to="/howitworks" className="text-white hover:text-white">
                    How it Works
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-gray-700">
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-white"
                  >
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-gray-700">
                  <Link
                    to="/createstore"
                    className="text-white hover:text-white"
                  >
                    Create store
                  </Link>
                </DropdownMenuItem>
                {token && role === "ADMIN" && (
                  <DropdownMenuItem asChild className="bg-orange-600/20 hover:bg-orange-600/40">
                    <Link
                      to="/admin"
                      className="text-orange-400 font-semibold"
                    >
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {token && role === "STORE_OWNER" && (
                  <DropdownMenuItem asChild className="bg-orange-600/20 hover:bg-orange-600/40">
                    <Link
                      to="/store"
                      className="text-orange-400 font-semibold"
                    >
                      My Store Admin
                    </Link>
                  </DropdownMenuItem>
                )}

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <CategoryBar />
    </>
  );
};

export default Header;
