interface ResumeScoreHeroProps {
  score: number;
  previousScore?: number;
}

const ResumeScoreHero = ({ score, previousScore }: ResumeScoreHeroProps) => {
  const getScoreLabel = () => {
    if (score >= 90) return { text: "Outstanding", color: "from-green-600 to-emerald-600" };
    if (score >= 80) return { text: "Excellent", color: "from-blue-600 to-cyan-600" };
    if (score >= 70) return { text: "Very Good", color: "from-blue-500 to-purple-500" };
    if (score >= 60) return { text: "Good", color: "from-purple-500 to-pink-500" };
    if (score >= 50) return { text: "Fair", color: "from-orange-500 to-pink-500" };
    return { text: "Needs Work", color: "from-red-500 to-orange-500" };
  };

  const { text: label, color: gradientColor } = getScoreLabel();
  const improvement = previousScore ? score - previousScore : null;

  return (
    <div className={`bg-gradient-to-r ${gradientColor} p-[2px] rounded-3xl shadow-lg`}>
      <div className="bg-white rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Score Display */}
          <div className="relative">
            <div className={`text-6xl sm:text-7xl md:text-8xl bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent animate-in fade-in duration-1000`}>
              {score}
            </div>
            <div className="absolute -top-2 -right-2 sm:-right-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full max-sm:text-xs">
                /100
              </div>
            </div>
          </div>

          {/* Label */}
          <div className={`text-xl sm:text-2xl bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
            {label}
          </div>

          {/* Improvement Badge */}
          {improvement !== null && improvement !== 0 && (
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full ${
              improvement > 0 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <svg 
                className={`w-4 h-4 ${improvement > 0 ? '' : 'rotate-180'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="max-sm:text-sm">
                {improvement > 0 ? '+' : ''}{improvement} points from last version
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-600 max-w-md max-sm:text-sm">
            Your overall resume score based on ATS compatibility, content quality, structure, and professional presentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeScoreHero;