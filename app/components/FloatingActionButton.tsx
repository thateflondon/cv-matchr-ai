import { Upload } from 'lucide-react';
import { Link } from 'react-router';

interface FloatingActionButtonProps {
  show?: boolean;
}

const FloatingActionButton = ({ show = true }: FloatingActionButtonProps) => {
  if (!show) return null;

  return (
    <Link to="/upload">
      <button 
        className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all duration-300 animate-bounce"
        aria-label="Upload new resume"
      >
        <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </Link>
  );
};

export default FloatingActionButton;