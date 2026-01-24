import { GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  description?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isDraggable?: boolean;
  dragHandleProps?: any;
  actions?: ReactNode;
}

export default function SectionHeader({
  title,
  icon,
  description,
  isCollapsed = false,
  onToggle,
  isDraggable = false,
  dragHandleProps,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        {isDraggable && (
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        )}

        {/* Icon */}
        {icon && <div className="text-primary">{icon}</div>}

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground flex-1">{title}</h3>

        {/* Collapse Toggle */}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{isCollapsed ? "Open all" : "Close all"} {title}</span>
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Custom Actions */}
        {actions}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground pl-8">{description}</p>
      )}
    </div>
  );
}
