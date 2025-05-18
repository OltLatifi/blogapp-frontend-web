import Navbar from "./navbar";

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navbar />
            <div className="w-full mx-auto mb-16">
                {children}
            </div>
        </>
    );
}