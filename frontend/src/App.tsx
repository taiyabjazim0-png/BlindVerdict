import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/hooks/useAuthStore";
import { ClientLayout } from "@/layouts/ClientLayout";
import { LawyerLayout } from "@/layouts/LawyerLayout";
import { ClientRegisterPage } from "@/pages/client/ClientRegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { LandingPage } from "@/pages/LandingPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { RegisterRolePage } from "@/pages/RegisterRolePage";
import { RegistrationPendingPage } from "@/pages/RegistrationPendingPage";
import { PaymentPage } from "@/pages/PaymentPage";
import { TermsPage } from "@/pages/TermsPage";
import { AnalysisResultPage } from "@/pages/client/AnalysisResultPage";
import { CaseWorkspacePage } from "@/pages/client/CaseWorkspacePage";
import { ClientDashboardPage } from "@/pages/client/ClientDashboardPage";
import { ClientProfilePage } from "@/pages/client/ClientUtilityPages";
import { CoordinationPage } from "@/pages/client/CoordinationPage";
import { LawyerMatchingPage } from "@/pages/client/LawyerMatchingPage";
import { LawyerProfilePage as ClientLawyerProfilePage } from "@/pages/client/LawyerProfilePage";
import { LawyerReviewPage } from "@/pages/client/LawyerReviewPage";
import { MyCasesPage } from "@/pages/client/MyCasesPage";
import { SubmitIssuePage } from "@/pages/client/SubmitIssuePage";
import { ActiveCasesPage } from "@/pages/lawyer/ActiveCasesPage";
import { ClientReviewPage } from "@/pages/lawyer/ClientReviewPage";
import { DocumentVaultPage } from "@/pages/lawyer/DocumentVaultPage";
import { HistoryPage } from "@/pages/lawyer/HistoryPage";
import { InboxPage } from "@/pages/lawyer/InboxPage";
import { LawyerDashboardPage } from "@/pages/lawyer/LawyerDashboardPage";
import { LawyerProfilePage } from "@/pages/lawyer/LawyerProfilePage";
import { MediatorPage } from "@/pages/lawyer/MediatorPage";

const queryClient = new QueryClient();

function ProtectedRoute({ role }: { role: "Client" | "Lawyer" }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}

function LogoutPage() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    queryClient.clear();
    navigate("/", { replace: true });
  }, [logout, navigate]);
  return null;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<RegisterRolePage />} />
        <Route path="/register/client" element={<ClientRegisterPage />} />
        <Route path="/register/lawyer" element={<RegisterPage />} />
        <Route path="/registration-pending" element={<RegistrationPendingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        <Route element={<ProtectedRoute role="Client" />}>
          <Route path="/client" element={<ClientLayout />}>
            <Route path="dashboard" element={<ClientDashboardPage />} />
            <Route path="submit-issue" element={<SubmitIssuePage />} />
            <Route path="analysis-result" element={<AnalysisResultPage />} />
            <Route path="lawyer-matching" element={<LawyerMatchingPage />} />
            <Route path="lawyers/:id" element={<ClientLawyerProfilePage />} />
            <Route path="my-cases" element={<MyCasesPage />} />
            <Route path="coordination/:caseId" element={<CoordinationPage />} />
            <Route path="payment/:caseId" element={<PaymentPage />} />
            <Route path="workspace/:caseId" element={<CaseWorkspacePage />} />
            <Route path="lawyer-review" element={<LawyerReviewPage />} />
            <Route path="profile" element={<ClientProfilePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="Lawyer" />}>
          <Route path="/lawyer" element={<LawyerLayout />}>
            <Route path="dashboard" element={<LawyerDashboardPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="active-cases" element={<ActiveCasesPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="vault" element={<DocumentVaultPage />} />
            <Route path="vault/:caseId" element={<DocumentVaultPage />} />
            <Route path="payment/:caseId" element={<PaymentPage />} />
            <Route path="mediator/:caseId" element={<MediatorPage />} />
            <Route path="client-review" element={<ClientReviewPage />} />
            <Route path="profile" element={<LawyerProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}
