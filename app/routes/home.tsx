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
    <>
      <main
        id="app"
        className="heros-section relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
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
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </main>
      <Footer />
    </>
  );
}
