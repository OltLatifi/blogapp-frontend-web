import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold">246</p>
              <p className="text-green-500 mt-2 text-sm">
                +12% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Total Blogs</p>
              <p className="text-3xl font-bold">128</p>
              <p className="text-green-500 mt-2 text-sm">+5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Comments</p>
              <p className="text-3xl font-bold">534</p>
              <p className="text-green-500 mt-2 text-sm">
                +18% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Messages</p>
              <p className="text-3xl font-bold">42</p>
              <p className="text-red-500 mt-2 text-sm">-3% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="bg-blue-100 rounded-full p-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <p className="font-medium">
                      User published a new blog post
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Links</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Create New Blog Post
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                View All Users
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Manage Comments
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Site Settings
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
