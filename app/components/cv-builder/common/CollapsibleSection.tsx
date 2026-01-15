import type { ReactNode } from "react";
import { useState } from "react";
import { GripVertical, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  isDraggable?: boolean;
  dragHandleProps?: any;
}

export default function CollapsibleSection({
  title,
  children,
  isExpanded = false,
  onToggle,
  onDelete,
  isDraggable = false,
  dragHandleProps,
}: CollapsibleSectionProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
        {/* Drag Handle */}
        {isDraggable && (
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        )}

        {/* Title */}
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center justify-between text-left"
        >
          <span className="font-medium text-foreground">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Delete Button */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {isExpanded && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}
