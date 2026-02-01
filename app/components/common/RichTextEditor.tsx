import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link2,
  Type,
  Sparkles,
  Loader2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  showAIButton?: boolean;
  onAIClick?: () => void;
  isAILoading?: boolean;
  showCharacterCount?: boolean;
  minCharacters?: number;
  maxCharacters?: number;
  recruiterTip?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = "120px",
  showAIButton = false,
  onAIClick,
  isAILoading = false,
  showCharacterCount = false,
  minCharacters = 0,
  maxCharacters = 1000,
  recruiterTip,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Set initial content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const changeTextColor = (color: string) => {
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  // Strip HTML tags for character count
  const stripHTML = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const charCount = stripHTML(value || "").length;

  const toolbarButtons = [
    { icon: Bold, command: "bold", label: "Bold" },
    { icon: Italic, command: "italic", label: "Italic" },
    { icon: Underline, command: "underline", label: "Underline" },
    { icon: Strikethrough, command: "strikeThrough", label: "Strikethrough" },
    { icon: List, command: "insertUnorderedList", label: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", label: "Numbered List" },
  ];

  const colors = [
    "#000000",
    "#FF0000",
    "#0000FF",
    "#008000",
    "#FFA500",
    "#800080",
  ];

  return (
    <div className="w-full space-y-2">
      {/* Toolbar */}
      <div
        className={`flex items-center gap-1 p-2 border-b transition-colors ${
          isFocused
            ? "bg-input-background border-primary/20"
            : "bg-muted/50 border-border"
        }`}
        style={{ borderRadius: "var(--radius) var(--radius) 0 0" }}
      >
        {toolbarButtons.map((button) => (
          <button
            key={button.command}
            type="button"
            onClick={() => execCommand(button.command)}
            className="p-2 hover:bg-secondary rounded transition-colors"
            title={button.label}
            aria-label={button.label}
          >
            <button.icon className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-secondary rounded transition-colors"
          title="Insert Link"
          aria-label="Insert Link"
        >
          <Link2 className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Text Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 hover:bg-secondary rounded transition-colors"
            title="Text Color"
            aria-label="Text Color"
          >
            <Type className="w-4 h-4 text-muted-foreground" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-popover border border-border rounded-lg shadow-lg z-10 flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => changeTextColor(color)}
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {showAIButton && onAIClick && (
          <button
            type="button"
            onClick={onAIClick}
            disabled={isAILoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-70"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            {isAILoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isAILoading ? "Generating..." : "Get help with writing"}
            </span>
          </button>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full p-4 outline-none transition-colors ${
          isFocused ? "bg-input-background" : "bg-input-background"
        }`}
        style={{
          minHeight,
          borderRadius: "0 0 var(--radius) var(--radius)",
          border: "1px solid",
          borderColor: isFocused
            ? "var(--color-primary)"
            : "var(--color-border)",
          borderTop: "none",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Character Count & Recruiter Tip */}
      {showCharacterCount && (
        <div className="flex items-center justify-between text-sm">
          {recruiterTip && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>💡</span>
              <span>{recruiterTip}</span>
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span
              className={`font-medium ${
                charCount < minCharacters
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              {charCount} / {minCharacters}+
            </span>
          </div>
        </div>
      )}

      <style>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--color-muted-foreground);
          pointer-events: none;
        }
        
        [contentEditable] a {
          color: var(--color-primary);
          text-decoration: underline;
        }
        
        [contentEditable] ul,
        [contentEditable] ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        [contentEditable] ul {
          list-style-type: disc;
        }
        
        [contentEditable] ol {
          list-style-type: decimal;
        }
        
        [contentEditable] li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}