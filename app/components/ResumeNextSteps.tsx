import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface NextStep {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  category: string;
  impact: string;
}

interface ResumeNextStepsProps {
  feedback: Feedback;
}

const ResumeNextSteps = ({ feedback }: ResumeNextStepsProps) => {
  // Generate prioritized steps based on feedback
  const generateSteps = (): NextStep[] => {
    const steps: NextStep[] = [];

    // Check ATS score
    if (feedback.ATS.score < 70) {
      steps.push({
        priority: 'high',
        title: 'Improve ATS Compatibility',
        description: 'Add industry-specific keywords and ensure your resume format is ATS-friendly.',
        category: 'ATS Optimization',
        impact: '+15-20 points'
      });
    }

    // Check content score
    if (feedback.content.score < 70) {
      steps.push({
        priority: 'high',
        title: 'Enhance Content Quality',
        description: 'Strengthen your achievements with quantifiable results and action verbs.',
        category: 'Content',
        impact: '+10-15 points'
      });
    }

    // Check structure score
    if (feedback.structure.score < 70) {
      steps.push({
        priority: 'medium',
        title: 'Optimize Resume Structure',
        description: 'Improve section organization, bullet point formatting, and overall layout.',
        category: 'Structure',
        impact: '+8-12 points'
      });
    }

    // Check tone and style
    if (feedback.toneAndStyle.score < 70) {
      steps.push({
        priority: 'medium',
        title: 'Refine Tone & Style',
        description: 'Ensure professional language and consistent formatting throughout.',
        category: 'Style',
        impact: '+5-10 points'
      });
    }

    // Check skills
    if (feedback.skills.score < 70) {
      steps.push({
        priority: 'medium',
        title: 'Highlight Relevant Skills',
        description: 'Add technical skills, certifications, and tools relevant to your target role.',
        category: 'Skills',
        impact: '+8-12 points'
      });
    }

    // Always add general improvement step
    steps.push({
      priority: 'low',
      title: 'Polish and Proofread',
      description: 'Review for typos, grammatical errors, and ensure consistency in dates and formatting.',
      category: 'Final Touch',
      impact: '+3-5 points'
    });

    return steps;
  };

  const steps = generateSteps();

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bg: 'bg-red-50',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          badge: 'bg-red-100 text-red-700'
        };
      case 'medium':
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-700'
        };
      default:
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-700'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="max-sm:text-lg max-md:text-xl text-2xl mb-2">Recommended Next Steps</h3>
        <p className="text-gray-600 max-sm:text-sm">
          Follow these steps to improve your resume score and increase your chances of landing interviews.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {steps.map((step, index) => {
          const config = getPriorityConfig(step.priority);
          
          return (
            <div 
              key={index}
              className={`rounded-xl p-4 sm:p-5 border-2 ${config.border} ${config.bg} transition-all duration-300 hover:shadow-md group`}
            >
              <div className="flex gap-3 sm:gap-4">
                {/* Step Number */}
                <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${config.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className={`max-sm:text-sm font-semibold ${config.iconColor}`}>
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h4 className="max-sm:text-base text-lg text-gray-900">
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs ${config.badge}`}>
                        {step.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 max-sm:text-sm">
                    {step.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Category:</span>
                      <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded-full">
                        {step.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Expected Impact:</span>
                      <span className="text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {step.impact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Icon */}
                <div className={`hidden sm:flex flex-shrink-0 w-10 h-10 rounded-lg ${config.iconBg} items-center justify-center ${config.iconColor}`}>
                  {config.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h4 className="max-sm:text-base text-lg mb-1">Ready to Level Up?</h4>
            <p className="text-purple-100 text-sm max-sm:text-xs">
              Implement these suggestions and re-upload to see your score improve!
            </p>
          </div>
          <button className="bg-white text-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-purple-50 transition-all whitespace-nowrap max-sm:text-sm">
            Start Improving
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeNextSteps;