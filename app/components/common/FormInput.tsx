import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface FormInputProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "date";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  error?: string;
  validate?: (value: string) => { isValid: boolean; error?: string };
  maxLength?: number;
  className?: string;
  description?: string;
}

export default function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
  disabled = false,
  error: externalError,
  validate,
  maxLength,
  className = "",
  description,
}: FormInputProps) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>();

  const error = externalError || internalError;

  useEffect(() => {
    if (touched && validate && !disabled) {
      const result = validate(value);
      setInternalError(result.isValid ? undefined : result.error);
    }
  }, [value, validate, touched, disabled]);

  const handleBlur = () => {
    setTouched(true);
    if (validate && !disabled) {
      const result = validate(value);
      setInternalError(result.isValid ? undefined : result.error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-1.5"
      >
        {label}
        {required && !disabled && <span className="text-destructive ml-1">*</span>}
        {optional && (
          <span className="text-muted-foreground text-xs ml-1">(Optional)</span>
        )}
      </label>

      {description && (
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-3 py-2 bg-input-background border rounded-lg shadow-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${
            disabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : error
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/50"
          }
        `}
      />

      {error && (
        <div
          id={`${id}-error`}
          className="flex items-start gap-1.5 mt-1.5"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <span className="text-xs text-destructive">{error}</span>
        </div>
      )}
    </div>
  );
}