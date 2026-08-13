import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../../../api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Phone,
  Calendar,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  CalendarClock,
  FileText,
  AlertCircle,
  ArrowRight,
  Zap,
  MessageCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Call {
  id: number;
  user_id: number;
  product_id: number | null;
  agent_id: number | null;
  call_type: "immediate" | "scheduled";
  name: string;
  phone: string;
  email: string;
  subject: string | null;
  scheduled_at: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  feedback: string | null;
  result: string | null;
  created_at: string;
}

const statusConfig = {
  pending: {
    label: "En attente",
    icon: Clock,
    color: "bg-orange-100 text-orange-700",
    badgeVariant: "secondary" as const
  },
  in_progress: {
    label: "En cours",
    icon: Loader2,
    color: "bg-blue-100 text-blue-700",
    badgeVariant: "default" as const
  },
  completed: {
    label: "Terminé",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700",
    badgeVariant: "secondary" as const
  },
  cancelled: {
    label: "Annulé",
    icon: XCircle,
    color: "bg-red-100 text-red-700",
    badgeVariant: "destructive" as const
  }
};

function AppointmentCard({ call }: { call: Call }) {
  const config = statusConfig[call.status] ?? statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={config.badgeVariant} className="gap-1">
                <StatusIcon className={`size-3 ${call.status === "in_progress" ? "animate-spin" : ""}`} />
                {config.label}
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                {call.call_type === "immediate" ? <Zap className="size-3" /> : <CalendarClock className="size-3" />}
                {call.call_type === "immediate" ? "Appel immédiat" : "Programmé"}
              </Badge>
            </div>
            <CardTitle className="text-lg">{call.subject || "Demande d'appel"}</CardTitle>
            <CardDescription className="mt-1">
              Demandé le {format(new Date(call.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="size-4 text-slate-400" />
            <span className="font-medium">{call.name}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{call.phone}</span>
          </div>

          {call.email && (
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="size-4 text-slate-400" />
              <span className="text-slate-600">{call.email}</span>
            </div>
          )}

          {call.scheduled_at && (
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="size-4 text-slate-400" />
              <span className="text-slate-600">
                {format(new Date(call.scheduled_at), "EEEE dd MMMM yyyy à HH:mm", { locale: fr })}
              </span>
            </div>
          )}

          {call.call_type === "immediate" && call.status === "pending" && (
            <div className="flex items-center gap-2 text-orange-700 bg-orange-50 p-2 rounded">
              <Zap className="size-4" />
              <span className="text-xs font-medium">En attente de rappel dans les 5 minutes</span>
            </div>
          )}
        </div>

        {call.result && (
          <div className={`p-3 rounded-lg ${
            call.status === "cancelled"
              ? "bg-red-50 border border-red-200"
              : "bg-green-50 border border-green-200"
          }`}>
            <div className="flex items-start gap-2">
              {call.status === "cancelled" ? (
                <AlertCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className={`text-xs font-medium mb-1 ${
                  call.status === "cancelled" ? "text-red-900" : "text-green-900"
                }`}>
                  {call.status === "cancelled" ? "Raison de l'annulation" : "Résumé de l'appel"}
                </p>
                <p className={`text-sm ${
                  call.status === "cancelled" ? "text-red-700" : "text-green-700"
                }`}>
                  {call.result}
                </p>
              </div>
            </div>
          </div>
        )}

        {call.feedback && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-2">
              <FileText className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900 mb-1">
                  Notes du conseiller
                </p>
                <p className="text-sm text-blue-700">
                  {call.feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {call.status === "cancelled" && (
          <Link to="/rendez-vous">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Phone className="size-4" />
              Replanifier un appel
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export function AppointmentTracking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCalls = async () => {
      try {
        const data = await apiGet<Call[]>("/calls");
        setCalls(data);
      } catch (err) {
        setError("Erreur lors du chargement de vos rendez-vous");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [user, navigate]);

  const filteredCalls = activeTab === "all"
    ? calls
    : calls.filter(c => c.status === activeTab);

  const stats = {
    total: calls.length,
    pending: calls.filter(c => c.status === "pending").length,
    inProgress: calls.filter(c => c.status === "in_progress").length,
    completed: calls.filter(c => c.status === "completed").length,
    cancelled: calls.filter(c => c.status === "cancelled").length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="size-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Mes rendez-vous
        </h1>
        <p className="text-slate-600">
          Suivez vos demandes d'appel et consultez les résumés de vos échanges
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {calls.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                  <p className="text-sm text-slate-600 mt-1">Total</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                  <p className="text-sm text-slate-600 mt-1">En attente</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                  <p className="text-sm text-slate-600 mt-1">En cours</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-sm text-slate-600 mt-1">Terminés</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
                  <p className="text-sm text-slate-600 mt-1">Annulés</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="in_progress">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminés</TabsTrigger>
              <TabsTrigger value="cancelled">Annulés</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredCalls.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredCalls.map((call) => (
                    <AppointmentCard key={call.id} call={call} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <CalendarClock className="size-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucun rendez-vous dans cette catégorie
                  </h3>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {calls.length === 0 && !error && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Phone className="size-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">
              Aucun rendez-vous
            </h3>
            <p className="text-slate-600 mb-6">
              Commencez par discuter avec notre ChatBot ou planifiez directement un appel avec nos experts
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/chat">
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageCircle className="size-5" />
                  ChatBot
                </Button>
              </Link>
              <Link to="/rendez-vous">
                <Button size="lg" className="gap-2">
                  <Phone className="size-5" />
                  Demander un appel
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}