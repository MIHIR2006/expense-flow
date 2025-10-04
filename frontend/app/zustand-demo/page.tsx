'use client';

import { ExpenseListExample } from '@/components/examples/expense-list-example';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationToaster } from '@/components/ui/notification-toaster';
import { useAuth } from '@/hooks/useAuth';
import { useExpenseStats } from '@/hooks/useExpense';
import { useUI } from '@/hooks/useUI';
import {
    Bell,
    Filter,
    LogOut,
    Moon,
    Plus,
    Search,
    Settings,
    Sun,
    User
} from 'lucide-react';

export default function ZustandDemoPage() {
  const { 
    theme, 
    toggleTheme, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo,
    openModal,
    sidebar,
    toggleSidebar,
    isMobile,
    toggleMobileMenu
  } = useUI();

  const { user, isAuthenticated, logout, fullName, initials } = useAuth();
  const stats = useExpenseStats();

  const handleTestNotifications = () => {
    showSuccess('Success!', 'This is a success notification');
    setTimeout(() => showError('Error!', 'This is an error notification'), 1000);
    setTimeout(() => showWarning('Warning!', 'This is a warning notification'), 2000);
    setTimeout(() => showInfo('Info!', 'This is an info notification'), 3000);
  };

  const handleTestModal = () => {
    openModal({
      type: 'confirmation',
      data: {
        title: 'Test Modal',
        message: 'This is a test modal from Zustand store!',
        onConfirm: () => {
          showSuccess('Confirmed!', 'You clicked confirm');
        },
        onCancel: () => {
          showInfo('Cancelled', 'You clicked cancel');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToaster />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="mr-2"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Zustand Demo</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestNotifications}
              >
                <Bell className="h-5 w-5" />
              </Button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {initials}
                  </div>
                  <span className="text-sm font-medium">{fullName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm">
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebar.isOpen && (
          <aside className={`${isMobile ? 'fixed inset-0 z-50' : 'w-64'} bg-white shadow-sm border-r`}>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Navigation</h2>
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Demo Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Zustand Store Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button onClick={handleTestNotifications} className="w-full">
                    Test Notifications
                  </Button>
                  <Button onClick={handleTestModal} variant="outline" className="w-full">
                    Test Modal
                  </Button>
                  <Button onClick={toggleTheme} variant="outline" className="w-full">
                    Toggle Theme
                  </Button>
                  <Button onClick={toggleSidebar} variant="outline" className="w-full">
                    Toggle Sidebar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Store State Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>UI Store State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Theme:</span>
                      <Badge variant="outline">{theme}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sidebar Open:</span>
                      <Badge variant={sidebar.isOpen ? "default" : "secondary"}>
                        {sidebar.isOpen ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mobile:</span>
                      <Badge variant={isMobile ? "default" : "secondary"}>
                        {isMobile ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Auth Store State</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Authenticated:</span>
                      <Badge variant={isAuthenticated ? "default" : "secondary"}>
                        {isAuthenticated ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">User:</span>
                      <span className="text-sm font-medium">{fullName || "Not logged in"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Role:</span>
                      <Badge variant="outline">{user?.role || "N/A"}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expense Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Statistics (from Zustand)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.totalCount}</div>
                    <div className="text-sm text-muted-foreground">Total Expenses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">${stats.averageExpense.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Object.keys(stats.expensesByCategory).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expense List Example */}
            <ExpenseListExample />
          </div>
        </main>
      </div>
    </div>
  );
}
