import { Outlet, Link, useLocation } from "react-router";
import { FlaskConical, ShoppingBag, Calendar, Home as HomeIcon, User, Shield, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { Badge } from "./ui/badge";

export function Layout() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-[1400px] px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg">
                <FlaskConical className="size-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900">LabConnect</h1>
                <p className="text-xs text-slate-500">Votre laboratoire, notre expertise</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <Link to="/">
                <Button
                  variant={location.pathname === "/" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <HomeIcon className="size-4" />
                  <span className="hidden sm:inline">Accueil</span>
                </Button>
              </Link>

              {isAdmin ? (
                <>
                  <Link to="/admin/dashboard">
                    <Button
                      variant={location.pathname === "/admin/dashboard" ? "default" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <Calendar className="size-4" />
                      <span className="hidden sm:inline">Tableau de bord</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/produits">
                    <Button
                      variant={location.pathname.startsWith("/produit") ? "default" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <ShoppingBag className="size-4" />
                      <span className="hidden sm:inline">Produits</span>
                    </Button>
                  </Link>
                  <Link to="/mes-rendez-vous">
                    <Button
                      variant={location.pathname === "/mes-rendez-vous" ? "default" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <Calendar className="size-4" />
                      <span className="hidden sm:inline">Mes RDV</span>
                    </Button>
                  </Link>
                </>
              )}

              <div className="ml-2 pl-2 border-l border-slate-200 flex items-center gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                      {isAdmin ? (
                        <Shield className="size-4 text-slate-700" />
                      ) : (
                        <User className="size-4 text-slate-700" />
                      )}
                      <span className="text-sm text-slate-700 hidden md:inline">{user.name}</span>
                      <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                        {isAdmin ? "Admin" : "Client"}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="gap-2"
                    >
                      <LogOut className="size-4" />
                      <span className="hidden sm:inline">Déconnexion</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="size-4" />
                        <span className="hidden sm:inline">Client</span>
                      </Button>
                    </Link>
                    <Link to="/admin">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Shield className="size-4" />
                        <span className="hidden sm:inline">Admin</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={isHomePage ? "w-full px-0 py-0" : "mx-auto max-w-[1400px] px-6 py-8"}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="mx-auto max-w-[1400px] px-6 py-6">
          <div className="text-center text-sm text-slate-500">
            <p>© 2026 LabConnect - Votre expert en équipements de laboratoire</p>
          </div>
        </div>
      </footer>
    </div>
  );
}