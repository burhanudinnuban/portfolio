/*  ./components/Navbar.jsx     */
import { useState } from "react";

export const NavBar = () => {
  const [active, setActive] = useState(false);
  const [barActive, setbarActive] = useState({
    dashboard: false,
    projects: false,
    aboutme: false,
  });

  const handleClick = () => {
    setActive(!active);
  };

  // function barClick(params) {
  //   setbarActive({
  //     ...barActive,
  //     dashboard: params === "dashboard" ? true : false,
  //     projects: params === "projects" ? true : false,
  //     aboutme: params === "aboutme" ? true : false,
  //   });
  // }

  function maintanance() {
    alert("This function is maintanance.");
  }

  return (
    <nav className="bg-gray-700 relative top-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={handleClick}
            >
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <button className="flex-shrink-0 flex items-center">
              <img src="./portfolio.png" />
              <a
                href="/"
                className="text-white px-3 rounded-md text-2xl font-bold"
                aria-current="page"
              >
                Portfolio
              </a>
            </button>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <a
                  href="/"
                  className="text-white hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  aria-current="page"
                >
                  Home
                </a>

                <a
                  href="/projects"
                  className="text-white hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Projects
                </a>

                <a
                  href="/contact"
                  className="text-white hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact Me
                </a>

                <a
                  href="/about"
                  className="text-white hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  About Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {active && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              className="text-white hover:bg-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              aria-current="page"
            >
              <a href="/">Home</a>
            </button>

            <button className="text-white hover:bg-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <a href="/projects">Projects</a>
            </button>

            <button className="text-white hover:bg-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <a href="/contact">Contact</a>
            </button>

            <button className="text-white hover:bg-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <a href="/about">About Me</a>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
