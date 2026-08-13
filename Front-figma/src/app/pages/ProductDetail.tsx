import { useParams, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import { apiGet } from "../../../api";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowLeft, Phone, Calendar, Check, Package, Shield, Truck, Star } from "lucide-react";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiGet<Product>(`/products/${id}`)
      .then((data) => setProduct(data))
      .catch((err) => console.error("Failed to load product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">Chargement...</div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Produit non trouvé</h1>
        <Button onClick={() => navigate("/produits")}>Retour aux produits</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/produits")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="size-4" />
        Retour aux produits
      </Button>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-slate-100">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
            {product.inStock && (
              <Badge className="absolute top-4 right-4 bg-green-600">
                En stock
              </Badge>
            )}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-lg">
              <Truck className="size-5 text-blue-600" />
              <span className="text-xs text-slate-600 text-center">Livraison rapide</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-lg">
              <Shield className="size-5 text-green-600" />
              <span className="text-xs text-slate-600 text-center">Garantie 2 ans</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-lg">
              <Package className="size-5 text-purple-600" />
              <span className="text-xs text-slate-600 text-center">Retour gratuit</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.specifications.brand}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {product.name}
            </h1>
            <p className="text-lg text-slate-600">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Prix</p>
            <p className="text-4xl font-bold text-slate-900">
              {product.price}€
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-slate-600">(128 avis)</span>
            </div>
          </div>

          {/* Specifications */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Spécifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Marque</span>
                  <span className="font-medium text-slate-900">{product.specifications.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Modèle</span>
                  <span className="font-medium text-slate-900">{product.specifications.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Année</span>
                  <span className="font-medium text-slate-900">{product.specifications.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">État</span>
                  <span className="font-medium text-slate-900">{product.specifications.condition}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description & Features */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
            <p className="text-slate-700 leading-relaxed">
              {product.longDescription}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Caractéristiques principales</h2>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action Section */}
      <Card className="bg-gradient-to-br from-slate-50 to-purple-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Besoin de conseils avant d'acheter ?
            </h2>
            <p className="text-slate-600">
              Nos experts sont disponibles pour répondre à toutes vos questions et vous guider dans votre choix
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Immediate Call */}
            <Card className="bg-white border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="size-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Appel Immédiat</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Un expert vous rappelle dans les 5 minutes
                </p>
                <Link to="/rendez-vous" state={{ type: "immediate", product: product.name }}>
                  <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                    <Phone className="size-4" />
                    Être rappelé maintenant
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Scheduled Call */}
            <Card className="bg-white border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="size-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Programmer un Appel</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Choisissez le créneau qui vous convient
                </p>
                <Link to="/rendez-vous" state={{ type: "scheduled", product: product.name }}>
                  <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                    <Calendar className="size-4" />
                    Choisir un créneau
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
