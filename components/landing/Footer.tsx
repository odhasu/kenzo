import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <Link
              href="/"
              className="font-[family-name:var(--font-lora)] text-lg font-bold text-gray-900 tracking-tight"
            >
              Kenzo
            </Link>
            <p className="mt-2 text-xs text-gray-400">
              AI-powered funnel builder for high-ticket coaches.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Product</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Templates</Link>
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resources</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Docs</Link>
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Blog</Link>
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Discord</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms</Link>
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="#" className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Kenzo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
