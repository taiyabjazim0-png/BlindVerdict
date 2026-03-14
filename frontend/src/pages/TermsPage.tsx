import { Link } from "react-router-dom";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <Link to="/" className="text-xl font-semibold tracking-tight text-primary">BlindVerdict</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Terms and Conditions</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">1. Acceptance of Terms</h2>
            <p>By accessing and using the BlindVerdict platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">2. Platform Description</h2>
            <p>BlindVerdict is an AI-powered legal accessibility and case management platform that connects clients with verified lawyers. The platform provides case analysis, document management, and communication tools to facilitate legal proceedings.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">3. User Registration</h2>
            <p>Users must provide accurate, complete, and current information during registration. All lawyer registrations are subject to manual verification, which may take up to seven working days. Providing false or misleading information may result in account termination.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">4. Privacy and Data Protection</h2>
            <p>All uploaded documents are encrypted using SHA-256 hashing. Access to case documents is restricted to the assigned client and lawyer only. BlindVerdict does not share personal data with third parties without explicit consent. We comply with the Information Technology Act, 2000 and relevant data protection laws of India.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">5. AI-Generated Content</h2>
            <p>The AI-powered analysis, summaries, and recommendations are provided for informational purposes only. They do not constitute legal advice. Users should always rely on qualified legal professionals for binding legal opinions.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">6. Case Management</h2>
            <p>Once a case ticket is raised and accepted by a lawyer, a mediator is assigned for initial coordination. All communications are logged for accountability. Either party may request case closure through the appropriate channels.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">7. Payment Terms</h2>
            <p>All fees are quoted in Indian Rupees (₹). Payment terms are agreed upon between the client and the lawyer. BlindVerdict acts as a facilitator and does not guarantee specific outcomes.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">8. Limitation of Liability</h2>
            <p>BlindVerdict shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this platform. The platform is provided "as is" without warranties of any kind.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">9. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-slate-900">10. Contact</h2>
            <p>For questions regarding these terms, contact us at <span className="font-medium text-primary">legal@blindverdict.in</span></p>
          </section>
        </div>

        <div className="mt-10">
          <Link to="/register" className="text-sm font-medium text-primary hover:underline">Back to registration</Link>
        </div>
      </main>
    </div>
  );
}
