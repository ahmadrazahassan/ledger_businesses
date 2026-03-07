import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Ledger Businesses website and services.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper narrow className="pt-16 md:pt-24 pb-16">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block px-3 py-1 bg-accent/15 text-accent text-xs font-bold rounded-full mb-6">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-ink leading-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-ink/60">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 p-6 rounded-2xl bg-accent/[0.06] border border-accent/10">
            <p className="text-ink/70 leading-relaxed">
              These Terms of Service govern your access to and use of Ledger Businesses website, content, and services. By accessing or using our services, you agree to be bound by these terms. Please read them carefully.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    By accessing, browsing, or using Ledger Businesses (the "Website"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not access or use our services.
                  </p>
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the Website. Your continued use of the Website after changes are posted constitutes your acceptance of the modified terms.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">2. Use of Services</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">2.1 Eligibility</h3>
                  <p>
                    You must be at least 18 years old to use our services. By using the Website, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these terms.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">2.2 Account Registration</h3>
                  <p>
                    Some features of our services may require you to create an account. When creating an account, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Accept responsibility for all activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">2.3 Acceptable Use</h3>
                  <p>
                    You agree to use our services only for lawful purposes and in accordance with these terms. You agree not to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon the rights of others, including intellectual property rights</li>
                    <li>Transmit any harmful, offensive, or inappropriate content</li>
                    <li>Attempt to gain unauthorized access to our systems or networks</li>
                    <li>Interfere with or disrupt the operation of our services</li>
                    <li>Use automated systems to access the Website without permission</li>
                    <li>Collect or harvest information about other users</li>
                    <li>Impersonate any person or entity</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">3. Intellectual Property Rights</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">3.1 Our Content</h3>
                  <p>
                    All content on the Website, including but not limited to text, graphics, logos, images, audio clips, video, data compilations, and software, is the property of Ledger Businesses or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    The compilation of all content on the Website is the exclusive property of Ledger Businesses and is protected by copyright law.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">3.2 Limited License</h3>
                  <p>
                    We grant you a limited, non-exclusive, non-transferable license to access and use the Website for personal, non-commercial purposes. This license does not include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Any resale or commercial use of the Website or its content</li>
                    <li>Any collection and use of product listings, descriptions, or prices</li>
                    <li>Any derivative use of the Website or its content</li>
                    <li>Any downloading or copying of account information for the benefit of another party</li>
                    <li>Any use of data mining, robots, or similar data gathering and extraction tools</li>
                  </ul>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">3.3 Permitted Use</h3>
                  <p>
                    You may share our articles on social media or link to them from your website, provided you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Do not modify the content</li>
                    <li>Provide proper attribution to Ledger Businesses</li>
                    <li>Link back to the original article on our Website</li>
                    <li>Do not imply endorsement by Ledger Businesses</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">4. User-Generated Content</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    If you submit comments, feedback, or other content to the Website, you grant us a worldwide, non-exclusive, royalty-free, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in any media.
                  </p>
                  <p>
                    You represent and warrant that you own or control all rights to the content you submit and that such content does not violate these terms or any applicable laws.
                  </p>
                  <p>
                    We reserve the right to remove any user-generated content that violates these terms or that we deem inappropriate for any reason.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">5. Third-Party Links and Services</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    The Website may contain links to third-party websites, services, or resources. These links are provided for your convenience only. We do not control, endorse, or assume responsibility for any third-party sites or services.
                  </p>
                  <p>
                    Your use of third-party websites and services is at your own risk and subject to the terms and conditions of those third parties. We encourage you to review the terms and privacy policies of any third-party sites you visit.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">6. Disclaimers and Limitations of Liability</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">6.1 No Warranties</h3>
                  <p>
                    The Website and all content, products, and services are provided "as is" and "as available" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Implied warranties of merchantability and fitness for a particular purpose</li>
                    <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
                    <li>Warranties that the Website will be uninterrupted, secure, or error-free</li>
                    <li>Warranties regarding the results obtained from using the Website</li>
                  </ul>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">6.2 Limitation of Liability</h3>
                  <p>
                    To the fullest extent permitted by law, Ledger Businesses shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your access to or use of or inability to access or use the Website</li>
                    <li>Any conduct or content of any third party on the Website</li>
                    <li>Any content obtained from the Website</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                  </ul>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">6.3 Professional Advice Disclaimer</h3>
                  <p>
                    The content on our Website is for informational purposes only and should not be construed as professional advice. We are not financial advisors, legal advisors, or business consultants. You should consult with appropriate professionals before making any business, financial, or legal decisions.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">7. Indemnification</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    You agree to indemnify, defend, and hold harmless Ledger Businesses, its affiliates, officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your use of the Website</li>
                    <li>Your violation of these Terms of Service</li>
                    <li>Your violation of any rights of another party</li>
                    <li>Any content you submit or transmit through the Website</li>
                  </ul>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">8. Termination</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    We reserve the right to suspend or terminate your access to the Website at any time, with or without cause, with or without notice, and without liability. Upon termination, your right to use the Website will immediately cease.
                  </p>
                  <p>
                    You may terminate your account at any time by contacting us or using the account deletion feature if available. All provisions of these terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">9. Governing Law and Dispute Resolution</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">9.1 Governing Law</h3>
                  <p>
                    These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">9.2 Dispute Resolution</h3>
                  <p>
                    Any dispute arising out of or relating to these terms or the Website shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in a mutually agreed location, and judgment on the award may be entered in any court having jurisdiction.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">9.3 Class Action Waiver</h3>
                  <p>
                    You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">10. General Provisions</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">10.1 Entire Agreement</h3>
                  <p>
                    These Terms of Service, together with our Privacy Policy and any other legal notices published on the Website, constitute the entire agreement between you and Ledger Businesses regarding your use of the Website.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">10.2 Severability</h3>
                  <p>
                    If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">10.3 Waiver</h3>
                  <p>
                    Our failure to enforce any right or provision of these terms shall not constitute a waiver of such right or provision.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">10.4 Assignment</h3>
                  <p>
                    You may not assign or transfer these terms or your rights hereunder without our prior written consent. We may assign these terms without restriction.
                  </p>

                  <h3 className="text-xl font-heading font-bold text-ink mt-6 mb-3">10.5 Force Majeure</h3>
                  <p>
                    We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink mb-4">11. Contact Information</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                  <div className="p-6 rounded-2xl bg-white border border-ink/[0.06] mt-4">
                    <p className="font-semibold text-ink mb-2">Ledger Businesses</p>
                    <p>Email: legal@ledgerbusinesses.com</p>
                    <p>Contact Form: <a href="/contact" className="text-accent hover:underline">ledgerbusinesses.com/contact</a></p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="mt-16 p-8 rounded-3xl bg-accent/[0.06] border border-accent/10">
            <h3 className="text-xl font-heading font-bold text-ink mb-3">Acknowledgment</h3>
            <p className="text-ink/70 leading-relaxed">
              By using Ledger Businesses, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by them. If you do not agree to these terms, please do not use our Website or services.
            </p>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
