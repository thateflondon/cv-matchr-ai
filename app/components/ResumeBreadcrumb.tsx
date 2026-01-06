import { Link } from "react-router";
import { ChevronRight, Home, FileText } from "lucide-react";

interface ResumeBreadcrumbProps {
  resumeId?: string;
}

const ResumeBreadcrumb = ({ resumeId }: ResumeBreadcrumbProps) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <nav className="flex items-center space-x-2 text-sm sm:text-base">
          <Link 
            to="/" 
            className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-purple-600 transition-colors group"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          
          <div className="flex items-center gap-1 sm:gap-2 text-purple-600">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="max-sm:text-sm">Resume Analysis</span>
          </div>
          
          {resumeId && (
            <>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden md:block" />
              <span className="text-gray-400 truncate max-w-[100px] sm:max-w-[150px] hidden md:block">
                {resumeId}
              </span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default ResumeBreadcrumb;
