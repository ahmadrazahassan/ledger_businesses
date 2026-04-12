import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Ledger Businesses collects, uses, and protects your personal information.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pt-16 md:pt-24 pb-16">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-3 py-1 bg-accent/15 text-accent-content text-xs font-bold rounded-full mb-6">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-ink leading-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-ink/60">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 p-6 rounded-2xl bg-accent/[0.06] border border-accent/10">
            <p className="text-ink/70 leading-relaxed">
              At Ledger Businesses, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully to understand our practices regarding your personal data.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">1.1 Information You Provide</h3>
                  <p>
                    We collect information that you voluntarily provide to us when you subscribe to our newsletter, create an account, or contact us regarding UK accounting software reviews or compliance guides. This may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Email address</li>
                    <li>Name</li>
                    <li>Company name and job title (optional, e.g., Director, Bookkeeper)</li>
                    <li>Communication preferences</li>
                    <li>Any other information you choose to provide</li>
                  </ul>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">1.2 Automatically Collected Information</h3>
                  <p>
                    When you visit our website, we automatically collect certain information about your device and browsing behavior, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IP address and general location data</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Referring website</li>
                    <li>Pages viewed and time spent on pages</li>
                    <li>Device identifiers and characteristics</li>
                  </ul>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">1.3 Cookies and Tracking Technologies</h3>
                  <p>
                    We use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze site traffic, and understand user behavior. You can control cookie preferences through your browser settings, though disabling cookies may limit certain website functionality.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>We use the information we collect for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To deliver our newsletter and editorial content</li>
                    <li>To personalize your experience and provide relevant content recommendations</li>
                    <li>To analyze website usage and improve our services</li>
                    <li>To communicate with you about updates, announcements, and promotional offers</li>
                    <li>To respond to your inquiries and provide customer support</li>
                    <li>To detect, prevent, and address technical issues or fraudulent activity</li>
                    <li>To comply with legal obligations and enforce our terms of service</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">3. Information Sharing and Disclosure</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">3.1 Service Providers</h3>
                  <p>
                    We work with trusted third-party service providers who assist us in operating our website, conducting our business, and serving our users. These providers include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Email service providers for newsletter delivery</li>
                    <li>Analytics platforms for website performance monitoring</li>
                    <li>Cloud hosting and infrastructure providers</li>
                    <li>Payment processors for subscription services</li>
                  </ul>
                  <p>
                    These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">3.2 Legal Requirements</h3>
                  <p>
                    We may disclose your information if required to do so by law or in response to valid requests by public authorities, such as a court order or subpoena.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">3.3 Business Transfers</h3>
                  <p>
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change in ownership or control of your personal information.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">4. Data Security</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication requirements</li>
                    <li>Secure data storage and backup procedures</li>
                  </ul>
                  <p>
                    However, no method of transmission over the internet or electronic storage is completely secure. While we strive to protect your personal information, we cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">5. Your Privacy Rights</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access: Request a copy of the personal information we hold about you</li>
                    <li>Correction: Request correction of inaccurate or incomplete information</li>
                    <li>Deletion: Request deletion of your personal information</li>
                    <li>Objection: Object to our processing of your personal information</li>
                    <li>Restriction: Request restriction of processing your personal information</li>
                    <li>Portability: Request transfer of your information to another service</li>
                    <li>Withdrawal of Consent: Withdraw consent for processing where we rely on consent</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us at fiza@ledgerthebusinesses.com. We will respond to your request within 30 days.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">6. Newsletter and Marketing Communications</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    When you subscribe to our newsletter, we will send you editorial content, analysis, and occasional promotional messages. You can unsubscribe at any time by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Clicking the unsubscribe link in any email we send</li>
                    <li>Contacting us directly at fiza@ledgerthebusinesses.com</li>
                    <li>Updating your preferences in your account settings</li>
                  </ul>
                  <p>
                    Please note that even if you unsubscribe from marketing communications, we may still send you transactional or administrative emails related to your account or our services.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">7. Third-Party Links and Services</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Our website may contain links to third-party websites, services, or applications. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">8. Children's Privacy</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">9. International Data Transfers</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your jurisdiction. By using our services, you consent to the transfer of your information to these countries.
                  </p>
                  <p>
                    We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable data protection laws.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">10. Data Retention</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">11. Changes to This Privacy Policy</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date at the top of this page.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                  </p>
                </div>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">12. UK Data Protection</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Ledger Businesses is committed to complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. If you believe we have not handled your personal data in accordance with applicable data protection law, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO).
                  </p>
                  <div className="p-6 rounded-2xl bg-white border border-ink/[0.06] mt-4">
                    <p className="font-semibold text-ink mb-2">Information Commissioner&apos;s Office</p>
                    <p>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-accent-content hover:underline">ico.org.uk</a></p>
                    <p>Helpline: 0303 123 1113</p>
                  </div>
                </div>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">13. Contact Us</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="p-6 rounded-2xl bg-white border border-ink/[0.06] mt-4">
                    <p className="font-semibold text-ink mb-2">Ledger Businesses</p>
                    <p>Email: fiza@ledgerthebusinesses.com</p>
                    <p>Contact Form: <a href="/contact" className="text-accent-content hover:underline">ledgerbusinesses.com/contact</a></p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
