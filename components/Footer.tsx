import React from 'react';
import { DownloadIcon, TwitterIcon, InstagramIcon, FacebookIcon } from '../constants.tsx';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="footer bg-slate-900 text-slate-400 section pt-20 pb-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 text-center lg:text-left">
          <div className="footer-about lg:col-span-1">
            <a href="#hero" className="logo flex items-center justify-center lg:justify-start space-x-3 mb-4">
              <DownloadIcon className="w-8 h-8 text-cyan-400" />
              <span className="sitename text-3xl text-white">YT Downloader</span>
            </a>
            <p className="mt-2 text-base max-w-sm mx-auto lg:mx-0">
                A fast and free tool to download YouTube videos in various formats. For personal use only.
            </p>
          </div>

          <div className="footer-links">
            <h4 className="font-bold text-xl mb-4 text-slate-200" style={{fontFamily: 'var(--heading-font)'}}>Quick Links</h4>
            <ul>
              <li className="py-1.5"><a href="#hero" className="hover:text-cyan-400 transition-colors text-base">Home</a></li>
              <li className="py-1.5"><a href="#how-it-works" className="hover:text-cyan-400 transition-colors text-base">How It Works</a></li>
              <li className="py-1.5"><a href="#faq" className="hover:text-cyan-400 transition-colors text-base">FAQ</a></li>
              <li className="py-1.5"><a href="#faq" className="hover:text-cyan-400 transition-colors text-base">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
             <h4 className="font-bold text-xl mb-4 text-slate-200" style={{fontFamily: 'var(--heading-font)'}}>Stay Updated</h4>
            <p className="text-base">Subscribe to our newsletter for updates and new features.</p>
            <form action="" className="mt-4 flex max-w-sm mx-auto opacity-60">
              <input type="email" name="email" className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-500 text-base" placeholder="Your Email" disabled />
              <input type="submit" value="Subscribe" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-4 rounded-r-lg cursor-not-allowed" disabled/>
            </form>
            <p className="text-xs text-slate-500 mt-2">Newsletter coming soon!</p>
          </div>
        </div>

        <div className="copyright-wrap pt-8 mt-12 border-t border-slate-800">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center md:text-left text-base">
                    <p>&copy; {new Date().getFullYear()} YT Downloader. All Rights Reserved.</p>
                </div>
                 <div className="social-links flex justify-center md:justify-end space-x-4">
                    <a href="#" className="text-slate-500 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110">
                        <TwitterIcon className="w-7 h-7" />
                    </a>
                    <a href="#" className="text-slate-500 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110">
                        <FacebookIcon className="w-7 h-7" />
                    </a>
                    <a href="#" className="text-slate-500 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110">
                        <InstagramIcon className="w-7 h-7" />
                    </a>
                 </div>
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;