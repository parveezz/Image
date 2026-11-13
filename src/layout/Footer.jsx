
import Link from "next/link";

const Footer = () => {
      const year = 2026;

      const legalLinks = [
            { name: "Terms of Use", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Cookie Policy", href: "/cookies" },
            { name: "DMCA / Copyright", href: "/copyright" },
            { name: "Complaints Policy", href: "/complaints" },
            { name: "Acceptable Use Policy", href: "/acceptable-use" },
            { name: "Content Removal", href: "/content-removal" },
            { name: "Appeals Policy", href: "/appeals" },
      ];

      const supportLinks = [
            { name: "Help Center", href: "/help" },
            { name: "Contact Us", href: "/contact" },
            { name: "FAQs", href: "/faqs" },
            { name: "Report an Issue", href: "/report-issue" },
      ];

      return (
            <footer className="w-full bg-[#eeeeee] font-poppins text-gray-700">

                  <section className="mx-auto w-[80%] py-6">

                        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">

                              {/* Legal Section */}
                              <section aria-labelledby="footer-legal">
                                    <h2 id="footer-legal" className="mb-3 text-sm font-semibold">
                                          Legal
                                    </h2>

                                    <nav aria-label="Legal navigation">
                                          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                                                {legalLinks.map((link) => (
                                                      <li key={link.href}>
                                                            <Link
                                                                  href={link.href}
                                                                  className="text-sm text-gray-600 transition hover:text-black"
                                                            >
                                                                  {link.name}
                                                            </Link>
                                                      </li>
                                                ))}
                                          </ul>
                                    </nav>
                              </section>

                              {/* Support Section */}
                              <section aria-labelledby="footer-support">
                                    <h2 id="footer-support" className="mb-3 text-sm font-semibold">
                                          Support
                                    </h2>

                                    <nav aria-label="Support navigation">
                                          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                                                {supportLinks.map((link) => (
                                                      <li key={link.href}>
                                                            <Link
                                                                  href={link.href}
                                                                  className="text-sm text-gray-600 transition hover:text-black"
                                                            >
                                                                  {link.name}
                                                            </Link>
                                                      </li>
                                                ))}
                                          </ul>
                                    </nav>
                              </section>

                        </section>

                        {/* Bottom Footer */}
                        <section className="mt-6 border-t border-gray-300 pt-4">
                              <div className="flex flex-col items-center justify-between gap-2 text-xs text-gray-500 md:flex-row">

                                    <p>
                                          © {year} Imagely.com. All rights reserved.
                                    </p>

                                    <p>
                                          Made for visual inspiration.
                                    </p>

                              </div>
                        </section>

                  </section>
            </footer>
      );
};

export default Footer;
