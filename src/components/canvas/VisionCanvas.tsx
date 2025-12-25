import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Rect, Textbox, FabricImage } from "fabric";
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
} from "lucide-react";
import { toast } from "sonner";

interface VisionCanvasProps {
  onExport?: (dataUrl: string) => void;
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

export function VisionCanvas({ onExport }: VisionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeColor, setActiveColor] = useState("#2D5A4A");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: "#FAFAF8",
      selection: true,
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

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

          {/* Color Picker */}
          <div className="flex items-center gap-1">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {PRESET_COLORS.slice(0, 5).map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    activeColor === color
                      ? "border-foreground scale-110"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setActiveColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
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
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Button variant="canvas" size="icon-sm" onClick={resetCanvas}>
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
          Drag to move • Double-click text to edit • Select and press Delete to
          remove
        </p>
      </div>
    </div>
  );
}
