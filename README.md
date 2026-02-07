# User Management CRUD Application

A modern, extensible user management system built with React, TypeScript, Tailwind CSS, Formik, and Yup. This application demonstrates clean architecture, type safety, and a configuration-driven approach that makes adding new fields effortless.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue)

## ✨ Features

- **Full CRUD Operations**: Create, Read, Update, and Delete users
- **Dual Mode Support**: Works with or without API (Mock data + Real API)
- **Online/Offline Toggle**: UI switch to toggle between API and mock modes at runtime
- **Automatic Fallback**: Auto-switches to offline mode if server is unavailable with toast notification
- **Type-Safe**: Full TypeScript implementation with strict typing
- **Form Validation**: Robust validation using Formik and Yup with maxLength support
- **API Integration**: Axios-based service layer with error handling
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Extensible Architecture**: Add new fields with minimal code changes
- **Skeleton Loading**: Elegant skeleton placeholders during data loading
- **Toast Notifications**: Sonner-powered toast messages for user feedback
- **Error Handling**: User-friendly error messages with retry logic
- **Accessible**: WCAG-compliant UI components
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Offline Support**: Works without backend using in-memory storage

## 🚀 Tech Stack

- **React 18.2** - UI library
- **TypeScript 5.2** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **Formik 2.4** - Form management
- **Yup 1.3** - Schema validation
- **Axios 1.6** - HTTP client
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **JSON Server 0.17** - Mock REST API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

## 🛠️ Setup Instructions

### 1. Clone or Extract the Project

```bash
cd user-crud-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Choose Your Data Mode

The application supports **TWO modes**:

#### Option A: Mock Data Mode (No API Required) ⭐ **DEFAULT**

Perfect for testing, demos, or offline development!

**Setup:**
- ✅ Already configured! Just run:
```bash
npm run dev
```

The app will:
- Use in-memory data storage
- Start with 3 sample users
- Work completely offline
- Show a blue info banner indicating mock mode
- All changes stored in browser memory (reset on page refresh)

**To enable mock mode**, ensure `.env` has:
```env
VITE_USE_MOCK_DATA=true
```

#### Option B: API Mode (With JSON Server)

For persistent data storage and real API simulation.

**Setup:**
You need to run **TWO terminals**:

**Terminal 1 - Start the Mock API Server:**
```bash
npm run server
```
This will start JSON Server on `http://localhost:3001`

**Terminal 2 - Start the React Development Server:**
```bash
npm run dev
```

**To enable API mode**, update `.env`:
```env
VITE_USE_MOCK_DATA=false
```

Then restart both servers.

### 4. Open the Application

Navigate to `http://localhost:5173` in your browser.

---

## 🔄 Switching Between Modes

### Runtime Toggle (New! ⭐)

Use the **Online/Offline toggle** in the header to switch modes without restarting:
- **Toggle left (Wifi icon)** → Online mode (uses API)
- **Toggle right (WifiOff icon)** → Offline mode (uses mock data)

If you switch to Online mode and the server isn't running, the app will:
1. Attempt to connect to the API
2. Show a toast: "Server not running. Switching back to offline mode."
3. Automatically fall back to Offline mode

### From Mock Mode to API Mode (via .env):
1. Stop the dev server (Ctrl+C)
2. Update `.env`: `VITE_USE_MOCK_DATA=false`
3. Start JSON Server: `npm run server` (Terminal 1)
4. Start dev server: `npm run dev` (Terminal 2)

### From API Mode to Mock Mode (via .env):
1. Stop both servers (Ctrl+C)
2. Update `.env`: `VITE_USE_MOCK_DATA=true`
3. Start dev server: `npm run dev`

---

## 📊 Data Persistence

**Mock Mode:**
- Data stored in memory
- Resets on page refresh
- Perfect for demos and testing
- No backend required

**API Mode:**
- Data stored in `db.json`
- Persists between sessions
- Real API simulation
- Requires JSON Server running

---

## 📁 Project Structure

```
user-crud-app/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Toggle.tsx         # Online/Offline toggle switch
│   │   │   ├── Skeleton.tsx       # Skeleton loading primitive
│   │   │   └── sonner.tsx         # Toast notifications (Sonner)
│   │   ├── FormField.tsx          # Dynamic form field renderer
│   │   ├── UserForm.tsx           # User form with Formik
│   │   ├── UserCard.tsx           # User display card
│   │   ├── UserCardSkeleton.tsx   # Skeleton for user cards
│   │   ├── EmptyState.tsx         # Empty state component
│   │   └── DeleteConfirmationModal.tsx
│   ├── config/
│   │   └── formConfig.ts          # ⭐ FIELD CONFIGURATION (Add fields here)
│   ├── services/
│   │   └── apiService.ts          # Axios API service with mode toggle
│   ├── types/
│   │   └── user.ts                # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── db.json                        # Mock database for JSON Server
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── ARCHITECTURE.md                # Architecture documentation
└── README.md
```

## 🔧 How to Add New Fields

The application is designed with extensibility in mind. Adding new fields requires changes in only **TWO FILES**:

### Step 1: Update Form Configuration (`src/config/formConfig.ts`)

This is the **SINGLE SOURCE OF TRUTH** for all form fields. Add your new field to the `userFormFields` array:

