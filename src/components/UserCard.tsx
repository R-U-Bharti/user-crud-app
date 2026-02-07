import React from 'react';
import { User } from '@/types/user';
import { userFormFields } from '@/config/formConfig';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Edit, Trash2, Mail, Phone, User as UserIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // Get field labels from config for display
  const getFieldLabel = (fieldName: string): string => {
    const field = userFormFields.find((f) => f.name === fieldName);
    return field?.label || fieldName;
  };

  // Get icon for field type
  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'email':
        return <Mail className="h-4 w-4 text-primary-600" />;
      case 'phoneNumber':
        return <Phone className="h-4 w-4 text-primary-600" />;
      case 'firstName':
      case 'lastName':
        return <UserIcon className="h-4 w-4 text-primary-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-lg">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <CardTitle className="text-lg">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">ID: {user.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(user)}
              className="h-8 w-8 p-0"
              aria-label="Edit user"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(user.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              aria-label="Delete user"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2.5">
          {/* Dynamically render user fields based on config */}
          {userFormFields.map((field) => {
            const value = user[field.name];
            if (!value) return null;
            
            return (
              <div key={field.name} className="flex items-center gap-2 text-sm">
                {getFieldIcon(field.name)}
                <span className="text-gray-600">
                  {getFieldLabel(field.name)}:
                </span>
                <span className="text-gray-900 font-medium">{value}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
