import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import Breadcrumb, { resumeAnalysisBreadcrumb } from "~/components/Breadcrumb";
import ResumeTimeline from "~/components/ResumeTimeline";
import FloatingActionButton from "~/components/FloatingActionButton";
import ErrorBoundary from "~/components/common/ErrorBoundary";

export const meta = () => [
  { title: "Resume Match | Resume Analysis" },
  {
    name: "description",
    content: "Detailed overview of your resume",
  },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(
    null,
  );
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);
      
      // Store the full resume data for builder
      setResumeData({
        id: id || "",
        imagePath: data.imagePath,
        resumePath: data.resumePath,
        feedback: data.feedback,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        extractedText: data.extractedText,
        parsedData: data.parsedData,
      });

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], {
        type: "application/pdf",
      });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);

      // Load version history (if available)
      const versionHistory = await kv.get(
        `resume:versions:${auth.user?.username}`,
      );
      if (versionHistory) {
        const parsedVersions = JSON.parse(versionHistory);
        setVersions(parsedVersions);
      } else {
        // Create initial version data
        setVersions([
          {
            id: id,
            score: data.feedback.overallScore,
            date: new Date(),
            improvements: [],
          },
        ]);
      }
    };

    loadResume();
  }, [id]);

  const userName = auth.user?.username;

  const handleUploadNew = () => {
    navigate("/upload");
  };

  const handleDownload = () => {
    if (resumeUrl) {
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = `resume-${id}.pdf`;
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Resume Analysis - CVMatch",
        text: `Check out my resume score: ${feedback?.overallScore}/100`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleStartImproving = () => {
    if (resumeData) {
      // Store resume data in sessionStorage to pass to dashboard
      sessionStorage.setItem('improveResume', JSON.stringify(resumeData));
      // Navigate to dashboard builder tab
      navigate('/dashboard/builder?resume=' + id);
    }
  };

  return (
    <ErrorBoundary>
      <main
        id="app"
        className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen"
      >
        <Navbar userName={userName} />
        <div className="app-container pt-[120px]">

          {/* Breadcrumb Navigation */}
          <Breadcrumb items={resumeAnalysisBreadcrumb} />

          <div className="flex flex-row w-full max-lg:flex-col-reverse">
            {/* PDF Preview Section - Sticky on desktop */}
            <section className="feedback-section bg-cover lg:self-start lg:sticky lg:top-[120px] max-lg:py-6">
              {imageUrl && resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full animate-in fade-in duration-1000"
                >
                  <div className="gradient-border w-full">
                    <img
                      src={imageUrl}
                      className="w-full h-auto rounded-2xl"
                      alt="Resume preview"
                      title="Click to view full resume"
                    />
                  </div>
                </a>
              ) : (
                <div className="gradient-border h-[400px] sm:h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 max-sm:text-sm">
                      Loading resume...
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Feedback Section */}
            <section className="feedback-section analysis">
              <h2 className="max-sm:text-2xl max-md:text-3xl text-4xl !text-black mb-6 text-center">
                Resume Analysis
              </h2>

              {feedback ? (
                <ErrorBoundary>
                  <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-1000">
                    {/* 1. Summary - Overall overview first */}
                    <Summary feedback={feedback} />

                    {/* 2. ATS Score - Key metric */}
                    <ATS
                      score={feedback.ATS.score || 0}
                      suggestions={feedback.ATS.tips || []}
                    />

                    {/* 3. Detailed Feedback - In-depth analysis */}
                    <Details feedback={feedback} />

                    {/* 4. Timeline - Version history (if multiple versions) */}
                    {versions.length > 1 && (
                      <ResumeTimeline
                        versions={versions}
                        currentVersionId={id || ""}
                      />
                    )}

                    {/* 5. Start Improving CTA - Action item */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
                      <div className="max-w-2xl mx-auto text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-3">
                          Apply AI Recommendations Instantly
                        </h3>
                        <p className="text-white/90 mb-6 max-sm:text-sm">
                          Open your resume in our builder with all the AI suggestions pre-filled. Edit, customize, and export your improved resume in minutes!
                        </p>
                        <button
                          onClick={handleStartImproving}
                          className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg w-full sm:w-auto max-sm:text-sm"
                        >
                          Start Improving
                        </button>
                      </div>
                    </div>
                  </div>
                </ErrorBoundary>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <img
                    src="/images/resume-scan-2.gif"
                    className="w-full max-w-md"
                    alt="Scanning resume"
                  />
                  <p className="text-gray-500 mt-4 max-sm:text-sm">
                    Analyzing your resume...
                  </p>
                  <p className="text-gray-400 text-sm mt-2 max-sm:text-xs">
                    This usually takes 10-15 seconds
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating Action Button (Mobile Only) */}
        <FloatingActionButton show={!!feedback} />
      </main>
      <Footer />
    </ErrorBoundary>
  );
};

export default Resume;