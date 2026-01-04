import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import HeroSection from "~/components/HeroSection";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import Features from "~/components/Features";
import HowItWorks from "~/components/HowItWorks";
import CTA from "~/components/CTA";

export const meta = () => [
  { title: "CV Match | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore(); // Vérifie l'état de chargement et l'authentification
  const location = useLocation(); // Page sur laquelle on se situe
  const next = location.search.split("next=")[1]; // identifie la prochaine page
  const navigate = useNavigate(); // permet de naviguer vers la prochaine page

  useEffect(() => {
    // Si authentification OK affiche la prochaine page prévue
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  const userName = auth.user?.username;

  return (
    <>
      <main
        id="app"
        className="heros-section relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
        <div className="app-container auth">
          <Navbar userName={userName} />
          <HeroSection />
          <Features />
          <HowItWorks />
          <CTA />
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Auth;
