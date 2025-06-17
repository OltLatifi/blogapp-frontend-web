import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "admin") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        } ml-0`}
      >
        {/* Top navbar for mobile */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
