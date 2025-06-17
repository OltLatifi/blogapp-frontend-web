import Footer from "./footer";
import Navbar from "./navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="w-full mx-auto flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
