import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl! mb-6 text-white!">
          Ready to Beat the ATS?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of job seekers who have improved their resume scores
          and landed more interviews.
        </p>

        <button className="group bg-white text-purple-600 px-10 py-5 rounded-full hover:shadow-2xl transition-all inline-flex items-center gap-3">
          <span>Start Free Analysis</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-blue-100 mt-6">
          No credit card required • Get results in 30 seconds
        </p>
      </div>
    </div>
  );
};

export default CTA;
