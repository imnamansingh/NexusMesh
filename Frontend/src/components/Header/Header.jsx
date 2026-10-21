import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userMenuItems = [
    { name: "Your Profile", href: "#" },
    { name: "History", href: "#" },
    { name: "Sign Out", href: "#" }
  ];

  return (
    <div className="p-8 w-full bg-white dark:bg-black">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        NexusMesh
      </h3>

      <nav className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">

              <div className="hidden md:flex items-center space-x-8">
                <svg
                    className="h-8 w-8 shrink-0"
                    viewBox="0 0 40 40"
                    fill="none"
                    aria-hidden="true"
                    >
                    <defs>
                        <linearGradient
                        id="nexusmesh-logo-gradient"
                        x1="5"
                        y1="5"
                        x2="35"
                        y2="35"
                        gradientUnits="userSpaceOnUse"
                        >
                        <stop stopColor="#2563EB" />
                        <stop offset="1" stopColor="#A855F7" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M20 4.5 33.4 12.25v15.5L20 35.5 6.6 27.75v-15.5L20 4.5Z"
                        stroke="url(#nexusmesh-logo-gradient)"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                    <path
                        d="m6.8 12.5 26.4 15M33.2 12.5l-26.4 15M20 5v30"
                        stroke="url(#nexusmesh-logo-gradient)"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                    />
                    <circle cx="20" cy="20" r="4" fill="url(#nexusmesh-logo-gradient)" />
                    <circle cx="6.75" cy="12.25" r="2.25" fill="#2563EB" />
                    <circle cx="33.25" cy="12.25" r="2.25" fill="#7C3AED" />
                    <circle cx="6.75" cy="27.75" r="2.25" fill="#4F46E5" />
                    <circle cx="33.25" cy="27.75" r="2.25" fill="#A855F7" />
                </svg>

                <a
                  href="#"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Home
                </a>

                <a
                  href="#"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Log in
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <img
                    src="/profile.jpg"
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 z-50">
                    <div className="p-2">
                      {userMenuItems.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-md transition-colors"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
