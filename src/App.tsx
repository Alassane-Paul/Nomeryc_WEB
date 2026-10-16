import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

// ===== LAZY IMPORTS — Public Pages =====
const HomePage = lazy(() => import('./pages/public/HomePage').then(m => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage').then(m => ({ default: m.ServicesPage })));
const PortfolioPage = lazy(() => import('./pages/public/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const BlogPage = lazy(() => import('./pages/public/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('./pages/public/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })));
const PricingPage = lazy(() => import('./pages/public/PricingPage').then(m => ({ default: m.PricingPage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const LegalNoticePage = lazy(() => import('./pages/public/LegalNoticePage').then(m => ({ default: m.LegalNoticePage })));
const PrivacyPolicyPage = lazy(() => import('./pages/public/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));

// ===== Auth =====
const AuthPage = lazy(() => import('./pages/auth/AuthPage').then(m => ({ default: m.AuthPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));

// ===== Client Pages =====
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const ClientProjects = lazy(() => import('./pages/client/ClientProjects').then(m => ({ default: m.ClientProjects })));
const ClientQuotes = lazy(() => import('./pages/client/ClientQuotes').then(m => ({ default: m.ClientQuotes })));
const ClientInvoices = lazy(() => import('./pages/client/ClientInvoices').then(m => ({ default: m.ClientInvoices })));
const ClientMessages = lazy(() => import('./pages/client/ClientMessages').then(m => ({ default: m.ClientMessages })));
const ClientSettings = lazy(() => import('./pages/client/ClientSettings').then(m => ({ default: m.ClientSettings })));
const ClientNotifications = lazy(() => import('./pages/client/ClientNotifications').then(m => ({ default: m.ClientNotifications })));
const ClientDocuments = lazy(() => import('./pages/client/ClientDocuments').then(m => ({ default: m.ClientDocuments })));

// ===== Admin Pages =====
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminClients = lazy(() => import('./pages/admin/AdminClients').then(m => ({ default: m.AdminClients })));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts').then(m => ({ default: m.AdminContacts })));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects').then(m => ({ default: m.AdminProjects })));
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes').then(m => ({ default: m.AdminQuotes })));
const AdminInvoices = lazy(() => import('./pages/admin/AdminInvoices').then(m => ({ default: m.AdminInvoices })));
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio').then(m => ({ default: m.AdminPortfolio })));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam').then(m => ({ default: m.AdminTeam })));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials').then(m => ({ default: m.AdminTestimonials })));
const AdminFaq = lazy(() => import('./pages/admin/AdminFaq').then(m => ({ default: m.AdminFaq })));
const AdminPricing = lazy(() => import('./pages/admin/AdminPricing').then(m => ({ default: m.AdminPricing })));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog').then(m => ({ default: m.AdminBlog })));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminTasks = lazy(() => import('./pages/admin/AdminTasks').then(m => ({ default: m.AdminTasks })));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages').then(m => ({ default: m.AdminMessages })));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-brand-dark">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-brand-purple/30 border-t-brand-purple animate-spin" />
      <p className="text-gray-400 text-sm">Chargement...</p>
    </div>
  </div>
);

// Public Layout
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}

// Dashboard Layout
function DashboardLayout({ role, children }: { role: 'admin' | 'client'; children: React.ReactNode }) {
  return (
    <div className="dashboard-layout flex h-screen overflow-hidden bg-brand-dark">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogDetailPage /></PublicLayout>} />
          <Route path="/tarifs" element={<PublicLayout><PricingPage /></PublicLayout>} />
          <Route path="/a-propos" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ===== CLIENT ROUTES ===== */}
          <Route path="/client" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <DashboardLayout role="client"><ClientDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client/projets" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <DashboardLayout role="client"><ClientProjects /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client/devis" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <DashboardLayout role="client"><ClientQuotes /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client/factures" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <DashboardLayout role="client"><ClientInvoices /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client/messages" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <DashboardLayout role="client"><ClientMessages /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client/notifications" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <DashboardLayout role="client"><ClientNotifications /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client/documents" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <DashboardLayout role="client"><ClientDocuments /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client/parametres" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <DashboardLayout role="client"><ClientSettings /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ===== ADMIN ROUTES ===== */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminClients /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/contacts" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminContacts /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/projets" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminProjects /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/devis" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminQuotes /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/factures" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminInvoices /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/portfolio" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminPortfolio /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/equipe" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminTeam /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/temoignages" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminTestimonials /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/faq" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminFaq /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/tarifs" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminPricing /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminBlog /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminAnalytics /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/taches" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminTasks /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout role="admin"><AdminMessages /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ===== FALLBACKS ===== */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/mentions-legales" element={<PublicLayout><LegalNoticePage /></PublicLayout>} />
          <Route path="/confidentialite" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
