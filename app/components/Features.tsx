import { Target, Zap, Shield, TrendingUp } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Target,
      title: "Precise ATS Scoring",
      description:
        "Get an accurate score showing how well your resume matches the job description and ATS requirements.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description:
        "Upload your resume and job description to get real-time feedback in under 30 seconds.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Keyword Optimization",
      description:
        "Discover missing keywords and skills that ATS systems are looking for in your resume.",
      gradient: "from-pink-500 to-pink-600",
    },
    {
      icon: TrendingUp,
      title: "Actionable Insights",
      description:
        "Receive specific recommendations to improve your resume score and increase interview chances.",
      gradient: "from-indigo-500 to-indigo-600",
    },
  ];
  return (
    <div className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl mb-4 text-gray-900">
            Why Choose CVMatch?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Most resumes never reach human eyes. Make sure yours passes the ATS
            test.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index)=>{                
                return(
                    <div key={index} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                            <feature.icon className="w-6 h-6 text-white"/>
                        </div>
                        <h3 className="text-xl mb-3 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Features;
