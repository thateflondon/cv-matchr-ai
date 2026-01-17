import type { CVData, CVCustomization } from "~/types/cv-builder";
import { X, Camera, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";
import { sanitizeInput } from "~/utils/formValidation";

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
    <form className="flex flex-col gap-4 mt-4 px-4">
      {/* Photo Upload Section */}
      <div className="form-div">
        <label htmlFor="photo-upload" className="text-sm font-medium text-foreground">
          Photo de profil
          {!supportsPhoto && (
            <span className="ml-2 text-xs text-amber-600 inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              (Non disponible pour ce template)
            </span>
          )}
        </label>
        
        <div className="w-full gradient-border">
          <div
            className={`relative transition-all rounded-xl overflow-hidden ${
              supportsPhoto
                ? isDragging
                  ? "bg-primary/10"
                  : "bg-white cursor-pointer hover:bg-gray-50"
                : "bg-gray-100 cursor-not-allowed opacity-60"
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
              id="photo-upload"
            />

            {personalDetails.photo ? (
              <div className="flex items-center gap-4 p-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={personalDetails.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-foreground">
                    Photo téléchargée
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
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
              <div className="flex flex-col items-center text-center p-6">
                <div className="mx-auto w-16 flex items-center justify-center mb-2">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      supportsPhoto
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Camera className="w-8 h-8" />
                  </div>
                </div>
                <p className={`text-lg ${supportsPhoto ? "text-gray-700" : "text-gray-500"}`}>
                  {supportsPhoto ? (
                    <>
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </>
                  ) : (
                    "Ce template ne supporte pas les photos"
                  )}
                </p>
                {supportsPhoto && (
                  <p className="text-lg text-gray-500">
                    PNG, JPG (max size 5 MB)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name Fields */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-div">
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">
            First Name <span className="text-destructive">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            value={personalDetails.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="John"
            maxLength={50}
            required
            className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="form-div">
          <label htmlFor="lastName" className="text-sm font-medium text-foreground">
            Last Name <span className="text-destructive">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            value={personalDetails.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Doe"
            maxLength={50}
            required
            className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Job Title */}
      <div className="form-div">
        <label htmlFor="jobTitle" className="text-sm font-medium text-foreground">
          Job Title <span className="text-destructive">*</span>
        </label>
        <input
          id="jobTitle"
          type="text"
          value={personalDetails.jobTitle}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
          placeholder="Senior Software Engineer"
          maxLength={100}
          required
          className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Contact Information */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-div">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={personalDetails.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john.doe@email.com"
            maxLength={254}
            required
            className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="form-div">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone <span className="text-destructive">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={personalDetails.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            maxLength={20}
            required
            className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Location */}
      <div className="form-div">
        <label htmlFor="location" className="text-sm font-medium text-foreground">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={personalDetails.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="New York, NY"
          maxLength={100}
          className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Optional Links */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-div">
          <label htmlFor="linkedin" className="text-sm font-medium text-foreground">
            LinkedIn
          </label>
          <input
            id="linkedin"
            type="url"
            value={personalDetails.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            maxLength={200}
            className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="form-div">
          <label htmlFor="website" className="text-sm font-medium text-foreground">
            Website
          </label>
          <input
            id="website"
            type="url"
            value={personalDetails.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="johndoe.com"
            maxLength={200}
            className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>
    </form>
  );
}