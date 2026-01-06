import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import HeroSection from "~/components/HeroSection";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import Features from "~/components/Features";
import HowItWorks from "~/components/HowItWorks";
import CTA from "~/components/CTA";
import AuthModal from "~/components/AuthModal";

export const meta = () => [
  { title: "CVMatch | AI-Powered Resume Analysis" },
  { name: "description", content: "Optimize your resume for ATS systems and land more interviews with AI-powered feedback" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Extract the 'next' parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get('next') || '/upload';

  // Redirect to next page when authenticated
  useEffect(() => {
    if (auth.isAuthenticated && showAuthModal) {
      setTimeout(() => {
        setShowAuthModal(false);
        navigate(next);
      }, 1500);
    }
  }, [auth.isAuthenticated, showAuthModal, next, navigate]);

  const userName = auth.user?.username;

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <main
        id="app"
        className="heros-section relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
        <div className="app-container auth">
          <Navbar userName={userName} onAuthRequired={handleAuthRequired} />
          <HeroSection onAuthRequired={handleAuthRequired} />
          <Features />
          <HowItWorks />
          <CTA onAuthRequired={handleAuthRequired} />
        </div>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </main>

      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        isLoading={isLoading}
        isAuthenticated={auth.isAuthenticated}
        onSignIn={auth.signIn}
        onSignOut={auth.signOut}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Auth;