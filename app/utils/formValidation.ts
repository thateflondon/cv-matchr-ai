/**
 * Form validation utilities with security best practices
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: true }; // Optional field
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address"
    };
  }

  if (email.length > 254) {
    return {
      isValid: false,
      error: "Email address is too long"
    };
  }

  return { isValid: true };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: true }; // Optional field
  }

  // Allow numbers, spaces, hyphens, parentheses, and + for international
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      error: "Phone number can only contain numbers, spaces, and +-()"
    };
  }

  // Remove all non-digit characters for length check
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 6 || digitsOnly.length > 15) {
    return {
      isValid: false,
      error: "Phone number must be between 6 and 15 digits"
    };
  }

  return { isValid: true };
}

/**
 * Validate URL
 */
export function validateURL(url: string): ValidationResult {
  if (!url) {
    return { isValid: true }; // Optional field
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    // Try adding https:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      try {
        new URL(`https://${url}`);
        return { isValid: true };
      } catch {
        return {
          isValid: false,
          error: "Please enter a valid URL (e.g., https://example.com)"
        };
      }
    }
    
    return {
      isValid: false,
      error: "Please enter a valid URL"
    };
  }
}

/**
 * Validate required text field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  return { isValid: true };
}

/**
 * Validate text length
 */
export function validateLength(
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string
): ValidationResult {
  if (!value) {
    return { isValid: true }; // Let validateRequired handle empty values
  }

  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`
    };
  }

  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${maxLength} characters`
    };
  }

  return { isValid: true };
}

/**
 * Validate date format and logic
 */
export function validateDate(
  dateStr: string,
  fieldName: string
): ValidationResult {
  if (!dateStr) {
    return { isValid: true }; // Optional field
  }

  // Check if it's in MM/YYYY format
  const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
  
  if (!dateRegex.test(dateStr)) {
    return {
      isValid: false,
      error: `${fieldName} must be in MM/YYYY format`
    };
  }

  const [month, year] = dateStr.split('/').map(Number);
  const currentYear = new Date().getFullYear();
  
  if (year < 1950 || year > currentYear + 10) {
    return {
      isValid: false,
      error: `${fieldName} year must be between 1950 and ${currentYear + 10}`
    };
  }

  return { isValid: true };
}

/**
 * Validate date range (start date must be before end date)
 */
export function validateDateRange(
  startDate: string,
  endDate: string,
  isCurrent: boolean = false
): ValidationResult {
  if (!startDate || (!endDate && !isCurrent)) {
    return { isValid: true }; // Let required validation handle this
  }

  if (isCurrent) {
    return { isValid: true }; // No end date to compare
  }

  try {
    const [startMonth, startYear] = startDate.split('/').map(Number);
    const [endMonth, endYear] = endDate.split('/').map(Number);
    
    const start = new Date(startYear, startMonth - 1);
    const end = new Date(endYear, endMonth - 1);
    
    if (start >= end) {
      return {
        isValid: false,
        error: "End date must be after start date"
      };
    }
  } catch {
    return { isValid: true }; // Let date format validation handle this
  }

  return { isValid: true };
}

/**
 * Validate GPA
 */
export function validateGPA(gpa: string): ValidationResult {
  if (!gpa) {
    return { isValid: true }; // Optional field
  }

  const gpaNum = parseFloat(gpa);
  
  if (isNaN(gpaNum)) {
    return {
      isValid: false,
      error: "GPA must be a number"
    };
  }

  if (gpaNum < 0 || gpaNum > 4.0) {
    return {
      isValid: false,
      error: "GPA must be between 0.0 and 4.0"
    };
  }

  return { isValid: true };
}

/**
 * Validate postal code (flexible for international)
 */
export function validatePostalCode(postalCode: string): ValidationResult {
  if (!postalCode) {
    return { isValid: true }; // Optional field
  }

  // Allow alphanumeric and spaces/hyphens
  const postalRegex = /^[A-Za-z0-9\s\-]+$/;
  
  if (!postalRegex.test(postalCode)) {
    return {
      isValid: false,
      error: "Postal code can only contain letters, numbers, spaces, and hyphens"
    };
  }

  if (postalCode.length > 10) {
    return {
      isValid: false,
      error: "Postal code is too long"
    };
  }

  return { isValid: true };
}

/**
 * Validate text contains only safe characters
 */
export function validateSafeText(text: string, fieldName: string): ValidationResult {
  if (!text) {
    return { isValid: true };
  }

  // Check for potential script injection
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        error: `${fieldName} contains invalid characters`
      };
    }
  }

  return { isValid: true };
}