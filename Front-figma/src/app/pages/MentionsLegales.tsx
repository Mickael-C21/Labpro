import React from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function MentionsLegales() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Mentions Légales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Informations légales concernant l'éditeur du site.</p>

          <h3 className="font-semibold mt-4">Éditeur</h3>
          <p className="mb-3">Nom de la société: LabConnect<br/>Adresse: 1 rue Exemple, 75000 Paris<br/>SIRET: 000 000 000 00000</p>

          <h3 className="font-semibold mt-4">Directeur de la publication</h3>
          <p className="mb-3">Monsieur/Madame X</p>

          <h3 className="font-semibold mt-4">Hébergement</h3>
          <p className="mb-3">Site hébergé par : Fournisseur d'hébergement</p>

          <div className="mt-6">
            <Link to="/" className="text-blue-900">Retour à l'accueil</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
