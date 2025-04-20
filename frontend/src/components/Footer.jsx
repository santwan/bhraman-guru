import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-white py-14 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-3">BhramanGuru</h2>
          <p className="text-sm text-gray-400">
            Your smart travel companion. Plan trips effortlessly with AI-generated itineraries, local gems, and verified stays.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/create-trip" className="hover:text-yellow-400 transition">Plan Trip</Link></li>
            <li><a href="#reviews" className="hover:text-yellow-400 transition">Reviews</a></li>
            <li><Link to="/blog" className="hover:text-yellow-400 transition">Blog</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@bhramanguru.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91-98765-43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Kolkata, India
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-blue-500 transition"><Facebook /></a>
            <a href="#" className="hover:text-pink-500 transition"><Instagram /></a>
            <a href="#" className="hover:text-sky-400 transition"><Twitter /></a>
            <a href="#" className="hover:text-red-500 transition"><Youtube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BhramanGuru. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
