import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "~/constants";
import {resume} from "react-dom/server";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Matchr AI" },
    { name: "description", content: "Resume analyzer for your dream job!" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      {/*Navbar*/}
      <Navbar/>
      {/*Navbar End */}
    <section className="main-section">
        <div className="page-heading">
            <h1>Track your applications and Resume Ratings</h1>
            <h2>Review your submissions and check AI-powered feedback</h2>
        </div>
    </section>

      {/*map an array that contains different kind of resume && render if only the is minimum one resume*/}
      {resumes.length > 0 && (
          <div className="resumes-section">
              {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume}/>
              ))}
          </div>
      )}
  </main>
}
