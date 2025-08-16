import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  TrendingUp,
  User,
  LogIn,
  MessageCircle,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import AuthModal from "./AuthModal";
import { useChatbot } from "./ChatbotProvider";
import logo from "../images/logo_silvofinance.png";

const checkAuthStatus = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!token && !!user;
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { openChatbot } = useChatbot();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Vérifier l'authentification au chargement initial
    setIsAuthenticated(checkAuthStatus());

    const handleStorageChange = (event: StorageEvent) => {
      // Ne traiter que les changements concernant 'token' ou 'user'
      if (event.key === "token" || event.key === "user") {
        setIsAuthenticated(checkAuthStatus());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 20);
      }
    };

    // Appliquer immédiatement au montage
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]); // Dépendance ajoutée

  const navItems = [
    { name: "Accueil", href: "/", isRoute: true },
    { name: "À Propos", href: "#about", isAnchor: true },
    { name: "Packs d'Investissement", href: "/packs", isRoute: true },
    { name: "Témoignages", href: "#testimonials", isAnchor: true },
    { name: "Contact", href: "/contact", isRoute: true },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState({}, "", href);
    }
    setIsMenuOpen(false);
  };

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode); // Forcez le mode ici
    setIsAuthModalOpen(true);
    setSuccessMessage(""); // Réinitialisez le message de succès
  };
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Silvo Finance Logo"
                className={`max-h-16 md:max-h-24 w-auto transition-all duration-300 ${
                  isScrolled ? "" : "brightness-0 invert"
                }`}
              />
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              {navItems.map((item) => {
                if (item.isRoute) {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`font-medium transition-colors duration-300 hover:text-blue-600 text-sm xl:text-base ${
                        isScrolled
                          ? "text-gray-900"
                          : "text-white hover:text-blue-300"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                } else if (item.isAnchor) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`font-medium transition-colors duration-300 hover:text-blue-600 text-sm xl:text-base ${
                        isScrolled
                          ? "text-gray-900"
                          : "text-white hover:text-blue-300"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                }
                return null;
              })}
            </nav>

            {/* Boutons Auth Desktop */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <button
                onClick={openChatbot}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm xl:text-base ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden xl:block">Chat</span>
              </button>

              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => openAuthModal("login")}
                    className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm xl:text-base ${
                      isScrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden xl:block">Connexion</span>
                  </button>
                  <button
                    onClick={() => openAuthModal("register")} // Bien spécifié 'register'
                    className="btn-primary flex items-center space-x-2 text-sm xl:text-base px-3 xl:px-4 py-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden xl:block">S'inscrire</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm xl:text-base ${
                      isScrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden xl:block">Mon compte</span>
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setIsAuthenticated(false);
                      navigate("/");
                    }}
                    className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm xl:text-base ${
                      isScrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden xl:block">Déconnexion</span>
                  </button>
                </>
              )}
            </div>

            {/* Bouton Menu Mobile */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-900 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t">
              <nav className="px-4 py-6 space-y-4">
                {navItems.map((item) => {
                  if (item.isRoute) {
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block text-gray-900 font-medium hover:text-blue-600 transition-colors duration-300 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  } else if (item.isAnchor) {
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          scrollToSection(item.href);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left text-gray-900 font-medium hover:text-blue-600 transition-colors duration-300 py-2"
                      >
                        {item.name}
                      </button>
                    );
                  }
                  return null;
                })}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <button
                    onClick={() => {
                      openChatbot();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat Support</span>
                  </button>

                  {!isAuthenticated ? (
                    <>
                      <button
                        onClick={() => {
                          openAuthModal("login");
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Connexion</span>
                      </button>
                      <button
                        onClick={() => {
                          openAuthModal("register");
                          setIsMenuOpen(false);
                        }}
                        className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
                      >
                        <User className="w-4 h-4" />
                        <span>S'inscrire</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Mon compte</span>
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          setIsAuthenticated(false);
                          setIsMenuOpen(false);
                          navigate("/");
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        onAuthSuccess={() => setIsAuthenticated(true)}
      />
    </>
  );
};

export default Header;
