import { useState } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import ResumeCard from "~/components/ResumeCard";

interface MyResumesTabProps {
  resumes: Resume[];
  loadingResumes: boolean;
  onCreateNew: () => void;
  onImprove: (resume: Resume) => void;
}

export default function MyResumesTab({
  resumes,
  loadingResumes,
  onCreateNew,
  onImprove,
}: MyResumesTabProps) {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#4DA3FF] via-[#7A5CFF] to-[#9B5CFF] bg-clip-text text-transparent mb-2">
            My Resumes
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {resumes.length === 0
              ? "No resumes found. Create your first resume to get started."
              : "Manage and improve your resumes with AI-powered feedback."}
          </p>
        </div>

        {/* Loading State */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="/images/resume-scan-2.gif"
              alt="Loading resumes"
              className="w-[200px]"
            />
            <p className="text-gray-600 mt-4">Loading your resumes...</p>
          </div>
        )}

        {/* Resumes Grid */}
        {!loadingResumes && resumes.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {resumes.map((resume) => (
                <div key={resume.id} className="relative">
                  <ResumeCard resume={resume} />
                  <button
                    onClick={() => onImprove(resume)}
                    className="absolute top-4 right-4 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Improve
                  </button>
                </div>
              ))}
            </div>
            
            {/* Create New Button Below Cards */}
            <div className="flex justify-center">
              <button
                onClick={onCreateNew}
                className="primary-button flex items-center justify-center gap-2 w-full sm:w-1/2 max-w-md"
                style={{ margin: "2% auto", cursor: "pointer" }}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Create New Resume</span>
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 primary-gradient rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Plus className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-600 mb-6 text-center max-w-md text-sm sm:text-base px-4">
              Start by creating a new resume from scratch or upload an existing one
              to get AI-powered feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full px-4 sm:w-auto">
              <button
                onClick={onCreateNew}
                className="primary-button px-6 py-3 w-full sm:w-auto"
              >
                Create New Resume
              </button>
              <Link
                to="/upload"
                className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-full hover:bg-primary/5 transition-all font-medium text-center w-full sm:w-auto"
              >
                Upload Resume
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}