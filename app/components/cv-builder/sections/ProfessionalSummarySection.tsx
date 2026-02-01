import type { CVData } from "~/types/cv-builder";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import RichTextEditor from "~/components/common/RichTextEditor";
import { sanitizeInput } from "~/utils/formValidation";
import { usePuterStore } from "~/lib/puter";
import { generateProfessionalSummary } from "~/utils/aiWriter";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const { ai } = usePuterStore();

  const handleChange = (value: string) => {
    onUpdate({
      ...data,
      professionalSummary: value,
    });
  };

  const handleAIClick = async () => {
    setIsGenerating(true);
    setAiError(null);

    try {
      const result = await generateProfessionalSummary(ai.chat, data);

      if (result.success && result.data) {
        setGeneratedSummary(result.data);
      } else {
        setAiError(result.error || "Failed to generate summary");
      }
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedSummary = () => {
    if (generatedSummary) {
      handleChange(generatedSummary);
      setGeneratedSummary(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4 px-4">
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
          isAILoading={isGenerating}
          showCharacterCount={true}
          minCharacters={400}
          recruiterTip="Recruiters read on average 6 seconds per resume: write 400-600 characters to increase interview chances"
        />
      </div>

      {/* AI Error */}
      {aiError && (
        <div className="w-full px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{aiError}</p>
          <button
            onClick={() => setAiError(null)}
            className="text-sm text-red-500 hover:underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* AI Generated Summary */}
      {generatedSummary && (
        <div className="w-full px-3 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg shadow-sm">
          <div className="flex items-start gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                AI-Generated Summary
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {generatedSummary}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={applyGeneratedSummary}
              className="text-sm text-purple-600 font-medium hover:underline"
            >
              Apply this summary
            </button>
            <button
              onClick={handleAIClick}
              disabled={isGenerating}
              className="text-sm text-gray-500 hover:underline"
            >
              {isGenerating ? "Generating..." : "Regenerate"}
            </button>
            <button
              onClick={() => setGeneratedSummary(null)}
              className="text-sm text-gray-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* AI Suggestion from resume analysis */}
      {aiSuggestions?.professionalSummary && !generatedSummary && (
        <div className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          <div className="flex items-start gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
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
      <div className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
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
      <div className="w-full px-3 py-2.5 bg-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
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