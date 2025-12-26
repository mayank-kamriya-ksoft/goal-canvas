import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface EditorHeaderProps {
  boardTitle?: string;
  onTitleChange?: (title: string) => void;
}

export function EditorHeader({ boardTitle = "Untitled Board", onTitleChange }: EditorHeaderProps) {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(boardTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync editValue when boardTitle changes externally
  useEffect(() => {
    setEditValue(boardTitle);
  }, [boardTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleBack = () => {
    if (user) {
      navigate("/my-boards");
    } else {
      navigate("/");
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleSaveTitle = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== boardTitle) {
      onTitleChange?.(trimmed);
    } else {
      setEditValue(boardTitle); // Reset to original if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setEditValue(boardTitle);
      setIsEditing(false);
    }
  };

  return (
    <header className="h-12 bg-surface border-b border-border flex items-center justify-between px-4">
      {/* Left: Back button + Logo */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">V</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">VisionBoard</span>
        </Link>
      </div>

      {/* Center: Board Title */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              className="h-7 w-48 text-sm font-medium text-center"
              maxLength={50}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleSaveTitle}
            >
              <Check className="h-3.5 w-3.5 text-primary" />
            </Button>
          </div>
        ) : (
          <button
            onClick={handleStartEditing}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-secondary/50 transition-colors group"
          >
            <span className="text-sm font-medium text-foreground max-w-[200px] truncate">
              {boardTitle}
            </span>
            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Right: User menu or Auth buttons */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
