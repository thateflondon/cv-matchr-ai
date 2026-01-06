import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import ResumeBreadcrumb from "~/components/ResumeBreadcrumb";
import ResumeActionCTA from "~/components/ResumeActionCTA";
import ResumeScoreHero from "~/components/ResumeScoreHero";
import ResumeStats from "~/components/ResumeStats";
import ResumeTimeline from "~/components/ResumeTimeline";
import ResumeNextSteps from "~/components/ResumeNextSteps";
import FloatingActionButton from "~/components/FloatingActionButton";


export const meta = () => ([
    { title: 'CV Match | Resume Analysis'},
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [versions, setVersions] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`)
            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);

            // Load version history (if available)
            const versionHistory = await kv.get(`resume:versions:${auth.user?.username}`);
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
                        improvements: []
                    }
                ]);
            }
        }

        loadResume();

    }, [id]);

    const userName = auth.user?.username;

    const handleUploadNew = () => {
        navigate('/upload');
    };

    const handleDownload = () => {
        if (resumeUrl) {
            const link = document.createElement('a');
            link.href = resumeUrl;
            link.download = `resume-${id}.pdf`;
            link.click();
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Resume Analysis - CVMatch',
                text: `Check out my resume score: ${feedback?.overallScore}/100`,
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
      <>
      <main id="app" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="app-container">
          <Navbar userName={userName} />
          
          {/* Breadcrumb Navigation */}
          <ResumeBreadcrumb resumeId={id} />
          
          <div className="flex flex-row w-full max-lg:flex-col-reverse">
            {/* PDF Preview Section - Sticky on desktop */}
            <section className="feedback-section bg-cover lg:h-[100vh] lg:sticky lg:top-0 items-center justify-center max-lg:py-6">
              {imageUrl && resumeUrl ? (
                <div className="animate-in fade-in duration-1000 gradient-border h-[400px] sm:h-[500px] lg:h-[90%] w-full lg:w-fit">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={imageUrl}
                      className="w-full h-full object-contain rounded-2xl"
                      alt="Resume preview"
                      title="Click to view full resume"
                    />
                  </a>
                </div>
              ) : (
                <div className="gradient-border h-[400px] sm:h-[500px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 max-sm:text-sm">Loading resume...</p>
                  </div>
                </div>
              )}
            </section>
            
            {/* Feedback Section */}
            <section className="feedback-section">
              <h2 className="max-sm:text-2xl max-md:text-3xl text-4xl !text-black mb-6">Resume Analysis</h2>
              
              {feedback ? (
                <div className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-1000">
                  {/* Hero Score Display */}
                  <ResumeScoreHero 
                    score={feedback.overallScore}
                    previousScore={versions.length > 1 ? versions[versions.length - 2]?.score : undefined}
                  />
                  
                  {/* Performance Stats */}
                  <ResumeStats 
                    yourScore={feedback.overallScore}
                    averageScore={65}
                  />

                  {/* Timeline (if multiple versions) */}
                  {versions.length > 1 && (
                    <ResumeTimeline 
                      versions={versions}
                      currentVersionId={id || ''}
                    />
                  )}
                  
                  {/* Action CTA */}
                  <ResumeActionCTA 
                    score={feedback.overallScore}
                    onUploadNew={handleUploadNew}
                    onDownload={handleDownload}
                    onShare={handleShare}
                  />
                  
                  {/* Summary Section */}
                  <Summary feedback={feedback} />
                  
                  {/* ATS Score Section */}
                  <ATS
                    score={feedback.ATS.score || 0}
                    suggestions={feedback.ATS.tips || []}
                  />

                  {/* Next Steps */}
                  <ResumeNextSteps feedback={feedback} />
                  
                  {/* Detailed Feedback */}
                  <Details feedback={feedback} />
                  
                  {/* Bottom CTA */}
                  <div className="bg-white rounded-2xl p-4 sm:p-6 text-center border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                    <div className="max-w-2xl mx-auto">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="max-sm:text-lg max-md:text-xl text-2xl mb-2">Ready to Apply?</h3>
                      <p className="text-gray-600 mb-4 max-sm:text-sm">
                        Make sure to implement the suggestions above before sending your resume to recruiters. 
                        A well-optimized resume can increase your interview chances by up to 3x!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/upload">
                          <button className="primary-button px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto max-sm:text-sm">
                            Upload Improved Version
                          </button>
                        </Link>
                        <button 
                          onClick={handleDownload}
                          className="px-6 sm:px-8 py-2 sm:py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-all w-full sm:w-auto max-sm:text-sm"
                        >
                          Download Current Resume
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-200">
                    <h4 className="max-sm:text-base text-lg mb-3 text-gray-900">💡 Pro Tips</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2 max-sm:text-sm">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Tailor your resume for each job application by matching keywords from the job description</span>
                      </li>
                      <li className="flex items-start gap-2 max-sm:text-sm">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Use action verbs like "achieved," "implemented," and "optimized" to start bullet points</span>
                      </li>
                      <li className="flex items-start gap-2 max-sm:text-sm">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Quantify your achievements with numbers, percentages, or specific outcomes</span>
                      </li>
                      <li className="flex items-start gap-2 max-sm:text-sm">
                        <span className="text-purple-600 mt-1">•</span>
                        <span>Keep your resume to 1-2 pages and use consistent formatting throughout</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <img src="/images/resume-scan-2.gif" className="w-full max-w-md" alt="Scanning resume" />
                  <p className="text-gray-500 mt-4 max-sm:text-sm">Analyzing your resume...</p>
                  <p className="text-gray-400 text-sm mt-2 max-sm:text-xs">This usually takes 10-15 seconds</p>
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
      </>
    );
};

export default Resume;