import React from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function CGU() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Conditions Générales d'Utilisation (CGU)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Dernière mise à jour : 2026-08-14</p>
          <h3 className="font-semibold mt-4">1. Acceptation</h3>
          <p className="mb-3">En utilisant ce site, vous acceptez les présentes conditions générales d'utilisation.</p>

          <h3 className="font-semibold mt-4">2. Accès et utilisation</h3>
          <p className="mb-3">L'accès au site est fourni à titre indicatif et peut être suspendu sans préavis.</p>

          <h3 className="font-semibold mt-4">3. Propriété intellectuelle</h3>
          <p className="mb-3">Tous les contenus présents sur le site sont protégés par le droit d'auteur.</p>

          <h3 className="font-semibold mt-4">4. Responsabilités</h3>
          <p className="mb-3">Nous déclinons toute responsabilité pour les dommages indirects liés à l'utilisation du site.</p>

          <h3 className="font-semibold mt-4">5. Données personnelles</h3>
          <p className="mb-3">La gestion des données personnelles est décrite dans notre politique de confidentialité.</p>

          <div className="mt-6">
            <Link to="/" className="text-blue-900">Retour à l'accueil</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
