interface AuthModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onClose?: () => void;
}

const AuthModal = ({ isOpen, isLoading, isAuthenticated, onSignIn, onSignOut, onClose }: AuthModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
      ></div>

      {/* Modal */}
      <div 
        className="relative gradient-border shadow-2xl animate-in zoom-in duration-300 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-[3%] right-[4%] z-10 w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <section className="flex flex-col gap-6 sm:gap-8 bg-white rounded-2xl p-6 sm:p-10">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-16 sm:h-16 bg-transparent rounded-2xl flex items-center justify-center">
              <img src="/public/icons/logo.png" alt="logo CVMatch" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to CVMatch
            </h1>
            <h2 className="text-sm sm:text-base text-gray-600">
              {isAuthenticated 
                ? "You're logged in and ready to go!" 
                : "Log in to start analyzing your resume"
              }
            </h2>
          </div>

          {/* Auth Button */}
          <div>
            {isLoading ? (
              <button className="auth-button login animate-pulse" disabled>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg md:text-base sm:text-sm">Signing you in...</span>
                </div>
              </button>
            ) : (
              <>
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <button 
                      className="auth-button login bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      disabled
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg md:text-base sm:text-sm">Connected</span>
                      </div>
                    </button>
                    <button 
                      className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                      onClick={onSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button className="auth-button login" onClick={onSignIn}>
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-lg md:text-base sm:text-sm">Log In with Puter</span>
                    </div>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Info Text */}
          {!isAuthenticated && (
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500">
                Don't have an account?{" "}
                <button 
                  className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                  onClick={onSignIn}
                >
                  Create one now
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Powered by Puter - Secure cloud authentication
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AuthModal;