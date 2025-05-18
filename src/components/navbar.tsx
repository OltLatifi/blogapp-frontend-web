import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    function handleMobileMenuToggle() {
        setMobileMenuOpen((open) => !open);
    }

    function handleCloseMobileMenu() {
        setMobileMenuOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                setMobileMenuOpen(false);
            }
        }
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileMenuOpen]);

    function renderLogo() {
        return (
            <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">Blog Web</span>
            </div>
        );
    }

    function renderNavLinks(isMobile: boolean) {
        function handleLinkClick() {
            if (isMobile) handleCloseMobileMenu();
        }
        return (
            <div className={`flex flex-col ${isMobile ? "space-y-8 text-2xl" : "space-x-8 flex-row items-center"} text-gray-900 text-base font-normal`}>
                <Link href="/" onClick={handleLinkClick}>Home</Link>
                <Link href="/blog" onClick={handleLinkClick}>Blog</Link>
                <Link href="/post/sample" onClick={handleLinkClick}>Single Post</Link>
                <div className="relative group">
                    <button className="flex items-center space-x-1 focus:outline-none">
                        <span>Other Pages</span>
                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </button>
                    <div className={`absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10 ${isMobile ? "static opacity-100 pointer-events-auto mt-0 border-none shadow-none" : ""}`}>
                        <Link href="/about" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>About</Link>
                        <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>Contact</Link>
                    </div>
                </div>
            </div>
        );
    }

    function renderDesktopMenu() {
        return (
            <div className="hidden md:flex">{renderNavLinks(false)}</div>
        );
    }

    function renderMobileMenuButton() {
        return (
            <button
                className="md:hidden flex items-center px-2 py-1 border rounded text-gray-900 border-gray-300 focus:outline-none"
                onClick={handleMobileMenuToggle}
                aria-label="Toggle menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        );
    }

    function renderMobileMenu() {
        if (!mobileMenuOpen) return null;
        return (
            <div ref={mobileMenuRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white w-full h-full animate-fade-in">
                <button
                    className="absolute top-6 right-6 text-gray-900 p-2 rounded focus:outline-none"
                    onClick={handleCloseMobileMenu}
                    aria-label="Close menu"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {renderNavLinks(true)}
            </div>
        );
    }

    return (
        <nav className="w-full border-b border-gray-200 bg-white">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {renderLogo()}
                {renderDesktopMenu()}
                {renderMobileMenuButton()}
            </div>
            {renderMobileMenu()}
        </nav>
    );
}

export default Navbar;