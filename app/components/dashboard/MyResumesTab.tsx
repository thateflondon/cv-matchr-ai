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
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-gray-600 mt-2">
                {resumes.length === 0
                  ? "No resumes found. Create your first resume to get started."
                  : "Manage and improve your resumes with AI-powered feedback."}
              </p>
            </div>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New CV
            </button>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}

        {/* Empty State */}
        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Start by creating a new CV from scratch or upload an existing one
              to get AI-powered feedback.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onCreateNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create New CV
              </button>
              <Link
                to="/upload"
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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