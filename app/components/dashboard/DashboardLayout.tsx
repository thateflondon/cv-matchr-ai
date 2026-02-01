import { useState, type ReactNode, useEffect } from "react";
import { Menu, X, FileText, Edit, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: "resumes" | "builder";
  onTabChange: (tab: "resumes" | "builder") => void;
}

export default function DashboardLayout({
  children,
  activeTab,
  onTabChange,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keep sidebar closed by default, but allow responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { id: "resumes" as const, label: "My Resumes", icon: FileText },
    { id: "builder" as const, label: "Resume Builder", icon: Edit },
    // { id: "applications" as const, label: "Applications", icon: LayoutGrid },
    // { id: "stats" as const, label: "Statistics", icon: BarChart3 },
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <div className={`flex items-center justify-between w-full ${sidebarOpen ? "" : "justify-center"}`}>
            <h2
              className={`font-semibold text-gray-800 whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${
                sidebarOpen ? "w-auto opacity-100 mr-2" : "w-0 opacity-0"
              }`}
            >
              Dashboard
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ease-in-out mb-1 ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                } ${sidebarOpen ? "" : "justify-center"}`}
                title={sidebarOpen ? undefined : tab.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${
                    sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Settings Button - Bottom of sidebar */}
        <div className="p-2 border-t border-gray-200">
          <button
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ease-in-out text-gray-700 hover:bg-gray-100 ${sidebarOpen ? "" : "justify-center"}`}
            title={sidebarOpen ? undefined : "Settings"}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span
              className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${
                sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
              }`}
            >
              Settings
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}