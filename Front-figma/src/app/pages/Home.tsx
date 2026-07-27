import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Search,
  MapPin,
  Sparkles,
  FlaskConical,
  Snowflake,
  Scale,
  Armchair,
  Microscope,
  Droplet
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=80";

const categories = [
  { id: "autoclaves", name: "Autoclaves", icon: FlaskConical },
  { id: "refrigeration", name: "Réfrigération", icon: Snowflake },
  { id: "balances", name: "Balances", icon: Scale },
  { id: "mobilier", name: "Mobilier", icon: Armchair },
  { id: "analyseurs", name: "Analyseurs", icon: Microscope },
  { id: "purification", name: "Purification d'eau", icon: Droplet }
];

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/produits", { state: { searchQuery } });
  };

  return (
    <div className="relative min-h-[calc(100vh-200px)] overflow-hidden py-6 md:py-12">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-slate-950/35" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-200px)] w-full max-w-6xl items-center px-4 text-white">
        <div className="w-full text-center lg:text-left lg:max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-2 text-sm font-medium text-purple-700 shadow-sm mb-6">
            <Sparkles className="size-4" />
            Comparez et équipez votre laboratoire
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Trouvez l'équipement idéal<br />pour votre laboratoire
          </h1>

          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto lg:mx-0">
            Découvrez plus de 20 équipements de laboratoire professionnels, avec des recommandations
            adaptées à vos besoins.
          </p>

          <div className="mb-6">
            <form onSubmit={handleSearch}>
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un équipement, une marque, un modèle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-7 text-lg rounded-xl shadow-lg border-slate-200 bg-white/95 text-slate-900"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg"
                >
                  Rechercher
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
            <Link to="/produits">
              <Button variant="outline" className="gap-2 rounded-full">
                <MapPin className="size-4" />
                Rechercher partout
              </Button>
            </Link>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-sm text-white/75">Catégories suggérées:</span>
              {categories.slice(0, 3).map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link key={cat.id} to="/produits">
                    <Badge variant="secondary" className="gap-1.5 cursor-pointer hover:bg-slate-200 text-slate-900">
                      <Icon className="size-3" />
                      {cat.name}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mb-14">
            <Link to="/produits" className="text-purple-300 hover:text-purple-200 font-medium text-sm">
              Recherche avancée →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto lg:mx-0 pt-8 border-t border-white/20">
            <div>
              <div className="text-4xl font-bold text-white mb-1">30+</div>
              <div className="text-sm text-white/75">Marques disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">5 000+</div>
              <div className="text-sm text-white/75">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">40 000+</div>
              <div className="text-sm text-white/75">Équipements vendus</div>
            </div>
          </div>
        </div>

        {/* Chatbot Teaser - Floating */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl max-w-xs mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Sparkles className="size-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold mb-1">Besoin d'aide pour choisir ?</p>
                <p className="text-sm text-slate-300">
                  Nos experts sont disponibles pour vous conseiller par téléphone. Planifiez un appel dès maintenant !
                </p>
              </div>
            </div>
            <Link to="/rendez-vous">
              <Button variant="secondary" size="sm" className="w-full mt-3">
                Parler à un expert
              </Button>
            </Link>
          </div>
          <Link to="/rendez-vous">
            <Button
              size="lg"
              className="rounded-full w-16 h-16 shadow-2xl bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="size-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}