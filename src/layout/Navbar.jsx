
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const Navbar = () => {
      const [activeButton, setActiveButton] = useState(null);

      return (
            <header className="w-full border-b border-gray-200 bg-white">

                  <nav
                        aria-label="Main navigation"
                        className="mx-auto flex w-[80%] items-center justify-between py-4"
                  >

                        {/* Left Section */}
                        <section className="flex items-center gap-5">

                              {/* Logo */}
                              <Link
                                    href="/"
                                    aria-label="Imagely home"
                                    className="font-poppins text-xl font-bold tracking-tight text-black"
                              >
                                    Image<span className="text-red-500">ly.</span>
                              </Link>

                              {/* Search */}
                              <form
                                    role="search"
                                    action="/search"
                                    method="GET"
                                    className="flex w-[460px] items-center gap-2.5 rounded-md bg-gray-100 px-4 py-2 transition focus-within:ring-gray-300"
                              >
                                    <Search size={18} className="text-gray-500" aria-hidden="true" />

                                    <input
                                          type="search"
                                          name="q"
                                          placeholder="Search for images, styles..."
                                          aria-label="Search images and styles"
                                          className="w-full rounded-md bg-transparent font-poppins text-sm text-gray-800 placeholder:text-gray-500 outline-none"
                                    />
                              </form>

                        </section>

                        {/* Right Section */}
                        <section
                              className="flex items-center gap-3"
                              onMouseLeave={() => setActiveButton(null)}
                        >

                              {/* Login */}
                              <Link
                                    href="/login"
                                    onMouseEnter={() => setActiveButton("login")}
                                    className={`flex h-9 w-[90px] items-center justify-center rounded-md font-poppins text-sm font-medium transition-colors duration-300 ${activeButton === "login"
                                          ? "bg-pink-500 text-white"
                                          : "bg-white text-black"
                                          }`}
                              >
                                    Login
                              </Link>

                              {/* Register */}
                              <Link
                                    href="/register"
                                    onMouseEnter={() => setActiveButton("register")}
                                    className={`flex h-9 w-[90px] items-center justify-center rounded-md font-poppins text-sm font-medium transition-colors duration-300 ${activeButton === "register"
                                          ? "bg-black text-white"
                                          : "bg-white text-black"
                                          }`}
                              >
                                    Register
                              </Link>

                        </section>

                  </nav>
            </header>
      );
};

export default Navbar;
