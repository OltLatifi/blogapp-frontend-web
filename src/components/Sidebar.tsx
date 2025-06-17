import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Sidebar {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isMobileOpen: boolean) => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: Sidebar) {
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Team", href: "/admin/team", icon: Users },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out
                    ${collapsed ? "w-16" : "w-64"} 
                    ${
                      isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!collapsed && (
            <h2 className="text-xl font-semibold tracking-wider">
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-800 lg:block hidden"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-md hover:bg-gray-800 lg:hidden"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 transition-colors
                                            ${
                                              isActive
                                                ? "bg-gray-800 text-white"
                                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                            }`}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2 text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
