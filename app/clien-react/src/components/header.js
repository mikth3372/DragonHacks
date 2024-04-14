import React from "react";
import logo from "../serenity.png";

function Header() {
  return (
    <header className="bg-main-color">
      <div className="w-full max-w-screen-xl mx-auto p-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <img src={logo} alt="Logo" className="h-40 w-auto ml-5" />
          </div>
          <ul className="flex flex-wrap mr-12 items-center mb-6 text-md font-medium text-black sm:mb-0">
            <li>
              <a href="#" className="hover:font-bold me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:font-bold  me-4 md:me-6">
                GitHub
              </a>
            </li>
            <li>
              <a
                href="mailto:yousungkim98@gmail.com"
                className="hover:font-bold "
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
