import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiGet, apiPatch } from "../../../api";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Calendar,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Users,
  BarChart3,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string | null;
  call_type: "immediate" | "scheduled";
  scheduled_at: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  feedback: string | null;
  result: string | null;
  created_at: string;
}

interface AdminStats {
  total_users: number;
  total_products: number;
  total_calls: number;
  pending_calls: number;
  completed_calls: number;
  cancelled_calls: number;
}

export function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [agentNote, setAgentNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/admin");
      return;
    }

    if (!isAdmin) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [callsData, statsData] = await Promise.all([
          apiGet<Appointment[]>("/calls"),
          apiGet<AdminStats>("/admin/stats"),
        ]);
        setAppointments(callsData);
        setStats(statsData);
      } catch (err) {
        console.error(err);
        setError((err as Error).message || "Erreur lors du chargement du tableau de bord");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isAdmin, navigate]);

  const statusConfig = {
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    in_progress: { label: "En cours", color: "bg-blue-100 text-blue-800", icon: Phone },
    completed: { label: "Terminé", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
    cancelled: { label: "Annulé", color: "bg-red-100 text-red-800", icon: XCircle },
  };

  const updateStatus = async (appointmentId: number, newStatus: Appointment["status"]) => {
    try {
      const updated = await apiPatch<Appointment>(`/calls/${appointmentId}`, { status: newStatus });
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? updated : apt));
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Impossible de mettre à jour le statut");
    }
  };

  const saveAgentNote = async (appointmentId: number) => {
    try {
      const updated = await apiPatch<Appointment>(`/calls/${appointmentId}`, { feedback: agentNote });
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? updated : apt));
      setAgentNote("");
      setSelectedAppointment(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Impossible d'enregistrer la note");
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || apt.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const summarizedStats = stats || {
    total_users: 0,
    total_products: 0,
    total_calls: appointments.length,
    pending_calls: appointments.filter(a => a.status === "pending").length,
    completed_calls: appointments.filter(a => a.status === "completed").length,
    cancelled_calls: appointments.filter(a => a.status === "cancelled").length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Tableau de bord Agent
        </h1>
        <p className="text-slate-600">
          Bienvenue {user?.name} - Gérez vos rendez-vous clients
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Utilisateurs totaux</p>
                <p className="text-3xl font-bold text-slate-900">{summarizedStats.total_users}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="size-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Appels totaux</p>
                <p className="text-3xl font-bold text-yellow-600">{summarizedStats.total_calls}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <BarChart3 className="size-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">En attente</p>
                <p className="text-3xl font-bold text-blue-600">{summarizedStats.pending_calls}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Terminés</p>
                <p className="text-3xl font-bold text-green-600">{summarizedStats.completed_calls}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Rechercher un client, sujet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "Tous" },
                { value: "pending", label: "En attente" },
                { value: "in_progress", label: "En cours" },
                { value: "completed", label: "Terminés" },
                { value: "cancelled", label: "Annulés" },
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={filterStatus === filter.value ? "default" : "outline"}
                  onClick={() => setFilterStatus(filter.value)}
                  size="sm"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="size-8 text-purple-600 animate-spin" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="size-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Aucun rendez-vous trouvé</p>
          </CardContent>
        </Card>
      ) : (
          filteredAppointments.map((appointment) => {
            const StatusIcon = statusConfig[appointment.status].icon;
            return (
              <Card key={appointment.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Client Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{appointment.name}</h3>
                          <p className="text-sm text-slate-600">{appointment.email}</p>
                          <p className="text-sm text-slate-600">{appointment.phone}</p>
                        </div>
                        <Badge className={statusConfig[appointment.status].color}>
                          <StatusIcon className="size-3 mr-1" />
                          {statusConfig[appointment.status].label}
                        </Badge>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-slate-700 mb-1">Sujet</p>
                        <p className="text-slate-900">{appointment.subject || "Demande d'appel"}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant={appointment.call_type === "immediate" ? "default" : "secondary"}>
                            {appointment.call_type === "immediate" ? "Immédiat" : "Programmé"}
                          </Badge>
                        </div>
                        {appointment.call_type === "scheduled" && appointment.scheduled_at && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="size-4" />
                            <span>{new Date(appointment.scheduled_at).toLocaleString("fr-FR", {
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          <MessageSquare className="size-4 inline mr-1" />
                          Message du client
                        </p>
                        <p className="text-sm text-blue-800">{appointment.subject || "Aucun message"}</p>
                      </div>

                      {appointment.feedback && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <p className="text-sm font-medium text-green-900 mb-1">
                            Notes de l'agent
                          </p>
                          <p className="text-sm text-green-800">{appointment.feedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-64 space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">Changer le statut</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant={appointment.status === "pending" ? "default" : "outline"}
                            onClick={() => updateStatus(appointment.id, "pending")}
                          >
                            En attente
                          </Button>
                          <Button
                            size="sm"
                            variant={appointment.status === "in_progress" ? "default" : "outline"}
                            onClick={() => updateStatus(appointment.id, "in_progress")}
                          >
                            En cours
                          </Button>
                          <Button
                            size="sm"
                            variant={appointment.status === "completed" ? "default" : "outline"}
                            onClick={() => updateStatus(appointment.id, "completed")}
                          >
                            Terminé
                          </Button>
                          <Button
                            size="sm"
                            variant={appointment.status === "cancelled" ? "destructive" : "outline"}
                            onClick={() => updateStatus(appointment.id, "cancelled")}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>

                      {selectedAppointment?.id === appointment.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Ajouter une note..."
                            value={agentNote}
                            onChange={(e) => setAgentNote(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveAgentNote(appointment.id)}
                              className="flex-1"
                            >
                              Enregistrer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAppointment(null);
                                setAgentNote("");
                              }}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setAgentNote(appointment.feedback || "");
                          }}
                        >
                          <MessageSquare className="size-4 mr-2" />
                          Ajouter une note
                        </Button>
                      )}

                      <Button
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => window.location.href = `tel:${appointment.phone}`}
                      >
                        <Phone className="size-4" />
                        Appeler le client
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
