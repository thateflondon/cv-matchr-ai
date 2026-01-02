import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import HeroSection from "~/components/HeroSection";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

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
      <main id="app" className="bg-[url('/images/bg-large.svg')] bg-cover">
      <div className="app-container auth">
        <Navbar userName={userName} />
        <HeroSection />
        {/* <Footer/> */}
      </div>
      </main>
      <Footer/>
    </>
  );
};

export default Auth;
