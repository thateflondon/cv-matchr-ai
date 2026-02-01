import type { Route } from "./+types/dashboard";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate, useSearchParams, useParams } from "react-router";
import { useEffect, useState } from "react";
import Footer from "~/components/Footer";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import MyResumesTab from "~/components/dashboard/MyResumesTab";
import BuilderTab from "~/components/dashboard/BuilderTab";
import Breadcrumb, { myResumesBreadcrumb } from "~/components/Breadcrumb";

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
  const { tab } = useParams();
  const [searchParams] = useSearchParams();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  // Determine active tab from URL param
  const activeTab: "resumes" | "builder" = tab === "builder" ? "builder" : "resumes";

  // Redirect /dashboard to /dashboard/myresumes
  useEffect(() => {
    if (!tab) {
      navigate("/dashboard/myresumes", { replace: true });
    }
  }, [tab, navigate]);

  const handleTabChange = (tab: "resumes" | "builder") => {
    if (tab === "builder") {
      navigate("/dashboard/builder");
    } else {
      navigate("/dashboard/myresumes");
    }
  };

  const userName = auth.user?.username;

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/?next=/dashboard/myresumes");
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
    const resumeId = searchParams.get("resume");

    if (activeTab === "builder") {
      // Try to load resume from sessionStorage
      const storedResume = sessionStorage.getItem("improveResume");
      if (storedResume) {
        try {
          const resume = JSON.parse(storedResume) as Resume;
          console.log("🔍 Dashboard - Loading from sessionStorage:", resume);
          console.log("🔍 Dashboard - sessionStorage parsedData:", resume.parsedData);
          setSelectedResume(resume);
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
        }
      }
    }
  }, [activeTab, searchParams, resumes]);
  
  const handleCreateNew = () => {
    setSelectedResume(null);
    navigate("/dashboard/builder");
  };

  const handleImprove = (resume: Resume) => {
    console.log("🔍 Dashboard - handleImprove called with resume:", resume);
    console.log("🔍 Dashboard - resume.parsedData:", resume.parsedData);
    setSelectedResume(resume);
    navigate("/dashboard/builder");
  };

  const handleSaveResume = async (updatedResume: Resume) => {
    // Save logic will be implemented later
    // For now, just update the state
    const updatedResumes = resumes.map((r) =>
      r.id === updatedResume.id ? updatedResume : r
    );
    setResumes(updatedResumes);
    navigate("/dashboard/myresumes");
  };

  const handleBackToResumes = () => {
    setSelectedResume(null);
    navigate("/dashboard/myresumes");
  };
  
  return (
    <main id="app" className={`heros-section relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${activeTab === "builder" ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* Global Navbar - Hidden on builder */}
      {activeTab !== "builder" && <Navbar userName={userName} />}

      {/* Dashboard Content */}
      <div className={activeTab === "builder" ? "h-full" : "pt-[120px]"}>
        {/* Breadcrumb - Hidden on builder */}
        {activeTab !== "builder" && <Breadcrumb items={myResumesBreadcrumb} />}
        <div className={activeTab === "builder" ? "h-full" : ""}>
          <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
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
      {activeTab !== "builder" && <Footer />}
    </main>
  );
}