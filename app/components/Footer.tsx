import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-3xl font-display font-bold tracking-widest text-white mb-6 block"
            >
              LUEURS
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
              Crafting scented memories for the modern connoisseur. Experience the art of
              perfumery redefined.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 border border-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <i className="fab fa-instagram"></i>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 border border-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <i className="fab fa-tiktok"></i>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 border border-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <i className="fab fa-pinterest-p"></i>
              </Link>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-500">
              Shop
            </h4>
            <ul className="space-y-4 text-sm font-light text-gray-300">
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  Travel Sets
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  Discovery Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-500">
              Service
            </h4>
            <ul className="space-y-4 text-sm font-light text-gray-300">
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-500">
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm font-light mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-900 border border-gray-800 text-white px-4 py-3 focus:outline-none focus:border-amber-700 font-light text-sm w-full"
              />
              <button className="bg-white text-black uppercase tracking-widest text-xs font-bold py-3 px-4 hover:bg-amber-50 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-medium">
          <div className="mb-4 md:mb-0">
            <span>&copy; 2024 Lueurs Parfums. All Rights Reserved.</span>
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
