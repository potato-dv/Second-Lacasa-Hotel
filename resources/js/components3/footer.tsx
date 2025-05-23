import { Link } from '@inertiajs/react';
import 'remixicon/fonts/remixicon.css';

const Footer = () => {
  return (
    <footer>
      {/* Contact Bar */}
      <div className="border-t bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="mb-4 flex flex-col items-center space-y-3 md:mb-0 md:flex-row md:space-y-0 md:space-x-6">
            <div className="flex items-center">
              <i className="ri-map-pin-line mr-2 text-[#DAA520]"></i>
              <span className="text-gray-700">Tandang Sora Ave, Kulyat, Philippines</span>
            </div>
            <div className="flex items-center">
              <i className="ri-phone-line mr-2 text-[#DAA520]"></i>
              <span className="text-gray-700">(221) 33.822.55.32</span>
            </div>
            <div className="flex items-center">
              <i className="ri-mail-line mr-2 text-[#DAA520]"></i>
              <span className="text-gray-700">lacasahotel@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#DAA520] py-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between px-4 text-sm text-white sm:px-6 md:flex-row lg:px-8">
          <div className="mb-2 md:mb-0">© {new Date().getFullYear()} LaCasa Hotel. All rights reserved.</div>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-white transition-colors duration-300 hover:text-gray-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-white transition-colors duration-300 hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-white transition-colors duration-300 hover:text-gray-300">
              Cookies 
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
