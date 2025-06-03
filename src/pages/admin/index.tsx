import { Card, CardHeader, CardContent } from '@/components/ui/card'
import AdminLayout from '@/components/layouts/AdminLayout'

export default function AdminDashboard() {

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">Users</h2>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Manage user accounts and permissions</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">Content</h2>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Manage blog posts and comments</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">Settings</h2>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Configure site settings and preferences</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
} 