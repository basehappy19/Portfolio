import { auth } from "@/auth";
import { headers } from "next/headers";
import { SignOutButton } from "./SignOutButton";
import { SignInButton } from "./SignInButton";

export default async function PortfolioFooter() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    
    return (
        <footer className="relative bg-gray-800 text-white">
            {/* Decorative top border */}
            <div className="h-1 bg-linear-to-r from-transparent via-red-600 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* About Section */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4 bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                            My Portfolio
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            สร้างสรรค์ผลงานด้านเทคโนโลยีและการออกแบบที่มีคุณภาพ
                            พร้อมนำเสนอประสบการณ์ที่น่าประทับใจให้กับทุกโปรเจค
                        </p>
                        {session ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-gray-300 text-sm">{session.user.email}</span>
                                </div>
                                <SignOutButton />
                            </div>
                        ) : (
                            <SignInButton />
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-red-400">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Home', 'About', 'Projects', 'Contact'].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-0.5 bg-red-400 group-hover:w-4 transition-all duration-300"></span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-red-400">Connect</h4>
                        <div className="flex gap-4">
                            {[
                                { icon: '𝕏', label: 'Twitter' },
                                { icon: 'in', label: 'LinkedIn' },
                                { icon: 'git', label: 'GitHub' },
                                { icon: '✉', label: 'Email' }
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-600/50"
                                    aria-label={social.label}
                                >
                                    <span className="text-sm font-bold">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2025 My Portfolio. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-gray-500 hover:text-red-400 transition-colors duration-300">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-red-400 transition-colors duration-300">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>

            {/* Decorative linear orb */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        </footer>
    );
}