import type { CVData, CVCustomization } from "~/types/cv-builder";
import FormInput from "~/components/common/FormInput";
import { Upload, X, Camera, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";
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
  customization?: CVCustomization;
}

export default function PersonalDetailsSection({
  data,
  onUpdate,
  aiSuggestions,
  customization,
}: PersonalDetailsSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    photo: "",
  };

  const supportsPhoto = customization?.template?.hasPhoto ?? false;

  const handlePhotoUpload = (file: File) => {
    if (!supportsPhoto) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleChange("photo", base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (supportsPhoto) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!supportsPhoto) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleRemovePhoto = () => {
    handleChange("photo", "");
  };

  const handlePhotoClick = () => {
    if (supportsPhoto) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Photo Upload Section */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Photo de profil
          {!supportsPhoto && (
            <span className="ml-2 text-xs text-amber-600 flex items-center gap-1 inline-flex">
              <AlertTriangle className="w-3 h-3" />
              (Non disponible pour ce template)
            </span>
          )}
        </label>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
            supportsPhoto
              ? isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 cursor-pointer"
              : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handlePhotoClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={!supportsPhoto}
          />

          {personalDetails.photo ? (
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={personalDetails.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Photo téléchargée
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cliquez pour changer ou glissez-déposez
                </p>
              </div>
              {supportsPhoto && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto();
                  }}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
                  supportsPhoto
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Camera className={`${supportsPhoto ? "w-9 h-9" : "w-8 h-8"}`} />
              </div>
              <p
                className={`text-sm font-medium mb-1 ${
                  supportsPhoto ? "text-foreground" : "text-gray-400"
                }`}
              >
                {supportsPhoto
                  ? "Cliquez pour télécharger ou glissez-déposez"
                  : "Ce template ne supporte pas les photos"}
              </p>
              {supportsPhoto && (
                <p className="text-xs text-muted-foreground">
                  PNG, JPG jusqu'à 5MB
                </p>
              )}
            </div>
          )}
        </div>

        {supportsPhoto && (
          <p className="text-xs text-muted-foreground mt-2">
            💡 Utilisez une photo professionnelle avec un fond neutre pour de meilleurs résultats
          </p>
        )}
      </div>

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