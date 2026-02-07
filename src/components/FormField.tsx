import React from "react";
import { Field, ErrorMessage } from "formik";
import { FormFieldConfig } from "@/config/formConfig";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  field: FormFieldConfig;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ field, disabled }) => {
  const renderInput = (formikField: any, formikMeta: any) => {
    const hasError = formikMeta.touched && formikMeta.error;

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...formikField}
            placeholder={field.placeholder}
            disabled={disabled}
            className={cn(hasError && "border-red-500 focus:ring-red-500")}
          />
        );

      case "select":
        return (
          <select
            {...formikField}
            disabled={disabled}
            className={cn(
              "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              hasError && "border-red-500 focus:ring-red-500",
            )}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <Input
            {...formikField}
            type={field.type}
            placeholder={field.placeholder}
            disabled={disabled}
            maxLength={field.maxLength}
            className={cn(hasError && "border-red-500 focus:ring-red-500")}
          />
        );
    }
  };

  return (
    <div
      className={cn(
        "space-y-1.5",
        field.gridColumn && `col-${field.gridColumn}`,
      )}
    >
      <Label htmlFor={field.name} required={field.required}>
        {field.label}
      </Label>

      <Field name={field.name}>
        {({ field: formikField, meta }: any) => renderInput(formikField, meta)}
      </Field>

      <ErrorMessage name={field.name}>
        {msg => (
          <p className="text-sm text-red-600 animate-slide-up" role="alert">
            {msg}
          </p>
        )}
      </ErrorMessage>
    </div>
  );
};
