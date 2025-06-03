import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    function handleMobileMenuToggle() {
        setMobileMenuOpen((open) => !open);
    }

    function handleCloseMobileMenu() {
        setMobileMenuOpen(false);
    }

    function handleLogout() {
        signOut({ callbackUrl: "/" });
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
            <div className={`flex flex-col ${isMobile ? "space-y-4 text-lg" : "space-x-8 flex-row items-center"} text-gray-900 text-base font-normal`}>
                <Link href="/" onClick={handleLinkClick}>Home</Link>
                <Link href="/about" onClick={handleLinkClick}>About</Link>
                {session && (
                    <>
                        <Link href="/blogs/my-blogs" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>My Blogs</Link>
                        <Link href="/favorites" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>Favorites</Link>
                    </>
                )}
                {session ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                ) : (
                    <Link href="/auth/login" className="block px-4 py-2 hover:bg-gray-100 rounded" onClick={handleLinkClick}>
                        Login
                    </Link>
                )}
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
                <Menu className="w-6 h-6" />
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
                    <X className="w-8 h-8" />
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