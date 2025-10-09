import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Matchr AI" },
    { name: "description", content: "Resume analyzer for your dream job!" },
  ];
}

export default function Home() {
    const { auth } = usePuterStore(); // Vérifie l'état de chargement et l'authentification
    const navigate = useNavigate(); // permet de naviguer vers la prochaine page

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/'); // Si pas authentification on affiche la page login
    }, [auth.isAuthenticated]);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      {/*Navbar*/}
      <Navbar/>
      {/*Navbar End */}
    <section className="main-section">
        {/*Header*/}
        <div className="page-heading py-16">
            <h1>Track your applications and Resume Ratings</h1>
            <h2>Review your submissions and check AI-powered feedback</h2>
        </div>
        {/*Header End*/}

        {/*Resume section*/}
        {/*map an array that contains different kind of resume && render if only the is minimum one resume*/}
        {resumes.length > 0 && (
            <div className="resumes-section">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume}/>
                ))}
            </div>
        )}
        {/*Resume section end*/}
    </section>
  </main>
}
