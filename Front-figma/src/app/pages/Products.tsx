import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import type { Product } from "../data/products";
import { apiGet } from "../../../api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Input } from "../components/ui/input";
import { FlaskConical, Snowflake, Scale, Armchair, Microscope, Droplet, Search, ShoppingCart } from "lucide-react";

const categories = [
  { id: "all", name: "Tous les produits", icon: ShoppingCart },
  { id: "autoclaves", name: "Autoclaves", icon: FlaskConical },
  { id: "refrigeration", name: "Réfrigération", icon: Snowflake },
  { id: "balances", name: "Balances", icon: Scale },
  { id: "mobilier", name: "Mobilier de Laboratoire", icon: Armchair },
  { id: "analyseurs", name: "Analyseurs", icon: Microscope },
  { id: "purification", name: "Purification d'Eau", icon: Droplet }
];

export function Products() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Récupérer la recherche depuis la page d'accueil
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  useEffect(() => {
    setLoading(true);
    apiGet<Product[]>("/products")
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Notre Catalogue
        </h1>
        <p className="text-lg text-slate-600">
          Découvrez notre sélection d'équipements de laboratoire de qualité professionnelle
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg w-full"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`gap-2 px-4 py-2 rounded-md border border-transparent ${
                  selectedCategory === category.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                <Icon className="size-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Products Count */}
      <div className="mb-6">
        <p className="text-slate-600">
          <span className="font-semibold">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? "s" : ""} trouvé{filteredProducts.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div>Chargement des produits...</div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.inStock ? (
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white">En stock</Badge>
                ) : (
                  <Badge variant="secondary" className="absolute top-4 right-4">Rupture</Badge>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{product.price}€</p>
                    <p className="text-sm text-slate-500">{product.specifications.brand}</p>
                  </div>
                </div>

                <Link to={`/produit/${product.id}`}>
                  <Button className="w-full">Voir les détails</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-slate-500">
            Aucun produit trouvé
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}