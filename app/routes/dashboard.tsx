import type { Route } from "./+types/dashboard";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Footer from "~/components/Footer";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import MyResumesTab from "~/components/dashboard/MyResumesTab";
import BuilderTab from "~/components/dashboard/BuilderTab";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Match | Dashboard" },
    {
      name: "description",
      content: "Resume analyzer for your dream job!",
    },
  ];
}

export default function Dashboard() {
  const { auth, kv, isLoading } = usePuterStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [activeTab, setActiveTab] = useState<"resumes" | "builder">("resumes");
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const userName = auth.user?.username;

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/?next=/dashboard");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list(
        "resume:*",
        true,
      )) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume,
      );

      console.log("parsedResumes", parsedResumes);
      console.log("🔍 First resume parsedData:", parsedResumes?.[0]?.parsedData);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
    console.log("user = ", auth.user);
  }, [auth.isAuthenticated]);

  // Handle URL parameters for opening builder with resume
  useEffect(() => {
    const tab = searchParams.get("tab");
    const resumeId = searchParams.get("resume");
    
    if (tab === "builder") {
      // Try to load resume from sessionStorage
      const storedResume = sessionStorage.getItem("improveResume");
      if (storedResume) {
        try {
          const resume = JSON.parse(storedResume) as Resume;
          console.log("🔍 Dashboard - Loading from sessionStorage:", resume);
          console.log("🔍 Dashboard - sessionStorage parsedData:", resume.parsedData);
          setSelectedResume(resume);
          setActiveTab("builder");
          // Clear sessionStorage after loading
          sessionStorage.removeItem("improveResume");
        } catch (error) {
          console.error("Failed to parse stored resume:", error);
        }
      } else if (resumeId) {
        // Try to find resume in loaded resumes
        const resume = resumes.find((r) => r.id === resumeId);
        if (resume) {
          console.log("🔍 Dashboard - Loading from resumes array:", resume);
          console.log("🔍 Dashboard - resumes array parsedData:", resume.parsedData);
          setSelectedResume(resume);
          setActiveTab("builder");
        }
      }
    }
  }, [searchParams, resumes]);
  
  const handleCreateNew = () => {
    setSelectedResume(null);
    setActiveTab("builder");
  };

  const handleImprove = (resume: Resume) => {
    console.log("🔍 Dashboard - handleImprove called with resume:", resume);
    console.log("🔍 Dashboard - resume.parsedData:", resume.parsedData);
    setSelectedResume(resume);
    setActiveTab("builder");
  };

  const handleSaveResume = async (updatedResume: Resume) => {
    // Save logic will be implemented later
    // For now, just update the state
    const updatedResumes = resumes.map((r) =>
      r.id === updatedResume.id ? updatedResume : r
    );
    setResumes(updatedResumes);
    setActiveTab("resumes");
  };

  const handleBackToResumes = () => {
    setSelectedResume(null);
    setActiveTab("resumes");
  };
  
  return (
    <main id="app" className="heros-section relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <div className="flex flex-col h-screen">
      {/* Global Navbar */}
      <Navbar userName={userName} />
      
      {/* Dashboard Content */}
      <div className="flex-1 overflow-hidden">
        <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === "resumes" && (
            <MyResumesTab
              resumes={resumes}
              loadingResumes={loadingResumes}
              onCreateNew={handleCreateNew}
              onImprove={handleImprove}
            />
          )}
          {activeTab === "builder" && (
            <BuilderTab
              resume={selectedResume}
              onSave={handleSaveResume}
              onBack={handleBackToResumes}
            />
          )}
        </DashboardLayout>
      </div>
    </div>
    <Footer/>
    </main>
  );
}