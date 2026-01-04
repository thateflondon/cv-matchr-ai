import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";


export const meta = () => ([
    { title: 'CV Match | Auth'},
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    console.log('fct resume');
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    // const [feedback, setFeedback] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        console.log('333');
        const loadResume = async () => {
            console.log('444');

            const resume = await kv.get(`resume:${id}`)
            console.log('resume = ' + resume);
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
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
        }

        loadResume();

    }, [id]);

    const userName = auth.user?.username;

    return (
      // <div>Resume {id}</div>
      <>
      <main id="app" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="app-container">
          <Navbar userName={userName} />
          <nav className="resume-nav">
            <Link to="/" className="back-button">
              <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
              <span className="text-gray-400 text-sm font-semibold">
                Back to Homepage
              </span>
            </Link>
          </nav>
          <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="feedback-section bg-cover h-[100vh] sticky top-0 items-center justify-center">
              {imageUrl && resumeUrl && (
                <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={imageUrl}
                      className="w-full h-full object-contain rounded-2xl"
                      title="resume"
                    />
                  </a>
                </div>
              )}
            </section>
            <section className="feedback-section">
              <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
              {feedback ? (
                <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                  <Summary feedback={feedback} />
                  <ATS
                    score={feedback.ATS.score || 0}
                    suggestions={feedback.ATS.tips || []}
                  />
                  <Details feedback={feedback} />
                </div>
              ) : (
                <img src="/images/resume-scan-2.gif" className="w-full" />
              )}
            </section>
          </div>
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
};

export default Resume;