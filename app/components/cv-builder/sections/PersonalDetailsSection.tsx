import type { CVData, CVCustomization, SocialLink } from "~/types/cv-builder";
import { X, Camera, AlertTriangle, ChevronDown, ChevronUp, Plus, Trash2, GripVertical } from "lucide-react";
import { useState, useRef } from "react";
import { sanitizeInput, validateURL } from "~/utils/formValidation";
import FormInput from "~/components/common/FormInput";

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
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set());
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

  const socialLinks = data.socialLinks || [];

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

  // Social Links handlers
  const toggleLink = (id: string) => {
    const newExpanded = new Set(expandedLinks);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLinks(newExpanded);
  };

  const addLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      label: "",
      url: "",
    };
    onUpdate({
      ...data,
      socialLinks: [...socialLinks, newLink],
    });
    setExpandedLinks(new Set([...expandedLinks, newLink.id]));
  };

  const updateLink = (id: string, field: keyof SocialLink, value: string) => {
    const updatedLinks = socialLinks.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    onUpdate({
      ...data,
      socialLinks: updatedLinks,
    });
  };

  const deleteLink = (id: string) => {
    const updatedLinks = socialLinks.filter((link) => link.id !== id);
    onUpdate({
      ...data,
      socialLinks: updatedLinks,
    });
    const newExpanded = new Set(expandedLinks);
    newExpanded.delete(id);
    setExpandedLinks(newExpanded);
  };

  const getLinkTitle = (link: SocialLink) => {
    if (link.label && link.url) {
      return `${link.label} - ${link.url}`;
    }
    if (link.label) {
      return link.label;
    }
    if (link.url) {
      return link.url;
    }
    return "(Not specified)";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* More Details Toggle Button */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium w-full justify-center py-2"
        >
          {showMoreDetails ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Hide additional details</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Show more details</span>
            </>
          )}
        </button>
      </div>

      {/* Websites & Social Links Section (Collapsible) */}
      {showMoreDetails && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">
              Websites & Social Links
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              You can add links to websites you want hiring managers to see! Perhaps it will be a link to your portfolio, LinkedIn profile, or personal website.
            </p>
          </div>

          {/* Links List */}
          <div className="space-y-3">
            {socialLinks.map((link) => {
              const isExpanded = expandedLinks.has(link.id);
              return (
                <div
                  key={link.id}
                  className="border border-border rounded-lg overflow-hidden bg-card"
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 p-4 bg-muted/50">
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleLink(link.id)}
                      className="flex-1 text-left font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {getLinkTitle(link)}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteLink(link.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  {isExpanded && (
                    <div className="p-4 space-y-4">
                      <FormInput
                        id={`link-label-${link.id}`}
                        label="Label"
                        value={link.label}
                        onChange={(value) => updateLink(link.id, "label", value)}
                        placeholder="e.g., Portfolio, LinkedIn, GitHub"
                        maxLength={50}
                      />

                      <FormInput
                        id={`link-url-${link.id}`}
                        label="Link"
                        type="url"
                        value={link.url}
                        onChange={(value) => updateLink(link.id, "url", value)}
                        placeholder="https://example.com"
                        validate={validateURL}
                        maxLength={200}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={addLink}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">+ Add one more link</span>
          </button>
        </div>
      )}
    </form>
  );
}
