import { Upload, Search, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Resume",
      description:
        "Simply drag and drop your resume or paste the job description you're targeting.",
      step: "01",
    },
    {
      icon: Search,
      title: "AI Analysis",
      description:
        "Our advanced AI scans your resume against ATS algorithms and job requirements.",
      step: "02",
    },
    {
      icon: CheckCircle,
      title: "Get Your Score",
      description:
        "Receive your ATS score with detailed insights and recommendations for improvement.",
      step: "03",
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to optimize your resume for any job application
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 relative z-10">
                  <step.icon className="w-8 h-8" />
                </div>
                
                <div className="absolute top-0 right-0 text-6xl opacity-10">
                  {step.step}
                </div>
                
                <h3 className="text-2xl mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
