import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-navy-deep text-white pt-24 pb-12 rounded-t-[80px] px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1 */}
          <div>
            <h4 className="text-gold-muted font-bold text-xl mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Home</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">About Us</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Services</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Pricing</Link></li>
            </ul>
          </div>
          {/* Col 2 */}
          <div>
            <h4 className="text-gold-muted font-bold text-xl mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Our Team</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Case Studies</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Blog</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Contact</Link></li>
            </ul>
          </div>
          {/* Col 3 */}
          <div>
            <h4 className="text-gold-muted font-bold text-xl mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Privacy Policy</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Terms of Service</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Support</Link></li>
              <li><Link className="text-surface-variant hover:text-white transition-colors" href="#">Careers</Link></li>
            </ul>
          </div>
          {/* Col 4 */}
          <div>
            <h4 className="text-gold-muted font-bold text-xl mb-6">Address</h4>
            <ul className="space-y-4 text-surface-variant">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-muted mt-1">location_on</span>
                <span>123 Enterprise Blvd,<br />Tech District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gold-muted">mail</span>
                <span>contact@teambees.corp</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gold-muted">phone</span>
                <span>+1 (800) BEES-CORP</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-headline-lg font-headline-lg text-secondary-fixed tracking-tight">TeamBees</div>
          <div className="font-body-md text-surface-variant text-sm">
            © 2026 Sachin. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
