import type { CVData } from "types/cv-builder";
import { Lightbulb } from "lucide-react";
import FormInput from "~/components/common/FormInput";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateURL,
  validateLength,
  sanitizeInput,
} from "~/utils/formValidation";

interface PersonalDetailsSectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

export default function PersonalDetailsSection({
  data,
  onUpdate,
  aiSuggestions,
}: PersonalDetailsSectionProps) {
  const handleChange = (field: string, value: string) => {
    // Sanitize input before saving
    const sanitizedValue = sanitizeInput(value);
    
    onUpdate({
      ...data,
      personalDetails: {
        ...data.personalDetails,
        [field]: sanitizedValue,
      } as any,
    });
  };

  const personalDetails = data.personalDetails || {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  };

  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="firstName"
          label="First Name"
          value={personalDetails.firstName}
          onChange={(value) => handleChange("firstName", value)}
          placeholder="John"
          required
          validate={(value) => {
            const requiredCheck = validateRequired(value, "First name");
            if (!requiredCheck.isValid) return requiredCheck;
            return validateLength(value, 1, 50, "First name");
          }}
          maxLength={50}
        />
        <FormInput
          id="lastName"
          label="Last Name"
          value={personalDetails.lastName}
          onChange={(value) => handleChange("lastName", value)}
          placeholder="Doe"
          required
          validate={(value) => {
            const requiredCheck = validateRequired(value, "Last name");
            if (!requiredCheck.isValid) return requiredCheck;
            return validateLength(value, 1, 50, "Last name");
          }}
          maxLength={50}
        />
      </div>

      {/* Job Title */}
      <div>
        <FormInput
          id="jobTitle"
          label="Job Title"
          value={personalDetails.jobTitle}
          onChange={(value) => handleChange("jobTitle", value)}
          placeholder="Senior Software Engineer"
          required
          validate={(value) => {
            const requiredCheck = validateRequired(value, "Job title");
            if (!requiredCheck.isValid) return requiredCheck;
            return validateLength(value, 2, 100, "Job title");
          }}
          maxLength={100}
        />
        {aiSuggestions?.jobTitle && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>AI Suggestion:</strong> {aiSuggestions.jobTitle.text}
              </p>
              <button className="text-sm text-blue-600 font-medium mt-1 hover:underline">
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={personalDetails.email}
          onChange={(value) => handleChange("email", value)}
          placeholder="john.doe@email.com"
          required
          validate={(value) => {
            const requiredCheck = validateRequired(value, "Email");
            if (!requiredCheck.isValid) return requiredCheck;
            return validateEmail(value);
          }}
          maxLength={254}
        />
        <FormInput
          id="phone"
          label="Phone"
          type="tel"
          value={personalDetails.phone}
          onChange={(value) => handleChange("phone", value)}
          placeholder="+1 (555) 123-4567"
          required
          validate={(value) => {
            const requiredCheck = validateRequired(value, "Phone number");
            if (!requiredCheck.isValid) return requiredCheck;
            return validatePhone(value);
          }}
          maxLength={20}
        />
      </div>

      {/* Location */}
      <FormInput
        id="location"
        label="Location"
        value={personalDetails.location}
        onChange={(value) => handleChange("location", value)}
        placeholder="New York, NY"
        optional
        validate={(value) => validateLength(value, 0, 100, "Location")}
        maxLength={100}
      />

      {/* Optional Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="linkedin"
          label="LinkedIn"
          type="url"
          value={personalDetails.linkedin || ""}
          onChange={(value) => handleChange("linkedin", value)}
          placeholder="linkedin.com/in/johndoe"
          optional
          validate={validateURL}
          maxLength={200}
        />
        <FormInput
          id="website"
          label="Website"
          type="url"
          value={personalDetails.website || ""}
          onChange={(value) => handleChange("website", value)}
          placeholder="johndoe.com"
          optional
          validate={validateURL}
          maxLength={200}
        />
      </div>

      {/* Help Text */}
      <div className="p-4 bg-muted border border-border rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Tips:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Use a professional email address</li>
          <li>Include your city and state/country</li>
          <li>Make sure your phone number is accurate</li>
          <li>LinkedIn profile should be up to date if included</li>
        </ul>
      </div>
    </div>
  );
}