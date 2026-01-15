import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface FormTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  validate?: (value: string) => { isValid: boolean; error?: string };
  maxLength?: number;
  rows?: number;
  className?: string;
  description?: string;
}

export default function FormTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
  error: externalError,
  validate,
  maxLength,
  rows = 4,
  className = "",
  description,
}: FormTextareaProps) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>();

  const error = externalError || internalError;

  useEffect(() => {
    if (touched && validate) {
      const result = validate(value);
      setInternalError(result.isValid ? undefined : result.error);
    }
  }, [value, validate, touched]);

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
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
        {required && <span className="text-destructive ml-1">*</span>}
        {optional && (
          <span className="text-muted-foreground text-xs ml-1">(Optional)</span>
        )}
      </label>

      {description && (
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
      )}

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-3 py-2 bg-input-background border rounded-lg shadow-sm transition-colors resize-y
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${
            error
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary/50"
          }
        `}
        style={{ whiteSpace: "pre-wrap" }}
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

      {maxLength && !error && (
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {(value || "").length}/{maxLength}
        </div>
      )}
    </div>
  );
}