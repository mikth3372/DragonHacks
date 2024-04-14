import React from "react";

function Footer() {
  return (
    <footer className="bg-neutral-900 p-6">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
            EmpaView
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
                className="hover:underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
        <span className="block text-sm text-white sm:text-center">
          © 2024 EmpaView
        </span>
      </div>
    </footer>
  );
}

export default Footer;
