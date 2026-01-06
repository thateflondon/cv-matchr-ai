import { format } from 'date-fns';

interface ResumeVersion {
  id: string;
  score: number;
  date: Date;
  improvements?: string[];
}

interface ResumeTimelineProps {
  versions: ResumeVersion[];
  currentVersionId: string;
}

const ResumeTimeline = ({ versions, currentVersionId }: ResumeTimelineProps) => {
  if (!versions || versions.length <= 1) return null;

  // Sort versions by date, most recent first
  const sortedVersions = [...versions].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="max-sm:text-lg max-md:text-xl text-2xl">Your Progress Journey</h3>
        <div className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full max-sm:text-xs">
          {versions.length} versions
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Timeline Items */}
        <div className="space-y-6 sm:space-y-8">
          {sortedVersions.map((version, index) => {
            const isCurrent = version.id === currentVersionId;
            const scoreChange = index < sortedVersions.length - 1 
              ? version.score - sortedVersions[index + 1].score 
              : null;

            return (
              <div key={version.id} className="relative pl-16 sm:pl-20">
                {/* Timeline Dot */}
                <div className={`absolute left-3 sm:left-5 -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  isCurrent 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 ring-4 ring-purple-100' 
                    : 'bg-gray-300'
                }`}>
                  {isCurrent && (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Content Card */}
                <div className={`rounded-xl p-4 sm:p-5 transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-md' 
                    : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="max-sm:text-sm text-base font-semibold text-gray-700">
                        Version {sortedVersions.length - index}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-xs">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(version.date, 'MMM dd, yyyy')}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    {/* Score */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {version.score}
                      </span>
                      <span className="text-gray-500">/100</span>
                    </div>

                    {/* Score Change */}
                    {scoreChange !== null && scoreChange !== 0 && (
                      <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full ${
                        scoreChange > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <svg 
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${scoreChange > 0 ? '' : 'rotate-180'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-xs sm:text-sm">
                          {scoreChange > 0 ? '+' : ''}{scoreChange}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Improvements List */}
                  {version.improvements && version.improvements.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {version.improvements.map((improvement, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="max-sm:text-xs">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <div className="text-sm text-gray-600 mb-1">Total Improvement</div>
            <div className="text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              +{sortedVersions[0].score - sortedVersions[sortedVersions.length - 1].score} points
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-sm text-gray-600 mb-1">Time Period</div>
            <div className="text-sm font-medium text-gray-700">
              {format(sortedVersions[sortedVersions.length - 1].date, 'MMM dd')} - {format(sortedVersions[0].date, 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTimeline;