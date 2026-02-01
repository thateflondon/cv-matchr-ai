import { Link } from "react-router";
import { ChevronRight, Home, FileText, Upload, LayoutDashboard, type LucideIcon } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <nav className="flex items-center space-x-2 text-sm sm:text-base">
          <Link
            to="/"
            className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-purple-600 transition-colors group"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {items.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === items.length - 1;

            return (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />

                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-purple-600 transition-colors group"
                  >
                    {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />}
                    <span className="max-sm:text-sm">{item.label}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2 text-purple-600">
                    {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span className="max-sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">{item.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;

// Pre-configured breadcrumbs for common pages
export const uploadBreadcrumb: BreadcrumbItem[] = [
  { label: "Upload Resume", icon: Upload }
];

export const dashboardBreadcrumb: BreadcrumbItem[] = [
  { label: "Dashboard", icon: LayoutDashboard }
];

export const myResumesBreadcrumb: BreadcrumbItem[] = [
  { label: "Dashboard", href: "/dashboard/myresumes", icon: LayoutDashboard },
  { label: "My Resumes", icon: FileText }
];

export const builderBreadcrumb: BreadcrumbItem[] = [
  { label: "Dashboard", href: "/dashboard/myresumes", icon: LayoutDashboard },
  { label: "Resume Builder", icon: FileText }
];

export const resumeAnalysisBreadcrumb: BreadcrumbItem[] = [
  { label: "Dashboard", href: "/dashboard/myresumes", icon: LayoutDashboard },
  { label: "Resume Analysis", icon: FileText }
];
