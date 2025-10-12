import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-wrap justify-center lg:justify-between overflow-hidden gap-10 md:gap-20 py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-[14px] text-gray-700 bg-gradient-to-r from-white via-green-200/60 to-white border-t border-green-100">
      {/* Left Section */}
      <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[140px]">
        {/* Brand Logo */}
        <a href="/" className="flex items-center space-x-2 group">
          <svg
            width="32"
            height="34"
            viewBox="0 0 31 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            <path
              d="m8.75 5.3 6.75 3.884 6.75-3.885M8.75 28.58v-7.755L2 16.939m27 0-6.75 3.885v7.754M2.405 9.408 15.5 16.954l13.095-7.546M15.5 32V16.939M29 22.915V10.962a2.98 2.98 0 0 0-1.5-2.585L17 2.4a3.01 3.01 0 0 0-3 0L3.5 8.377A3 3 0 0 0 2 10.962v11.953A2.98 2.98 0 0 0 3.5 25.5L14 31.477a3.01 3.01 0 0 0 3 0L27.5 25.5a3 3 0 0 0 1.5-2.585"
              stroke="url(#a)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="a"
                x1="15.5"
                y1="2"
                x2="15.5"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#16A34A" />
                <stop offset="1" stopColor="#065F46" />
              </linearGradient>
            </defs>
          </svg>
          <img src="/logo.svg" className="h-11 w-auto" alt="" />
        </a>

        {/* Product Links */}
        <div>
          <p className="text-green-900 font-semibold">Product</p>
          <ul className="mt-3 space-y-2">
            <li><a href="/" className="hover:text-green-600 transition">Home</a></li>
            <li><a href="/" className="hover:text-green-600 transition">Support</a></li>
            <li><a href="/" className="hover:text-green-600 transition">Pricing</a></li>
            <li><a href="/" className="hover:text-green-600 transition">Affiliate</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <p className="text-green-900 font-semibold">Resources</p>
          <ul className="mt-3 space-y-2">
            <li><a href="/" className="hover:text-green-600 transition">Company</a></li>
            <li><a href="/" className="hover:text-green-600 transition">Blog</a></li>
            <li><a href="/" className="hover:text-green-600 transition">Community</a></li>
            <li>
              <a href="/" className="hover:text-green-600 transition flex items-center gap-2">
                Careers
                <span className="text-xs text-white bg-green-600 rounded-md px-2 py-0.5">
                  We’re hiring!
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="text-green-900 font-semibold">Legal</p>
          <ul className="mt-3 space-y-2">
            <li><a href="/" className="hover:text-green-600 transition">Privacy</a></li>
            <li><a href="/" className="hover:text-green-600 transition">Terms</a></li>
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col max-md:items-center max-md:text-center gap-4 items-end">
        <p className="max-w-60 text-gray-600 leading-relaxed">
          Making every customer feel valued—no matter the size of your audience.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-4 mt-2">
          {[
            { href: "https://linkedin.com", icon: "linkedin" },
            { href: "https://x.com", icon: "twitter" },
            { href: "https://youtube.com", icon: "youtube" },
          ].map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-green-700 hover:text-green-900 transition transform hover:scale-110"
            >
              <i className={`fa-brands fa-${link.icon} text-lg`}></i>
            </a>
          ))}
        </div>

        <p className="mt-3 text-gray-500 text-sm">
          © 2025 <a href="/" className="text-green-700 font-medium hover:text-green-900">GreenBuild</a>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
