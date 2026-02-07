import React from 'react';
import { Formik, Form } from 'formik';
import { User } from '@/types/user';
import {
  userFormFields,
  generateInitialValues,
  generateValidationSchema,
} from '@/config/formConfig';
import { FormField } from './FormField';
import { Button } from './ui/Button';
import { Loading } from './ui/Loading';

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  // Generate initial values from config or use existing data
  const getInitialValues = () => {
    if (initialData) {
      // Populate form with existing user data
      const values: any = {};
      userFormFields.forEach((field) => {
        values[field.name] = initialData[field.name] || '';
      });
      return values;
    }
    return generateInitialValues();
  };

  const validationSchema = generateValidationSchema();

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="space-y-6">
          {/* Dynamically render form fields in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userFormFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                disabled={isSubmitting || isLoading}
              />
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !isValid || !dirty}
              className="min-w-[120px]"
            >
              {isSubmitting || isLoading ? (
                <Loading size="sm" />
              ) : initialData ? (
                'Update User'
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
