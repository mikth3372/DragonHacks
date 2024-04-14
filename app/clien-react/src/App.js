import "./App.css";
import Footer from "./components/footer";
import { useState } from "react";
import logo from "./serenity.png";
import Emotions from "./components/analyze-emotion";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      {!loggedIn ? (
        <div className="App bg-main-color">
          <main>
            <div className="flex flex-row place-self-center justify-center pt-6">
              <img src={logo} alt="Logo" className="h-60 w-auto ml-5" />
            </div>
            <div class="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8 mb-12">
              <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="#" method="POST">
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-left text-gray-900"
                    >
                      Username
                    </label>
                    <div class="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between">
                      <label
                        for="password"
                        class="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                      <div class="text-sm">
                        <a
                          href="#"
                          class="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div class="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => {
                        setLoggedIn(true);
                      }}
                    >
                      Sign in
                    </button>
                  </div>
                </form>

                <p class="mt-10 text-center text-sm text-gray-500">
                  Not a member?
                  <a
                    href="#"
                    class="ml-4 font-semibold leading-6 text-slate-900 hover:text-indigo-500"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      ) : (
        <Emotions />
      )}
    </div>
  );
}

export default App;
