import { useState, useEffect, useCallback } from "react";
import { UserPlus, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { User } from "./types/user";
import { apiService, ApiError } from "./services/apiService";
import { UserCard } from "./components/UserCard";
import { UserCardSkeletonGrid } from "./components/UserCardSkeleton";
import { UserForm } from "./components/UserForm";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { EmptyState } from "./components/EmptyState";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";
import { Alert } from "./components/ui/Alert";
import { Toggle } from "./components/ui/Toggle";
import { toast } from "sonner";

function App() {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected user for edit/delete
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all users
  const fetchUsers = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const data = await apiService.getAllUsers();
      setUsers(data);
      setIsMockMode(apiService.isUsingMockData());
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Failed to fetch users. Please try again.";
      toast.error(errorMessage);
      setIsMockMode(apiService.isUsingMockData());
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Create user handler
  const handleCreateUser = async (values: any) => {
    try {
      setIsSubmitting(true);

      await apiService.createUser(values);

      toast.success("User created successfully!");
      setIsCreateModalOpen(false);
      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Failed to create user. Please try again.";
      toast.error(errorMessage);
      console.error("Error creating user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update user handler
  const handleUpdateUser = async (values: any) => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);

      await apiService.updateUser(selectedUser.id, values);

      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Failed to update user. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);

      await apiService.deleteUser(selectedUser.id);

      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Failed to delete user. Please try again.";
      toast.error(errorMessage);
      console.error("Error deleting user:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDeleteModalOpen(true);
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Toggle between online/offline mode
  const handleModeToggle = async (isOffline: boolean) => {
    apiService.setMockMode(isOffline);
    setIsMockMode(isOffline);

    await fetchUsers(true);

    // Check if we tried to go online but it fell back to offline
    if (!isOffline && apiService.isUsingMockData()) {
      toast.info("Server not running. Switching back to offline mode.");
      setIsMockMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                Create, view, update, and delete users with ease
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Mode Toggle */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <Wifi
                  className={`h-4 w-4 ${!isMockMode ? "text-green-600" : "text-gray-400"}`}
                />
                <Toggle
                  checked={isMockMode}
                  onChange={handleModeToggle}
                  disabled={isLoading || isRefreshing}
                />
                <WifiOff
                  className={`h-4 w-4 ${isMockMode ? "text-orange-600" : "text-gray-400"}`}
                />
                <span className="text-xs font-medium text-gray-600 min-w-[60px]">
                  {isMockMode ? "Offline" : "Online"}
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={() => fetchUsers(true)}
                disabled={isRefreshing || isLoading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button onClick={openCreateModal} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </header>

        {/* Mock Mode Indicator */}
        {isMockMode && (
          <div className="mb-6 animate-slide-up">
            <Alert
              variant="info"
              message="Running in offline mode with local data storage. All changes are temporary and stored in browser memory."
              className="border-blue-300"
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <UserCardSkeletonGrid count={6} />
        ) : users.length === 0 ? (
          <EmptyState onCreateClick={openCreateModal} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}

        {/* User count */}
        {!isLoading && users.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {users.length} {users.length === 1 ? "user" : "users"}
            {isMockMode && " (stored locally)"}
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        title="Create New User"
        size="lg"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={closeModals}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Edit User"
        size="lg"
      >
        <UserForm
          initialData={selectedUser}
          onSubmit={handleUpdateUser}
          onCancel={closeModals}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDeleteUser}
        userName={
          selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName}`
            : ""
        }
        isDeleting={isSubmitting}
      />
    </div>
  );
}

export default App;
