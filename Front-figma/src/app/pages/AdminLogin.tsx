import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Shield, Lock, Mail, ArrowRight } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full mb-4">
            <Shield className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Espace Administrateur
          </h1>
          <p className="text-slate-600">
            Accès réservé aux agents et administrateurs
          </p>
        </div>

        <Card className="border-slate-300">
          <CardHeader>
            <CardTitle>Connexion Sécurisée</CardTitle>
            <CardDescription>
              Authentification requise pour accéder au back-office
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@entreprise.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 bg-slate-800 hover:bg-slate-900" disabled={isLoading}>
                {isLoading ? "Vérification..." : "Accéder au back-office"}
                <ArrowRight className="size-4" />
              </Button>

              <div className="text-center pt-4">
                <p className="text-sm text-slate-500">
                  Compte de test admin : <br />
                  <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                    admin@test.fr / admin123
                  </code>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
