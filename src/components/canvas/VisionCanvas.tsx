import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Rect, Textbox, FabricImage, Shadow } from "fabric";
import { Button } from "@/components/ui/button";
import {
  Type,
  Image as ImageIcon,
  Square,
  Trash2,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Palette,
  Bold,
  Italic,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: number;
  title: string;
  category: string;
  goals: string[];
}

interface VisionCanvasProps {
  onExport?: (dataUrl: string) => void;
  template?: Template | null;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

const PRESET_COLORS = [
  "#2D5A4A", // Primary sage
  "#E07B54", // Accent coral
  "#4A7C9B", // Career blue
  "#7B5AA6", // Education purple
  "#4A9B6D", // Health green
  "#C4A442", // Finance gold
  "#9B5A7C", // Personal pink
  "#333333", // Dark
  "#FFFFFF", // White
];

export function VisionCanvas({ onExport, template }: VisionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeColor, setActiveColor] = useState("#2D5A4A");
  const [hasSelection, setHasSelection] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateLoadedRef = useRef<number | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: "#FAFAF8",
      selection: true,
    });

    // Track selection changes
    fabricCanvas.on("selection:created", () => setHasSelection(true));
    fabricCanvas.on("selection:updated", () => setHasSelection(true));
    fabricCanvas.on("selection:cleared", () => setHasSelection(false));

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Category color mapping
  const getCategoryColors = (category: string) => {
    const colors: Record<string, { primary: string; light: string; accent: string }> = {
      career: { primary: "#4A7C9B", light: "#E8F4F8", accent: "#2D5A4A" },
      education: { primary: "#7B5AA6", light: "#F3EDF8", accent: "#5A3D7A" },
      health: { primary: "#4A9B6D", light: "#E8F5F0", accent: "#2D5A4A" },
      finance: { primary: "#C4A442", light: "#FBF8E8", accent: "#8B7A30" },
      personal: { primary: "#9B5A7C", light: "#F8E8F0", accent: "#7A3D5A" },
    };
    return colors[category] || colors.career;
  };

  // Load template when canvas is ready and template changes
  useEffect(() => {
    if (!canvas || !template || templateLoadedRef.current === template.id) return;
    
    // Mark template as loaded to prevent re-loading
    templateLoadedRef.current = template.id;
    
    // Clear existing content
    canvas.clear();
    canvas.backgroundColor = "#FAFAF8";
    
    const colors = getCategoryColors(template.category);
    
    // Header banner
    const headerBanner = new Rect({
      left: 0,
      top: 0,
      width: CANVAS_WIDTH,
      height: 140,
      fill: colors.primary,
      selectable: false,
    });
    canvas.add(headerBanner);
    
    // Decorative circle on header
    const decorCircle1 = new Rect({
      left: CANVAS_WIDTH - 180,
      top: -40,
      width: 200,
      height: 200,
      fill: "rgba(255,255,255,0.1)",
      rx: 100,
      ry: 100,
      selectable: false,
    });
    canvas.add(decorCircle1);
    
    const decorCircle2 = new Rect({
      left: -60,
      top: 60,
      width: 120,
      height: 120,
      fill: "rgba(255,255,255,0.08)",
      rx: 60,
      ry: 60,
      selectable: false,
    });
    canvas.add(decorCircle2);
    
    // Title on banner
    const title = new Textbox(template.title.toUpperCase(), {
      left: 60,
      top: 45,
      width: CANVAS_WIDTH - 120,
      fontSize: 36,
      fontFamily: "DM Sans, sans-serif",
      fontWeight: "bold",
      fill: "#FFFFFF",
      textAlign: "left",
      editable: true,
      charSpacing: 80,
    });
    canvas.add(title);
    
    // Subtitle
    const subtitle = new Textbox("My Vision for Success", {
      left: 60,
      top: 90,
      width: 400,
      fontSize: 16,
      fontFamily: "DM Sans, sans-serif",
      fill: "rgba(255,255,255,0.8)",
      textAlign: "left",
      editable: true,
    });
    canvas.add(subtitle);
    
    // Goals section title
    const goalsSectionTitle = new Textbox("✨ MY GOALS", {
      left: 60,
      top: 170,
      width: 200,
      fontSize: 14,
      fontFamily: "DM Sans, sans-serif",
      fontWeight: "bold",
      fill: colors.accent,
      textAlign: "left",
      charSpacing: 100,
    });
    canvas.add(goalsSectionTitle);
    
    // Decorative line
    const decorLine = new Rect({
      left: 60,
      top: 195,
      width: 60,
      height: 3,
      fill: colors.primary,
      rx: 2,
      ry: 2,
      selectable: false,
    });
    canvas.add(decorLine);
    
    // Goals grid - 2x2 layout with cards
    const startY = 220;
    const goalWidth = 520;
    const goalHeight = 120;
    const gap = 24;
    const cols = 2;
    const startX = 60;
    
    template.goals.forEach((goal, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (goalWidth + gap);
      const y = startY + row * (goalHeight + gap);
      
      // Goal card background
      const cardBg = new Rect({
        left: x,
        top: y,
        width: goalWidth,
        height: goalHeight,
        fill: "#FFFFFF",
        rx: 16,
        ry: 16,
        shadow: new Shadow({ color: "rgba(0,0,0,0.08)", blur: 12, offsetX: 0, offsetY: 4 }),
        stroke: colors.light,
        strokeWidth: 2,
        selectable: true,
      });
      canvas.add(cardBg);
      
      // Accent bar on left
      const accentBar = new Rect({
        left: x,
        top: y,
        width: 6,
        height: goalHeight,
        fill: colors.primary,
        rx: 3,
        ry: 3,
        selectable: false,
      });
      canvas.add(accentBar);
      
      // Goal number badge
      const numberBadge = new Rect({
        left: x + 24,
        top: y + 20,
        width: 36,
        height: 36,
        fill: colors.light,
        rx: 18,
        ry: 18,
        selectable: false,
      });
      canvas.add(numberBadge);
      
      const numberText = new Textbox(`${index + 1}`, {
        left: x + 24,
        top: y + 28,
        width: 36,
        fontSize: 16,
        fontFamily: "DM Sans, sans-serif",
        fontWeight: "bold",
        fill: colors.primary,
        textAlign: "center",
        selectable: false,
      });
      canvas.add(numberText);
      
      // Goal text
      const goalText = new Textbox(goal, {
        left: x + 76,
        top: y + 30,
        width: goalWidth - 100,
        fontSize: 20,
        fontFamily: "DM Sans, sans-serif",
        fontWeight: "600",
        fill: "#1a1a1a",
        textAlign: "left",
        editable: true,
      });
      canvas.add(goalText);
      
      // "Add details" hint
      const hintText = new Textbox("Click to add details...", {
        left: x + 76,
        top: y + 70,
        width: goalWidth - 100,
        fontSize: 14,
        fontFamily: "DM Sans, sans-serif",
        fill: "#888888",
        textAlign: "left",
        editable: true,
      });
      canvas.add(hintText);
    });
    
    // Footer motivational quote area
    const quoteArea = new Rect({
      left: 60,
      top: CANVAS_HEIGHT - 120,
      width: CANVAS_WIDTH - 120,
      height: 80,
      fill: colors.light,
      rx: 12,
      ry: 12,
      selectable: true,
    });
    canvas.add(quoteArea);
    
    const quoteText = new Textbox('"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt', {
      left: 90,
      top: CANVAS_HEIGHT - 95,
      width: CANVAS_WIDTH - 180,
      fontSize: 16,
      fontFamily: "DM Sans, sans-serif",
      fontStyle: "italic",
      fill: colors.accent,
      textAlign: "center",
      editable: true,
    });
    canvas.add(quoteText);
    
    // Decorative bottom corner elements
    const cornerDecor = new Rect({
      left: CANVAS_WIDTH - 100,
      top: CANVAS_HEIGHT - 100,
      width: 80,
      height: 80,
      fill: colors.primary,
      rx: 40,
      ry: 40,
      opacity: 0.1,
      selectable: false,
    });
    canvas.add(cornerDecor);
    
    canvas.renderAll();
    toast.success(`Template "${template.title}" loaded! ✨`);
  }, [canvas, template]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current || !canvas) return;

    const updateZoom = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth - 48;
      const containerHeight = container.clientHeight - 48;

      const scaleX = containerWidth / CANVAS_WIDTH;
      const scaleY = containerHeight / CANVAS_HEIGHT;
      const newZoom = Math.min(scaleX, scaleY, 1);

      setZoom(newZoom);
      canvas.setZoom(newZoom);
      canvas.setDimensions({
        width: CANVAS_WIDTH * newZoom,
        height: CANVAS_HEIGHT * newZoom,
      });
    };

    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, [canvas]);

  const addText = useCallback(() => {
    if (!canvas) return;

    const text = new Textbox("Your Goal Here", {
      left: CANVAS_WIDTH / 2 - 100,
      top: CANVAS_HEIGHT / 2 - 20,
      width: 200,
      fontSize: 24,
      fontFamily: "DM Sans, sans-serif",
      fill: activeColor,
      textAlign: "center",
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    toast.success("Text added! Double-click to edit.");
  }, [canvas, activeColor]);

  const addShape = useCallback(() => {
    if (!canvas) return;

    const rect = new Rect({
      left: CANVAS_WIDTH / 2 - 75,
      top: CANVAS_HEIGHT / 2 - 75,
      width: 150,
      height: 150,
      fill: activeColor,
      rx: 12,
      ry: 12,
      opacity: 0.8,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    toast.success("Shape added!");
  }, [canvas, activeColor]);

  // Apply color to selected objects
  const applyColorToSelection = useCallback((color: string) => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      setActiveColor(color);
      return;
    }
    
    activeObjects.forEach((obj) => {
      if (obj.type === "textbox" || obj.type === "text" || obj.type === "i-text") {
        obj.set("fill", color);
      } else {
        obj.set("fill", color);
      }
    });
    
    canvas.renderAll();
    setActiveColor(color);
    toast.success("Color applied!");
  }, [canvas]);

  // Change font size of selected text
  const changeFontSize = useCallback((delta: number) => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    let changed = false;
    
    activeObjects.forEach((obj) => {
      if (obj.type === "textbox" || obj.type === "text" || obj.type === "i-text") {
        const currentSize = (obj as Textbox).fontSize || 24;
        const newSize = Math.max(8, Math.min(120, currentSize + delta));
        (obj as Textbox).set("fontSize", newSize);
        changed = true;
      }
    });
    
    if (changed) {
      canvas.renderAll();
      toast.success("Font size updated!");
    } else {
      toast.error("Select text to change size");
    }
  }, [canvas]);

  // Toggle bold on selected text
  const toggleBold = useCallback(() => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    let changed = false;
    
    activeObjects.forEach((obj) => {
      if (obj.type === "textbox" || obj.type === "text" || obj.type === "i-text") {
        const textObj = obj as Textbox;
        const currentWeight = textObj.fontWeight;
        textObj.set("fontWeight", currentWeight === "bold" ? "normal" : "bold");
        changed = true;
      }
    });
    
    if (changed) {
      canvas.renderAll();
      toast.success("Text style updated!");
    } else {
      toast.error("Select text to toggle bold");
    }
  }, [canvas]);

  // Toggle italic on selected text
  const toggleItalic = useCallback(() => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    let changed = false;
    
    activeObjects.forEach((obj) => {
      if (obj.type === "textbox" || obj.type === "text" || obj.type === "i-text") {
        const textObj = obj as Textbox;
        const currentStyle = textObj.fontStyle;
        textObj.set("fontStyle", currentStyle === "italic" ? "normal" : "italic");
        changed = true;
      }
    });
    
    if (changed) {
      canvas.renderAll();
      toast.success("Text style updated!");
    } else {
      toast.error("Select text to toggle italic");
    }
  }, [canvas]);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canvas || !e.target.files?.[0]) return;

      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;

        FabricImage.fromURL(imgUrl).then((img) => {
          // Scale image to fit nicely
          const maxSize = 300;
          const scale = Math.min(
            maxSize / (img.width || 1),
            maxSize / (img.height || 1),
            1
          );

          img.scale(scale);
          img.set({
            left: CANVAS_WIDTH / 2 - (img.width || 0) * scale / 2,
            top: CANVAS_HEIGHT / 2 - (img.height || 0) * scale / 2,
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          toast.success("Image added!");
        });
      };

      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [canvas]
  );

  const deleteSelected = useCallback(() => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      toast.error("Select an element to delete");
      return;
    }

    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    toast.success("Element deleted!");
  }, [canvas]);

  const handleZoomIn = useCallback(() => {
    if (!canvas) return;
    const newZoom = Math.min(zoom * 1.2, 2);
    setZoom(newZoom);
    canvas.setZoom(newZoom);
    canvas.setDimensions({
      width: CANVAS_WIDTH * newZoom,
      height: CANVAS_HEIGHT * newZoom,
    });
  }, [canvas, zoom]);

  const handleZoomOut = useCallback(() => {
    if (!canvas) return;
    const newZoom = Math.max(zoom / 1.2, 0.3);
    setZoom(newZoom);
    canvas.setZoom(newZoom);
    canvas.setDimensions({
      width: CANVAS_WIDTH * newZoom,
      height: CANVAS_HEIGHT * newZoom,
    });
  }, [canvas, zoom]);

  const resetCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#FAFAF8";
    canvas.renderAll();
    toast.success("Canvas cleared!");
  }, [canvas]);

  const exportCanvas = useCallback(() => {
    if (!canvas) return;

    // Reset zoom temporarily for export
    const currentZoom = canvas.getZoom();
    canvas.setZoom(1);
    canvas.setDimensions({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    // Restore zoom
    canvas.setZoom(currentZoom);
    canvas.setDimensions({
      width: CANVAS_WIDTH * currentZoom,
      height: CANVAS_HEIGHT * currentZoom,
    });

    // Download
    const link = document.createElement("a");
    link.download = `vision-board-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    toast.success("Vision board downloaded!");
    onExport?.(dataUrl);
  }, [canvas, onExport]);

  return (
    <div className="flex flex-col h-full bg-canvas rounded-xl overflow-hidden border border-border">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="canvas" size="sm" onClick={addText}>
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Text</span>
          </Button>

          <Button
            variant="canvas"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Image</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleImageUpload}
            className="hidden"
          />

          <Button variant="canvas" size="sm" onClick={addShape}>
            <Square className="h-4 w-4" />
            <span className="hidden sm:inline">Shape</span>
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Text Formatting - Only show when selection exists */}
          {hasSelection && (
            <>
              <Button variant="canvas" size="icon-sm" onClick={toggleBold} title="Bold">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="canvas" size="icon-sm" onClick={toggleItalic} title="Italic">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="canvas" size="icon-sm" onClick={() => changeFontSize(-2)} title="Decrease font size">
                <Minus className="h-3 w-3" />
              </Button>
              <Button variant="canvas" size="icon-sm" onClick={() => changeFontSize(2)} title="Increase font size">
                <Plus className="h-3 w-3" />
              </Button>
              <div className="h-6 w-px bg-border mx-1" />
            </>
          )}

          {/* Color Picker */}
          <div className="flex items-center gap-1 relative">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap max-w-[180px]">
              {(showAllColors ? PRESET_COLORS : PRESET_COLORS.slice(0, 5)).map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                    activeColor === color
                      ? "border-foreground scale-110 ring-2 ring-primary/30"
                      : "border-border"
                  } ${color === "#FFFFFF" ? "border-muted-foreground/30" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => applyColorToSelection(color)}
                  aria-label={`Apply color ${color}`}
                  title={hasSelection ? "Apply to selection" : "Set active color"}
                />
              ))}
            </div>
            <button
              onClick={() => setShowAllColors(!showAllColors)}
              className="p-1 hover:bg-secondary rounded transition-colors"
              title={showAllColors ? "Show less colors" : "Show all colors"}
            >
              {showAllColors ? (
                <ChevronUp className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          </div>
          
          {hasSelection && (
            <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
              Selection active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="canvas" size="icon-sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="canvas" size="icon-sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          <Button
            variant="canvas"
            size="icon-sm"
            onClick={deleteSelected}
            className="text-destructive hover:text-destructive"
            title="Delete selected"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Button variant="canvas" size="icon-sm" onClick={resetCanvas} title="Clear canvas">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          <Button variant="hero" size="sm" onClick={exportCanvas}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-6 overflow-auto"
      >
        <div className="shadow-xl rounded-lg overflow-hidden bg-surface">
          <canvas ref={canvasRef} className="block" />
        </div>
      </div>

      {/* Help Text */}
      <div className="p-3 bg-surface border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          <Move className="inline h-3 w-3 mr-1" />
          Drag to move • Double-click text to edit • Select element + pick color to change • Delete key to remove
        </p>
      </div>
    </div>
  );
}
