import React from "react";

/**
 * Reusable form input component with modern design system styling
 * Integrates with Tailwind CSS for consistent styling across the application
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
          error ? "border-rose-300 focus:ring-rose-500" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-rose-600 text-sm mt-1 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-slate-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  required = false,
  options = [],
  className = "",
  children,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
          error ? "border-rose-300 focus:ring-rose-500" : ""
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p className="text-rose-600 text-sm mt-1 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-slate-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
          error ? "border-rose-300 focus:ring-rose-500" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-rose-600 text-sm mt-1 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-slate-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = "",
  ...props
}) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={`w-4 h-4 border border-slate-300 rounded accent-indigo-600 focus:ring-2 focus:ring-indigo-500 transition-all ${className}`}
        {...props}
      />
      {label && (
        <span className="text-sm text-slate-700 font-medium">{label}</span>
      )}
    </label>
  );
};

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <label
      className={`block text-sm font-semibold text-slate-700 mb-2 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
  );
};

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`} {...props}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-rose-600 text-sm mt-1 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-slate-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Usage Examples:
 *
 * 1. Simple Input:
 *    <Input
 *      type="email"
 *      label="Email"
 *      placeholder="user@example.com"
 *      required
 *      value={email}
 *      onChange={(e) => setEmail(e.target.value)}
 *    />
 *
 * 2. Input with Error:
 *    <Input
 *      label="Name"
 *      error={errors.name}
 *      value={name}
 *      onChange={(e) => setName(e.target.value)}
 *    />
 *
 * 3. Select Dropdown:
 *    <Select
 *      label="Role"
 *      value={role}
 *      onChange={(e) => setRole(e.target.value)}
 *      required
 *    >
 *      <option value="">Select Role</option>
 *      <option value="admin">Admin</option>
 *      <option value="user">User</option>
 *    </Select>
 *
 * 4. TextArea:
 *    <TextArea
 *      label="Comments"
 *      placeholder="Enter your comments..."
 *      rows={4}
 *      value={comments}
 *      onChange={(e) => setComments(e.target.value)}
 *    />
 *
 * 5. Checkbox:
 *    <Checkbox
 *      label="I agree to terms"
 *      checked={agreed}
 *      onChange={(e) => setAgreed(e.target.checked)}
 *    />
 */
