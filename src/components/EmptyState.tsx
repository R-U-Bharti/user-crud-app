import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Button } from './ui/Button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Users className="h-10 w-10 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No users yet
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm">
        Get started by creating your first user. You can add their information
        and manage them from here.
      </p>
      
      <Button onClick={onCreateClick} className="gap-2">
        <UserPlus className="h-4 w-4" />
        Create First User
      </Button>
    </div>
  );
};
