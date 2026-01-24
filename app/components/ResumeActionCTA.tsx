import { Download, Upload, Share2, FileEdit } from "lucide-react";
import { useNavigate } from "react-router";

interface ResumeActionCTAProps {
  score: number;
  onUploadNew?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const ResumeActionCTA = ({ score, onUploadNew, onDownload, onShare }: ResumeActionCTAProps) => {
  const navigate = useNavigate();
  
  const getMessage = () => {
    if (score > 80) {
      return {
        title: "Excellent Score! 🎉",
        subtitle: "Your resume is ready to impress recruiters. Download and apply with confidence!",
        gradient: "from-green-500 to-emerald-600"
      };
    } else if (score > 60) {
      return {
        title: "Good Progress! 💪",
        subtitle: "You're on the right track. A few improvements could boost your score further.",
        gradient: "from-blue-500 to-purple-600"
      };
    } else {
      return {
        title: "Room for Improvement 📈",
        subtitle: "Don't worry! Use our CV Builder to create an ATS-friendly resume from scratch.",
        gradient: "from-orange-500 to-pink-600"
      };
    }
  };

  const { title, subtitle, gradient } = getMessage();

  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-4 sm:p-6 text-white shadow-lg`}>
      <h3 className="max-sm:text-lg max-md:text-xl text-2xl mb-2">{title}</h3>
      <p className="max-sm:text-sm text-base mb-4 sm:mb-6 text-white/90">{subtitle}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {score < 80 && (
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 bg-white text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-100 transition-all max-sm:text-sm font-medium"
          >
            <FileEdit className="w-4 h-4 sm:w-5 sm:h-5" />
            Create ATS-Friendly CV
          </button>
        )}
        
        <button 
          onClick={onUploadNew}
          className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/30 transition-all max-sm:text-sm"
        >
          <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          Upload New Version
        </button>
        
        <button 
          onClick={onDownload}
          className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/30 transition-all max-sm:text-sm"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          Download PDF
        </button>
        
        <button 
          onClick={onShare}
          className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-white/30 transition-all max-sm:text-sm sm:hidden md:flex"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          Share
        </button>
      </div>
    </div>
  );
};

export default ResumeActionCTA;