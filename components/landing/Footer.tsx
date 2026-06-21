export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-gray-200 bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold tracking-tight text-black">OpBot</span>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              The 24/7 AI growth operator for coaches and consultants. Replaces your VA and 12
              disconnected tools with one platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Product
            </p>
            <ul className="space-y-2">
              {['AI Workforce', 'Packages & Pricing', 'Book a Demo', 'For Agencies'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 transition-colors hover:text-black"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Company
            </p>
            <ul className="space-y-2">
              {['Terms', 'Privacy', 'DPA', 'Support', 'Zoom Docs'].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 transition-colors hover:text-black"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Get Started
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="/signup"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  Start DIY for $297/mo
                </a>
              </li>
              <li>
                <a
                  href="#book-demo"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  Book a Demo
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  Log In
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2026 OpBot. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Powered by Anthropic Claude
          </p>
          <p className="mt-2 text-[10px] text-gray-300 max-w-xl mx-auto leading-relaxed">
            OpBot is a software platform and does not guarantee any specific business results.
            The AI agents described are software tools that assist with business operations and
            require human oversight. All trademarks and registered trademarks are the property
            of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  )
}
