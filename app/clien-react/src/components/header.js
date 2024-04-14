import React from "react";

function Header() {
  return (
    <header className="bg-blue-300 p-2">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="self-center text-xl font-bold whitespace-nowrap text-black">
            Interview with Empathy
          </span>
          <ul className="flex flex-wrap items-center mb-6 text-md font-medium text-white sm:mb-0">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                GitHub
              </a>
            </li>
            <li>
              <a
                href="mailto:yousungkim98@gmail.com"
                className="hover:underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
