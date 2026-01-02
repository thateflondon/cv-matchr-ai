import { ArrowRight, Upload } from "lucide-react";
import logo from "public/icons/logo.png"

const HeroSection = () => {
  return (
    <div className="heros-section relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
        <div className="text-center">
          {/* <div className="flex justify-center mb-8">
            <img src={logo} alt="CVMatch Logo" className="h-16 sm:h-20" />
          </div> */}

          <h1 className="text-4xl sm:text-6xl mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Beat the ATS, Land the Interview
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Get your resume ATS score instantly and optimize it for any job
            description. Don't let robots reject your application before humans
            see it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              Check Your ATS Score
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="text-gray-700 px-8 py-4 rounded-full border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 transition-all cursor-pointer">
              See How It Works
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-gray-600">ATS Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                &lt;30s
              </div>
              <div className="text-gray-600">Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                100k+
              </div>
              <div className="text-gray-600">Resumes Analyzed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default HeroSection;
