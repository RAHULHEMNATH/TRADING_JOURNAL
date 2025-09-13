import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Page } from '../../types';

interface NavbarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{
  label: string;
  pageName: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onClick?: () => void;
}> = ({ label, pageName, currentPage, setCurrentPage, onClick }) => (
  <button
    onClick={() => {
        setCurrentPage(pageName);
        if (onClick) onClick();
    }}
    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
      currentPage === pageName
        ? 'bg-cyan-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    } transition`}
  >
    {label}
  </button>
);

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks: { label: string; page: Page }[] = [
        { label: 'Dashboard', page: 'DASHBOARD' },
        { label: 'Monthly Plan', page: 'MONTHLY_PLAN' },
        { label: 'History & Analytics', page: 'HISTORY' },
    ];

    return (
        <nav className="bg-gray-800 shadow-lg sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Title & Desktop Nav */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-cyan-400">Trading Journal</h1>
                        <div className="hidden md:block md:ml-10">
                            <div className="flex items-baseline space-x-4">
                                {navLinks.map(link => (
                                    <NavLink key={link.page} {...link} label={link.label} pageName={link.page} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: User & Logout */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user && <span className="text-gray-300 mr-4">{user.email}</span>}
                             <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            type="button"
                            className="bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu, show/hide based on menu state. */}
            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <NavLink key={link.page} {...link} label={link.label} pageName={link.page} currentPage={currentPage} setCurrentPage={setCurrentPage} onClick={() => setIsMobileMenuOpen(false)} />
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                                <span className="text-gray-400">{user?.email}</span>
                            </div>
                        </div>
                         <div className="mt-3 px-2 space-y-1">
                             <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-red-700 hover:text-white">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
