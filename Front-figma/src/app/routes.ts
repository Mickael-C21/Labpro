import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { AppointmentForm } from "./pages/AppointmentForm";
import { AppointmentTracking } from "./pages/AppointmentTracking";
import { ChatBot } from "./pages/ChatBot";
import { NotFound } from "./pages/NotFound";
import { CGU } from "./pages/CGU";
import { MentionsLegales } from "./pages/MentionsLegales";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "admin", Component: AdminLogin },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "produits", Component: Products },
      { path: "produit/:id", Component: ProductDetail },
      { path: "rendez-vous", Component: AppointmentForm },
      { path: "chat", Component: ChatBot },
      { path: "mes-rendez-vous", Component: AppointmentTracking },
      { path: "cgu", Component: CGU },
      { path: "mentions-legales", Component: MentionsLegales },
      { path: "*", Component: NotFound },
    ],
  },
]);