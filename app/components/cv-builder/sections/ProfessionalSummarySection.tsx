import type { CVData } from "types/cv-builder";
import { Lightbulb } from "lucide-react";
import RichTextEditor from "~/components/common/RichTextEditor";
import { sanitizeInput } from "~/utils/formValidation";

interface ProfessionalSummarySectionProps {
  data: CVData;
  onUpdate: (data: CVData) => void;
  aiSuggestions?: any;
}

export default function ProfessionalSummarySection({
  data,
  onUpdate,
  aiSuggestions,
}: ProfessionalSummarySectionProps) {
  const handleChange = (value: string) => {
    onUpdate({
      ...data,
      professionalSummary: value,
    });
  };

  const handleAIClick = () => {
    // TODO: Implement AI writer functionality
    console.log("AI writer clicked");
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2">
          Professional Summary
          <span className="text-muted-foreground ml-1">(Optional)</span>
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          Write 2-4 short, energetic sentences about how great you are. Mention
          the role and what you did. What were the big achievements? Describe
          your motivation and list your skills.
        </p>
        <RichTextEditor
          value={data.professionalSummary || ""}
          onChange={handleChange}
          placeholder="Write a compelling summary of your professional background..."
          minHeight="150px"
          showAIButton={true}
          onAIClick={handleAIClick}
          showCharacterCount={true}
          minCharacters={400}
          recruiterTip="Recruiters read on average 6 seconds per resume: write 400-600 characters to increase interview chances"
        />
      </div>

      {/* AI Suggestion */}
      {aiSuggestions?.professionalSummary && (
        <div className="p-4 bg-accent border border-border rounded-lg">
          <div className="flex items-start gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                AI-Generated Summary
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {aiSuggestions.professionalSummary.text}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleChange(aiSuggestions.professionalSummary.text)}
            className="text-sm text-primary font-medium hover:underline"
          >
            Apply this suggestion
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-muted border border-border rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">
          Writing Tips:
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Start with your current role or professional identity</li>
          <li>Highlight 2-3 key achievements or areas of expertise</li>
          <li>Mention years of experience if relevant</li>
          <li>Include specific industries or technologies you specialize in</li>
          <li>End with your career goals or what you're looking for</li>
        </ul>
      </div>

      {/* Example */}
      <div className="p-4 bg-accent border border-border rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Example:</h4>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          "Results-driven Senior Software Engineer with 7+ years of experience
          building scalable web applications. Proven expertise in React,
          Node.js, and cloud architecture, with a track record of leading teams
          to deliver high-impact products. Passionate about clean code,
          performance optimization, and mentoring junior developers. Seeking to
          leverage my technical leadership skills in a challenging role at an
          innovative tech company."
        </p>
      </div>
    </div>
  );
}