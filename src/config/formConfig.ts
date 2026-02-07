import * as Yup from "yup";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "textarea"
  | "select";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  validation?: Yup.AnySchema;
  options?: FieldOption[]; // For select fields
  gridColumn?: string; // For layout control
  maxLength?: number; // Maximum character length for input
}

// Centralized form configuration - ADD NEW FIELDS HERE
export const userFormFields: FormFieldConfig[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter first name",
    required: true,
    validation: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .required("First name is required"),
    gridColumn: "span 1",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter last name",
    required: true,
    validation: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .required("Last name is required"),
    gridColumn: "span 1",
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "tel",
    placeholder: "1234567890",
    required: true,
    validation: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    gridColumn: "span 1",
    maxLength: 10,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "name@example.com",
    required: true,
    validation: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    gridColumn: "span 1",
  },
  // EXTENSIBILITY EXAMPLE: Uncomment to add new fields
  // {
  //   name: 'dateOfBirth',
  //   label: 'Date of Birth',
  //   type: 'date',
  //   placeholder: '',
  //   required: false,
  //   validation: Yup.date()
  //     .max(new Date(), 'Date of birth cannot be in the future')
  //     .nullable(),
  //   gridColumn: 'span 1',
  // },
  // {
  //   name: 'address',
  //   label: 'Address',
  //   type: 'textarea',
  //   placeholder: 'Enter your address',
  //   required: false,
  //   validation: Yup.string()
  //     .max(200, 'Address must be less than 200 characters')
  //     .nullable(),
  //   gridColumn: 'span 2',
  // },
];

// Generate initial values from field configuration
export const generateInitialValues = () => {
  return userFormFields.reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    {} as Record<string, any>,
  );
};

// Generate validation schema from field configuration
export const generateValidationSchema = () => {
  const schemaFields = userFormFields.reduce(
    (acc, field) => {
      if (field.validation) {
        acc[field.name] = field.validation;
      }
      return acc;
    },
    {} as Record<string, Yup.AnySchema>,
  );

  return Yup.object().shape(schemaFields);
};
