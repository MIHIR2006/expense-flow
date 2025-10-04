'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useExpense, useExpenseSelection, useExpenseStats } from '@/hooks/useExpense';
import { useNotifications } from '@/hooks/useUI';
import { Calendar, DollarSign, Edit, Eye, Tag, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

export const ExpenseListExample = () => {
  const {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    deleteExpense,
    updateExpenseStatus,
  } = useExpense();

  const {
    selectedExpenses,
    selectedAmount,
    isAllSelected,
    isPartiallySelected,
    selectAllExpenses,
    clearSelection,
    toggleExpenseSelection,
  } = useExpenseSelection();

  const stats = useExpenseStats();
  const { showSuccess, showError } = useNotifications();

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      showSuccess('Success', 'Expense deleted successfully');
    } catch (error) {
      showError('Error', 'Failed to delete expense');
    }
  };

  const handleApproveExpense = async (id: string) => {
    try {
      await updateExpenseStatus(id, 'approved');
      showSuccess('Success', 'Expense approved successfully');
    } catch (error) {
      showError('Error', 'Failed to approve expense');
    }
  };

  const handleRejectExpense = async (id: string) => {
    try {
      await updateExpenseStatus(id, 'rejected', 'Expense rejected');
      showSuccess('Success', 'Expense rejected successfully');
    } catch (error) {
      showError('Error', 'Failed to reject expense');
    }
  };

  const handleBulkDelete = async () => {
    try {
      // This would be implemented in the expense store
      showSuccess('Success', `${selectedExpenses.length} expenses deleted`);
      clearSelection();
    } catch (error) {
      showError('Error', 'Failed to delete expenses');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'submitted':
        return 'secondary';
      case 'paid':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchExpenses()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageExpense.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${selectedAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedExpenses.length} expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedExpenses.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {selectedExpenses.length} expenses selected
                </span>
                <span className="text-sm text-muted-foreground">
                  Total: ${selectedAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                >
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Expenses</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isPartiallySelected;
                }}
                onCheckedChange={(checked) => {
                  if (checked) {
                    selectAllExpenses();
                  } else {
                    clearSelection();
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expenses found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedExpenses.includes(expense.id)}
                      onCheckedChange={() => toggleExpenseSelection(expense.id)}
                    />
                    <div>
                      <h3 className="font-medium">{expense.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {expense.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm font-medium">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <Badge variant={getStatusBadgeVariant(expense.status)}>
                          {expense.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {expense.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* View expense */}}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* Edit expense */}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {expense.status === 'submitted' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveExpense(expense.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectExpense(expense.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
