export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  // Add new fields here when extending
  // dateOfBirth?: string;
  // address?: string;
  [key: string]: any; // Allow dynamic fields
}

export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Partial<CreateUserDto>;
