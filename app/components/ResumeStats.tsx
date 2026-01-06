interface ResumeStatsProps {
  yourScore: number;
  averageScore?: number;
  percentile?: number;
}

const ResumeStats = ({ yourScore, averageScore = 65, percentile }: ResumeStatsProps) => {
  // Calculate percentile if not provided
  const calculatedPercentile = percentile || Math.min(Math.round((yourScore / 100) * 100), 99);
  
  const stats = [
    {
      value: yourScore,
      label: "Your Score",
      gradient: "from-purple-600 to-pink-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      value: averageScore,
      label: "Platform Average",
      gradient: "from-blue-600 to-cyan-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      value: `Top ${100 - calculatedPercentile}%`,
      label: "Your Ranking",
      gradient: "from-pink-600 to-orange-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      <h3 className="max-sm:text-lg max-md:text-xl text-2xl mb-4 sm:mb-6">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Background Gradient Blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r ${stat.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`}></div>
            
            <div className="relative">
              {/* Icon */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              
              {/* Value */}
              <div className={`text-3xl sm:text-4xl bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-gray-600 max-sm:text-sm">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Bar */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Comparison</span>
          <span className="text-sm font-medium text-gray-700">
            {yourScore > averageScore 
              ? `${yourScore - averageScore} points above average` 
              : yourScore < averageScore 
                ? `${averageScore - yourScore} points below average`
                : 'At average level'
            }
          </span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`absolute h-full bg-gradient-to-r ${yourScore > averageScore ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-pink-500'} rounded-full transition-all duration-1000`}
            style={{ width: `${Math.min(yourScore, 100)}%` }}
          ></div>
          <div 
            className="absolute h-full w-1 bg-blue-600"
            style={{ left: `${averageScore}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-blue-600 whitespace-nowrap">
              Avg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeStats;