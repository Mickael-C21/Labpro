import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Send,
  Bot,
  User,
  Phone,
  Loader2,
  FlaskConical,
  Sparkles,
  FileText
} from "lucide-react";
import { ChatMessage } from "../data/instruments";

const categoryMessages: Record<string, string> = {
  autoclaves: "Bonjour ! 👋 Je vois que vous vous intéressez aux autoclaves. Excellent choix ! Je peux vous renseigner sur nos modèles de paillasse, verticaux ou industriels, ou vous préparer un devis. Que recherchez-vous ?",
  refrigeration: "Bonjour ! 👋 Bienvenue dans notre espace réfrigération de laboratoire ! Je peux vous aider à choisir entre un réfrigérateur, un congélateur -40°C ou une chambre froide de paillasse. Qu'est-ce qui vous intéresse ?",
  balances: "Bonjour ! 👋 Vous vous intéressez à nos balances de laboratoire ? Parfait ! Je peux vous conseiller sur les balances analytiques, de précision ou compteuses. Que souhaitez-vous savoir ?",
  mobilier: "Bonjour ! 👋 Le mobilier de laboratoire est essentiel à un poste de travail sûr et efficace ! Je peux vous renseigner sur nos bancs de travail, armoires de sécurité et sièges ergonomiques. Qu'est-ce qui vous intéresse ?",
  analyseurs: "Bonjour ! 👋 Nos analyseurs et équipements d'analyse couvrent centrifugeuses, incubateurs, bains-marie et analyseurs TOC ou d'humidité. Que recherchez-vous ?",
  purification: "Bonjour ! 👋 Vous vous intéressez aux systèmes de purification d'eau ? Excellent ! Je peux vous conseiller sur nos gammes type I, type II et osmoseurs. Comment puis-je vous aider ?"
};

const predefinedQuestions = [
  "Je voudrais un devis pour un autoclave",
  "Quels types de réfrigérateurs de laboratoire proposez-vous ?",
  "Quel est le prix d'une balance analytique ?",
  "Je cherche un système de purification d'eau"
];

// Mots-clés par catégorie de produit
const categoryKeywords: { id: string; label: string; keywords: string[] }[] = [
  { id: "autoclaves", label: "autoclaves", keywords: ["autoclave", "stérilis", "stérilisation"] },
  { id: "refrigeration", label: "réfrigération de laboratoire", keywords: ["réfrigérat", "refrigerat", "frigo", "congélateur", "congelateur", "chambre froide"] },
  { id: "balances", label: "balances de laboratoire", keywords: ["balance", "pesée", "pesee", "peser"] },
  { id: "mobilier", label: "mobilier de laboratoire", keywords: ["mobilier", "meuble", "armoire", "paillasse", "banc de travail", "chaise"] },
  { id: "analyseurs", label: "analyseurs", keywords: ["analyseur", "centrifugeuse", "incubateur", "bain-marie", "bain marie", "toc", "humidité", "humidite"] },
  { id: "purification", label: "purification d'eau", keywords: ["purification", "eau", "osmose", "osmoseur"] }
];

const quoteKeywords = ["devis", "prix", "tarif", "coût", "cout", "budget", "combien"];
const warrantyKeywords = ["garantie", "sav", "panne", "casse"];
const shippingKeywords = ["livraison", "délai", "delai", "expédition", "expedition"];
const hoursKeywords = ["horaire", "ouvert", "disponib", "quand", "joignable"];
const contactKeywords = ["contact", "téléphone", "telephone", "email", "mail", "adresse"];
const dissatisfactionKeywords = [
  "non", "pas satisf", "pas utile", "pas la réponse", "pas ce que", "autre chose",
  "ça ne répond pas", "ca ne repond pas", "insatisf", "toujours pas", "ce n'est pas ça"
];

interface BotReply {
  text: string;
  matched: boolean;
}

function findCategory(message: string) {
  return categoryKeywords.find((cat) => cat.keywords.some((kw) => message.includes(kw)));
}

function generateReply(userMessage: string): BotReply {
  const lowerMessage = userMessage.toLowerCase();

  const isDissatisfied = dissatisfactionKeywords.some((kw) => lowerMessage.includes(kw));
  if (isDissatisfied) {
    return {
      text: "Je comprends, je ne veux pas vous faire perdre de temps. Le plus simple est qu'un de nos conseillers vous appelle directement pour répondre précisément à votre besoin. Cliquez sur le bouton ci-contre, ou dites-moi le sujet et je prépare la demande avec vous. 📞",
      matched: true
    };
  }

  const wantsQuote = quoteKeywords.some((kw) => lowerMessage.includes(kw));
  const category = findCategory(lowerMessage);

  if (wantsQuote && category) {
    return {
      text: `Avec plaisir ! Pour établir un devis précis sur nos ${category.label}, j'ai besoin de connaître le modèle qui vous intéresse et votre usage (capacité, fréquence d'utilisation...). Je peux vous mettre en relation avec un conseiller qui vous enverra un devis personnalisé sous 24h. Souhaitez-vous demander un appel ou programmer un rendez-vous ? 📞`,
      matched: true
    };
  }

  if (wantsQuote) {
    return {
      text: "Bien sûr, je peux vous aider à obtenir un devis ! Pour quel type d'équipement souhaitez-vous une estimation : autoclave, réfrigération, balance, mobilier, analyseur ou purification d'eau ?",
      matched: true
    };
  }

  if (category) {
    return {
      text: `Concernant nos ${category.label}, je peux vous donner des informations générales, comparer des modèles, ou établir un devis personnalisé. Que préférez-vous : en savoir plus sur les modèles disponibles, ou obtenir un devis ?`,
      matched: true
    };
  }

  if (warrantyKeywords.some((kw) => lowerMessage.includes(kw))) {
    return {
      text: "Tous nos équipements sont couverts par une garantie de 2 ans, avec un retour gratuit en cas de défaut. Pour un problème sur un équipement déjà livré, un conseiller peut prendre en charge votre dossier SAV directement. Voulez-vous être mis en relation ?",
      matched: true
    };
  }

  if (shippingKeywords.some((kw) => lowerMessage.includes(kw))) {
    return {
      text: "Les délais de livraison varient selon l'équipement et la disponibilité en stock — en général entre 3 et 10 jours ouvrés en France métropolitaine. Un conseiller peut vous confirmer le délai exact pour le produit qui vous intéresse.",
      matched: true
    };
  }

  if (hoursKeywords.some((kw) => lowerMessage.includes(kw))) {
    return {
      text: "Cet assistant est disponible 24/7. Nos conseillers, eux, sont joignables par téléphone du lundi au vendredi, 9h-18h. Vous pouvez aussi demander un appel immédiat ou programmer un créneau qui vous convient.",
      matched: true
    };
  }

  if (contactKeywords.some((kw) => lowerMessage.includes(kw))) {
    return {
      text: "Le plus simple pour être contacté directement est de demander un appel via le bouton ci-contre — un conseiller vous rappelle sous peu, ou au créneau que vous choisissez.",
      matched: true
    };
  }

  // Default response when nothing was recognized
  return {
    text: "C'est une excellente question ! Pour vous donner la meilleure réponse possible, dites-moi si cela concerne un type d'équipement précis (autoclave, réfrigération, balance, mobilier, analyseur, purification d'eau), un devis, une livraison, une garantie ou un horaire. Sinon, je vous propose de vous mettre en relation avec un expert. Souhaitez-vous planifier un appel de 15 minutes ? 📞",
    matched: false
  };
}

export function ChatBot() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const category = location.state?.category;

  const initialMessages: ChatMessage[] = [
    {
      id: "1",
      role: "assistant",
      content: category && categoryMessages[category]
        ? categoryMessages[category]
        : "Bonjour ! 👋 Je suis l'assistant virtuel LabConnect. Je peux vous renseigner sur nos équipements de laboratoire ou préparer un devis personnalisé. Que recherchez-vous aujourd'hui ?",
      timestamp: new Date()
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unmatchedCount, setUnmatchedCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(text);
      const nextUnmatched = reply.matched ? 0 : unmatchedCount + 1;
      setUnmatchedCount(nextUnmatched);

      // Après 2 réponses sans correspondance claire, on pousse fortement vers le RDV
      const finalText =
        nextUnmatched >= 2
          ? (user
              ? "Je n'arrive pas à identifier précisément votre besoin par ici. Le plus efficace est qu'un conseiller vous rappelle directement — cliquez sur « Demander un appel » ci-contre, je vous y redirige tout de suite. 📞"
              : "Je n'arrive pas à identifier précisément votre besoin par ici. Le plus efficace est qu'un conseiller vous rappelle directement — créez un compte en un instant via le bouton ci-contre, vous pourrez ensuite réserver un créneau avec un agent. 📞")
          : reply.text;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: finalText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      if (nextUnmatched >= 2) {
        setUnmatchedCount(0);
      }
    }, 1200);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleRequestCall = () => {
    const chatContext = messages
      .filter(m => m.role === "user")
      .map(m => m.content)
      .join(" | ");

    sessionStorage.setItem("chatContext", chatContext);

    if (!user) {
      // Le client doit d'abord créer un compte pour réserver un créneau
      navigate("/register", { state: { from: "/rendez-vous" } });
    } else {
      navigate("/rendez-vous");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-800 to-slate-800 p-2 rounded-lg">
                    <Bot className="size-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Assistant LabConnect</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                      <CardDescription className="text-xs">En ligne</CardDescription>
                    </div>
                  </div>
                </div>
                <Badge className="gap-1">
                  <Sparkles className="size-3" />
                  IA
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-blue-600"
                      : "bg-gradient-to-br from-blue-800 to-slate-800"
                  }`}>
                    {message.role === "user" ? (
                      <User className="size-4 text-white" />
                    ) : (
                      <Bot className="size-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === "user" ? "text-blue-100" : "text-slate-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-gradient-to-br from-blue-800 to-slate-800 flex items-center justify-center flex-shrink-0">
                    <Bot className="size-4 text-white" />
                  </div>
                  <div className="bg-slate-100 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="size-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            <CardFooter className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2 w-full"
              >
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Posez votre question..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button type="submit" disabled={!inputValue.trim() || isTyping} className="gap-2">
                  <Send className="size-4" />
                  <span className="hidden sm:inline">Envoyer</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleRequestCall}
                className="w-full gap-2 bg-gradient-to-r from-blue-800 to-slate-600 hover:from-blue-900 hover:to-slate-700"
              >
                <Phone className="size-4" />
                {user ? "Demander un appel" : "Créer un compte pour réserver"}
              </Button>
              <Button
                onClick={handleRequestCall}
                variant="outline"
                className="w-full gap-2"
              >
                <FileText className="size-4" />
                Demander un devis
              </Button>
              <p className="text-xs text-slate-500 text-center">
                {user
                  ? "Échangez avec un expert en 15 minutes"
                  : "Compte gratuit, en moins d'une minute"}
              </p>
            </CardContent>
          </Card>

          {/* Predefined Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FlaskConical className="size-5" />
                Questions fréquentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {predefinedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isTyping}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-700 text-white border-none">
            <CardContent className="p-6">
              <Bot className="size-10 mb-3 opacity-80" />
              <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-slate-300 mb-4">
                Notre assistant répond à vos questions sur nos équipements et vos demandes de devis. Si besoin, nous vous mettons en contact avec un expert.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="size-2 bg-green-400 rounded-full animate-pulse" />
                <span>Disponible 24/7</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}