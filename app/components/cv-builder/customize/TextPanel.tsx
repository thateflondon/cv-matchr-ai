import type { CVCustomization } from "~/types/cv-builder";

interface TextPanelProps {
  customization: CVCustomization;
  onUpdate: (customization: CVCustomization) => void;
}

const fontOptions = [
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Times New Roman, serif",
  "Georgia, serif",
  "Calibri, sans-serif",
  "Cambria, serif",
  "Verdana, sans-serif",
  "Garamond, serif",
  "Palatino, serif",
  "Trebuchet MS, sans-serif",
];

const fontWeightOptions = [
  { label: "Regular", value: "400" as const },
  { label: "Medium", value: "500" as const },
  { label: "Semibold", value: "600" as const },
  { label: "Bold", value: "700" as const },
];

export default function TextPanel({
  customization,
  onUpdate,
}: TextPanelProps) {
  const handleFontChange = (type: "primary" | "secondary", font: string) => {
    onUpdate({
      ...customization,
      fonts: {
        ...customization.fonts,
        [type]: font,
      },
    });
  };

  const handleLineHeightChange = (value: number) => {
    onUpdate({
      ...customization,
      spacing: {
        ...customization.spacing,
        lineHeight: value,
      },
    });
  };

  const handleFontSizeChange = (
    field: keyof CVCustomization["fontSize"],
    value: number
  ) => {
    onUpdate({
      ...customization,
      fontSize: {
        ...customization.fontSize,
        [field]: value,
      },
    });
  };

  const handleFontWeightChange = (
    field: keyof CVCustomization["fontWeight"],
    value: "400" | "500" | "600" | "700"
  ) => {
    onUpdate({
      ...customization,
      fontWeight: {
        ...customization.fontWeight,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Font Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fonts</h3>

        {/* Primary Font */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Font
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Used for body text and most content
          </p>
          <select
            value={customization.fonts.primary}
            onChange={(e) => handleFontChange("primary", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font.split(",")[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Secondary Font */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Font
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Used for section titles only
          </p>
          <select
            value={customization.fonts.secondary}
            onChange={(e) => handleFontChange("secondary", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font.split(",")[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Line Height
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="100"
            max="200"
            value={customization.spacing.lineHeight}
            onChange={(e) => handleLineHeightChange(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700 w-12 text-right">
            {customization.spacing.lineHeight}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Controls spacing between lines of text
        </p>
      </div>

      {/* Font Sizes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Font Sizes
        </h3>

        <div className="space-y-4">
          {/* Primary Heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Heading (Your Name)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="18"
                max="36"
                value={customization.fontSize.primaryHeading}
                onChange={(e) =>
                  handleFontSizeChange(
                    "primaryHeading",
                    Number(e.target.value)
                  )
                }
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12 text-right">
                {customization.fontSize.primaryHeading}px
              </span>
            </div>
          </div>

          {/* Secondary Heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Heading (Job Titles, etc.)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="12"
                max="24"
                value={customization.fontSize.secondaryHeading}
                onChange={(e) =>
                  handleFontSizeChange(
                    "secondaryHeading",
                    Number(e.target.value)
                  )
                }
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12 text-right">
                {customization.fontSize.secondaryHeading}px
              </span>
            </div>
          </div>

          {/* Body Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Text
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="8"
                max="14"
                value={customization.fontSize.body}
                onChange={(e) =>
                  handleFontSizeChange("body", Number(e.target.value))
                }
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12 text-right">
                {customization.fontSize.body}px
              </span>
            </div>
          </div>

          {/* Section Titles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Titles
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="20"
                value={customization.fontSize.sectionTitles}
                onChange={(e) =>
                  handleFontSizeChange(
                    "sectionTitles",
                    Number(e.target.value)
                  )
                }
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12 text-right">
                {customization.fontSize.sectionTitles}px
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Font Weights
        </h3>

        <div className="space-y-4">
          {/* Primary Heading Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Heading
            </label>
            <select
              value={customization.fontWeight.primaryHeading}
              onChange={(e) =>
                handleFontWeightChange(
                  "primaryHeading",
                  e.target.value as "400" | "500" | "600" | "700"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontWeightOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Secondary Heading Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Heading
            </label>
            <select
              value={customization.fontWeight.secondaryHeading}
              onChange={(e) =>
                handleFontWeightChange(
                  "secondaryHeading",
                  e.target.value as "400" | "500" | "600" | "700"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontWeightOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Body Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Text
            </label>
            <select
              value={customization.fontWeight.body}
              onChange={(e) =>
                handleFontWeightChange(
                  "body",
                  e.target.value as "400" | "500" | "600" | "700"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontWeightOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Section Titles Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Titles
            </label>
            <select
              value={customization.fontWeight.sectionTitles}
              onChange={(e) =>
                handleFontWeightChange(
                  "sectionTitles",
                  e.target.value as "400" | "500" | "600" | "700"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontWeightOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preview Text */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Preview:</h4>
        <div
          style={{
            fontFamily: customization.fonts.primary,
            lineHeight: `${customization.spacing.lineHeight}%`,
          }}
        >
          <h1
            style={{
              fontFamily: customization.fonts.secondary,
              fontSize: `${customization.fontSize.primaryHeading}px`,
              fontWeight: customization.fontWeight.primaryHeading,
            }}
          >
            Your Name
          </h1>
          <h2
            style={{
              fontSize: `${customization.fontSize.secondaryHeading}px`,
              fontWeight: customization.fontWeight.secondaryHeading,
            }}
          >
            Job Title
          </h2>
          <h3
            style={{
              fontFamily: customization.fonts.secondary,
              fontSize: `${customization.fontSize.sectionTitles}px`,
              fontWeight: customization.fontWeight.sectionTitles,
              color: customization.primaryColor,
            }}
            className="mt-3"
          >
            Section Title
          </h3>
          <p
            style={{
              fontSize: `${customization.fontSize.body}px`,
              fontWeight: customization.fontWeight.body,
            }}
            className="mt-2"
          >
            This is how your body text will appear in the resume. Make sure
            it's readable and professional.
          </p>
        </div>
      </div>
    </div>
  );
}