import React, { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/constants";
import Footer from "~/components/Footer";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatustext] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    // File upload
    setStatustext("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatustext("Error: Failed to upload file");

    // File conversion to image
    setStatustext("Converting file to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatustext("Error: Failed to convert PDF to image");

    // Image upload
    setStatustext("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatustext("Error: Failed to upload image");

    // Data analysis
    setStatustext("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatustext("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatustext("Error: Failed to analyse resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatustext(`Analysis complete, redirecting...`);
    console.log("data", data);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  const userName = auth.user?.username;

  return (
    <>
      <main id="app" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="app-container">
          <Navbar userName={userName} />
          <section className="main-section">
            <div className="page-heading py-16">
              <h1>Smart feedback for your dream job</h1>
              {isProcessing ? (
                <>
                  <h2>{statusText}</h2>
                  <img src="/images/resume-scan.gif" className="w-full" />
                </>
              ) : (
                <h2>Drop your resume for an ATS score and improvement tips</h2>
              )}
              {!isProcessing && (
                <form
                  id="upload-form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 mt-8 px-4"
                >
                  <div className="form-div">
                    <label htmlFor="company-name">Company Name</label>
                    <input
                      type="text"
                      name="company-name"
                      placeholder="Company Name"
                      id="company-name"
                    />
                  </div>
                  <div className="form-div">
                    <label htmlFor="job-title">Job Title</label>
                    <input
                      type="text"
                      name="job-title"
                      placeholder="Job Title"
                      id="job-title"
                    />
                  </div>
                  <div className="form-div">
                    <label htmlFor="job-description">Job Description</label>
                    <textarea
                      rows={5}
                      name="job-description"
                      placeholder="Job Description"
                      id="job-description"
                    />
                  </div>
                  <div className="form-div">
                    <label htmlFor="uploader">Upload Resume</label>
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>
                  <button className="primary-button" type="submit">
                    Analyze Resume
                  </button>
                </form>
              )}
            </div>
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
};

export default Upload;