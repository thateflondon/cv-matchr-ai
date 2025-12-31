import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Match" },
    { name: "description", content: "Resume analyzer for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore(); // Vérifie l'état de chargement et l'authentification
  const navigate = useNavigate(); // permet de naviguer vers la prochaine page
  // const [resumeUrl, setResumeUrl] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const userName = auth.user?.username; // permet de récupérer username via l'object user

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/"); // Si pas authentification on affiche la page login
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      console.log("parsedResumes", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
    console.log("user = ", auth.user);
  }, []);

  return (
    <main id="app" className="bg-[url('/images/bg-large.svg')] bg-cover">
      <div className="app-container">
        {/*Navbar*/}
        <Navbar userName={userName} />
        {/*Navbar End */}
        <section className="main-section">
          {/*Header*/}
          <div className="page-heading py-16">
            <h1>Track your applications and resume ratings</h1>
            {!loadingResumes && resumes?.length === 0 ? (
              <h2>
                No resume found. Upload your first resume to get feedback.
              </h2>
            ) : (
              <h2>Review your submissions and check AI-powered feedback.</h2>
            )}
          </div>
          {/*Header End*/}

          {/*Loading resumes*/}
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            </div>
          )}
          {/*Loading End*/}

          {/*Resume section*/}
          {/*map an array that contains different kind of resume && render if only the is minimum one resume*/}
          {!loadingResumes && resumes?.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes?.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <Link
                to="/upload"
                className="primary-button w-fit text-xl font-semibold"
              >
                Upload Resume
              </Link>
            </div>
          )}
          {/*Resume section end*/}
        </section>
      </div>
      <Footer/>
    </main>
  );
}
