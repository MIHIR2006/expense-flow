"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const handleLogout = () => {
    // Add logout logic here
    console.log("User logged out");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-300">Welcome back! Here's what's happening.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-slate-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-white">Total Expenses</CardTitle>
              <CardDescription className="text-slate-300">
                This month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">$2,450.00</div>
              <p className="text-sm text-green-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-white">Pending Approvals</CardTitle>
              <CardDescription className="text-slate-300">
                Awaiting review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">8</div>
              <p className="text-sm text-yellow-400">3 urgent</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-white">Team Members</CardTitle>
              <CardDescription className="text-slate-300">
                Active users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">24</div>
              <p className="text-sm text-blue-400">+2 this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="border-0 bg-slate-800/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-300">
                Latest expense submissions
              </CardDescription>
            </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">John Doe submitted expense</p>
                        <p className="text-sm text-slate-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">$125.50</p>
                      <p className="text-sm text-yellow-400">Pending</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Jane Smith submitted expense</p>
                        <p className="text-sm text-slate-400">4 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">$89.25</p>
                      <p className="text-sm text-green-400">Approved</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Mike Johnson submitted expense</p>
                        <p className="text-sm text-slate-400">1 day ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">$234.75</p>
                      <p className="text-sm text-yellow-400">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
