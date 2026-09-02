import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-surface-ivory shadow-sm w-full">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-title-md font-headline-lg text-primary tracking-tight">
            TeamBees
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="#" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">
              Services
            </Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">
              Talent
            </Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">
              Success Stories
            </Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">
              About Us
            </Link>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="font-body-md text-on-surface-variant">Call Us: +1 (800) BEES-CORP</span>
          <Link
            href="#"
            className="bg-gold-muted text-on-primary font-title-md text-title-md px-6 py-2 rounded-full hover:bg-secondary transition-colors duration-200 scale-95 active:scale-90"
          >
            Get In Touch
          </Link>
        </div>
        <button className="md:hidden text-primary p-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 0' }}>
            menu
          </span>
        </button>
      </div>
    </nav>
  );
}
