import { useState } from "react";
import type { CVData, SocialLink } from "types/cv-builder";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import FormInput from "~/components/common/FormInput";
import SectionHeader from "../common/SectionHeader";
import { validateURL } from "~/utils/formValidation";

interface WebsitesAndSocialLinksProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
}

export default function WebsitesAndSocialLinksSection({
  data,
  onUpdate,
}: WebsitesAndSocialLinksProps) {
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set());

  const socialLinks = data.socialLinks || [];

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
    <div className="space-y-4">
      <SectionHeader
        title="Websites & Social Links"
        description="You can add links to websites you want hiring managers to see! Perhaps it will be a link to your portfolio, LinkedIn profile, or personal website."
      />

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
  );
}