```typescript
export const userFormFields: FormFieldConfig[] = [
  // ... existing fields ...
  
  // NEW FIELD EXAMPLE 1: Date of Birth
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    placeholder: '',
    required: false,
    validation: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .nullable(),
    gridColumn: 'span 1',
  },
  
  // NEW FIELD EXAMPLE 2: Address
  {
    name: 'address',
    label: 'Address',
    type: 'textarea',
    placeholder: 'Enter your full address',
    required: false,
    validation: Yup.string()
      .max(200, 'Address must be less than 200 characters')
      .nullable(),
    gridColumn: 'span 2', // Full width in grid
  },
  
  // NEW FIELD EXAMPLE 3: Country (Select dropdown)
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    required: true,
    options: [
      { label: 'United States', value: 'US' },
      { label: 'United Kingdom', value: 'UK' },
      { label: 'Canada', value: 'CA' },
      { label: 'Australia', value: 'AU' },
    ],
    validation: Yup.string().required('Country is required'),
    gridColumn: 'span 1',
  },
];
```

### Step 2: Update TypeScript Type (`src/types/user.ts`)

Add the new field to the User interface:

```typescript
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth?: string;    // New field
  address?: string;        // New field
  country?: string;        // New field
  [key: string]: any;
}
```

### That's it! ✨

The application will automatically:
- ✅ Render the new field in the form
- ✅ Apply validation rules
- ✅ Display the field in user cards
- ✅ Include it in API requests
- ✅ Handle form submission and updates

### Supported Field Types

- `text` - Standard text input
- `email` - Email input with validation
- `tel` - Phone number input
- `number` - Numeric input
- `date` - Date picker
- `textarea` - Multi-line text input
- `select` - Dropdown selection

### Field Configuration Options

```typescript
interface FormFieldConfig {
  name: string;           // Field name (must match User type)
  label: string;          // Display label
  type: FieldType;        // Input type
  placeholder?: string;   // Placeholder text
  required?: boolean;     // Is field required?
  validation?: Yup.AnySchema;  // Yup validation schema
  options?: FieldOption[];     // Options for select fields
  gridColumn?: string;    // Grid layout control (e.g., 'span 2')
  maxLength?: number;     // Maximum character length for input
}
```

## 🔌 API Configuration

### Using JSON Server (Development)

The project includes a mock API using JSON Server. Data is stored in `db.json`.

**API Endpoints:**
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Connecting to a Real API

1. Update the `.env` file:
```env
VITE_API_URL=https://your-api-url.com
```

2. Ensure your API follows the same endpoint structure or modify `src/services/apiService.ts` accordingly.

## 🎨 Customization

### Styling

The application uses Tailwind CSS. Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Validation Rules

Validation is handled by Yup. Modify rules in `src/config/formConfig.ts`:

```typescript
validation: Yup.string()
  .min(2, 'Minimum 2 characters')
  .max(50, 'Maximum 50 characters')
  .required('This field is required')
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## 🧪 Design Decisions & Architecture

### 1. Configuration-Driven Forms
Instead of hardcoding form fields, we use a centralized configuration (`formConfig.ts`). This enables:
- **Single source of truth** for all fields
- **Automatic form generation** from config
- **Easy extensibility** - add fields without touching UI code
- **Consistent validation** across the application

### 2. Type Safety with TypeScript
- Strong typing prevents runtime errors
- IntelliSense improves developer experience
- Interfaces ensure data consistency across components

### 3. Separation of Concerns
- **Services Layer**: API logic isolated in `apiService.ts`
- **Components**: Reusable, single-responsibility components
- **Types**: Centralized type definitions
- **Config**: Business logic separated from UI

### 4. Error Handling Strategy
- Custom `ApiError` class for structured error handling
- User-friendly error messages
- Axios interceptors for consistent error handling
- Loading states for all async operations

### 5. Form Management
- Formik handles form state and submission
- Yup provides declarative validation
- Dynamic field rendering based on configuration
- Real-time validation feedback

### 6. UI/UX Considerations
- Skeleton loading for async operations
- Toast notifications via Sonner
- Confirmation dialogs for destructive actions
- Responsive design for all screen sizes
- Accessible components (ARIA labels, keyboard navigation)
- Smooth animations for better user experience
- Runtime Online/Offline toggle

## 🐛 Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use:

**For JSON Server:**
```bash
npm run server -- --port 3002
```
Then update `.env`:
```env
VITE_API_URL=http://localhost:3002
```

**For Vite:**
```bash
npm run dev -- --port 5174
```

## 📝 Development Notes

### Code Quality
- ESLint and TypeScript strict mode enabled
- Component composition over inheritance
- Hooks-based React patterns
- Proper dependency management in useEffect

### Performance Considerations
- Memoized callbacks with useCallback
- Optimized re-renders
- Lazy loading for heavy components (can be added)
- Efficient state management

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ as a demonstration of clean, extensible React architecture.

---

## Quick Start Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Start JSON Server (`npm run server`)
- [ ] Start dev server (`npm run dev`)
- [ ] Open http://localhost:5173
- [ ] Try creating, editing, and deleting users
- [ ] Read the "How to Add New Fields" section
- [ ] Customize and deploy!

**Happy Coding! 🚀**
