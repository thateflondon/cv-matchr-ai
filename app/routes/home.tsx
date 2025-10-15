import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Matchr AI" },
    { name: "description", content: "Resume analyzer for your dream job!" },
  ];
}

export default function Home() {
    const { auth, kv } = usePuterStore(); // Vérifie l'état de chargement et l'authentification
    const navigate = useNavigate(); // permet de naviguer vers la prochaine page
    // const [resumeUrl, setResumeUrl] = useState("");
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/'); // Si pas authentification on affiche la page login
    }, [auth.isAuthenticated]);

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            const resumes = (await kv.list('resume:*', true)) as KVItem[];

            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))

            console.log("parsedResumes", parsedResumes);
            setResumes(parsedResumes || []);
            setLoadingResumes(false);
        }
        loadResumes();

    }, []);

  return (<main className="bg-[url('/images/bg-main.svg')] bg-cover">
      {/*Navbar*/}
      <Navbar/>
      {/*Navbar End */}
    <section className="main-section">
        {/*Header*/}
        <div className="page-heading py-16">
            <h1>Track your applications and Resume Ratings</h1>
            {!loadingResumes && resumes?.length === 0 ? (
                <h2>No resumes found. Upload your first resume to get feedback.</h2>
            ): (
                <h2>Review your submissions and check AI-powered feedback.</h2>
            )}
        </div>
        {/*Header End*/}

        {/*Resume section*/}
        {/*map an array that contains different kind of resume && render if only the is minimum one resume*/}
        {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume}/>
                ))}
            </div>
        )}
        {/*Resume section end*/}
    </section>
  </main>)
}
