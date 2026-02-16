import { Link } from 'react-router-dom';
import { Mail, Phone, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-[#232f3e] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kanaho Logo & Copyright */}
          <div className="flex flex-col items-start">
            <img
              src="/kanahos.jpg"
              alt="Kanaho Logo"
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Kanaho. All rights reserved.
            </p>
          </div>

           {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://t.me/kana_ho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Send className="h-4 w-4" />
                  Telegram: @kana_ho
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@kanaho.josephteka.com?subject=Kanaho%20customer%20support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  hello@kanaho.josephteka.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+251721103660"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  +251 721 103 660
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@jocode216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                    Youtube: @jocode216
                </a>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.tiktok.com/@kanahooo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  TikTok: @kanahooo
                </a>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/createstore"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Create Store
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
