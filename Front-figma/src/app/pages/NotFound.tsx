import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft, FlaskConical } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-full w-fit mx-auto mb-6">
            <FlaskConical className="size-12 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Page introuvable
          </h2>
          <p className="text-slate-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="size-5" />
                Retour à l'accueil
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => window.history.back()}
              className="gap-2 w-full sm:w-auto"
            >
              <ArrowLeft className="size-5" />
              Page précédente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}