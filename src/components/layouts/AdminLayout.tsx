import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === 'loading') return

        if (!session) {
            router.push('/auth/login')
            return
        }

        if (session.user.role !== 'admin') {
            router.push('/')
            return
        }
    }, [session, status, router])

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!session || session.user.role !== 'admin') {
        return null
    }

    return <>{children}</>
} 