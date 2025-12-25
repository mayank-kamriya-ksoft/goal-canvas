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
    const colors: Record<string, { primary: string; light: string; accent: string; dark: string }> = {
      career: { primary: "#4A7C9B", light: "#E8F4F8", accent: "#1E3A5F", dark: "#0F2940" },
      education: { primary: "#7B5AA6", light: "#F3EDF8", accent: "#5A3D7A", dark: "#3D2854" },
      health: { primary: "#4A9B6D", light: "#E8F5F0", accent: "#2D5A4A", dark: "#1A3D30" },
      finance: { primary: "#C4A442", light: "#FBF8E8", accent: "#8B7A30", dark: "#5C5120" },
      personal: { primary: "#9B5A7C", light: "#F8E8F0", accent: "#7A3D5A", dark: "#4D2438" },
    };
    return colors[category] || colors.career;
  };

  // Category-specific quotes
  const getCategoryQuote = (category: string) => {
    const quotes: Record<string, string> = {
      career: '"Success is not the key to happiness. Happiness is the key to success." — Albert Schweitzer',
      education: '"Education is the passport to the future." — Malcolm X',
      health: '"Take care of your body. It is the only place you have to live." — Jim Rohn',
      finance: '"Do not save what is left after spending, spend what is left after saving." — Warren Buffett',
      personal: '"The only person you are destined to become is the person you decide to be." — Ralph Waldo Emerson',
    };
    return quotes[category] || quotes.career;
  };

  // Load template when canvas is ready and template changes
  useEffect(() => {
    if (!canvas || !template || templateLoadedRef.current === template.id) return;
    
    templateLoadedRef.current = template.id;
    canvas.clear();
    
    const colors = getCategoryColors(template.category);
    const quote = getCategoryQuote(template.category);
    
    // Category-specific layouts
    switch (template.category) {
      case "career":
        renderCareerTemplate(canvas, template, colors, quote);
        break;
      case "education":
        renderEducationTemplate(canvas, template, colors, quote);
        break;
      case "health":
        renderHealthTemplate(canvas, template, colors, quote);
        break;
      case "finance":
        renderFinanceTemplate(canvas, template, colors, quote);
        break;
      case "personal":
        renderPersonalTemplate(canvas, template, colors, quote);
        break;
      default:
        renderCareerTemplate(canvas, template, colors, quote);
    }
    
    canvas.renderAll();
    toast.success(`${template.title} loaded! ✨`);
  }, [canvas, template]);

  // CAREER: Professional corporate style with clean lines
  const renderCareerTemplate = (
    canvas: FabricCanvas,
    template: Template,
    colors: { primary: string; light: string; accent: string; dark: string },
    quote: string
  ) => {
    canvas.backgroundColor = "#F8FAFC";
    
    // Left sidebar
    const sidebar = new Rect({
      left: 0, top: 0, width: 80, height: CANVAS_HEIGHT,
      fill: colors.dark, selectable: false,
    });
    canvas.add(sidebar);
    
    // Sidebar decorative lines
    [150, 300, 450, 600].forEach((y) => {
      const line = new Rect({
        left: 25, top: y, width: 30, height: 2,
        fill: colors.primary, rx: 1, ry: 1, selectable: false,
      });
      canvas.add(line);
    });
    
    // Header
    const header = new Rect({
      left: 80, top: 0, width: CANVAS_WIDTH - 80, height: 120,
      fill: colors.primary, selectable: false,
    });
    canvas.add(header);
    
    // Title
    const title = new Textbox(template.title.toUpperCase(), {
      left: 120, top: 35, width: 600,
      fontSize: 32, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
      fill: "#FFFFFF", charSpacing: 100, editable: true,
    });
    canvas.add(title);
    
    const subtitle = new Textbox("Professional Growth Roadmap", {
      left: 120, top: 75, width: 400,
      fontSize: 14, fontFamily: "DM Sans, sans-serif",
      fill: "rgba(255,255,255,0.7)", editable: true,
    });
    canvas.add(subtitle);
    
    // Year badge
    const yearBadge = new Rect({
      left: CANVAS_WIDTH - 140, top: 35, width: 80, height: 50,
      fill: colors.dark, rx: 8, ry: 8, selectable: false,
    });
    canvas.add(yearBadge);
    const yearText = new Textbox("2025", {
      left: CANVAS_WIDTH - 140, top: 48, width: 80,
      fontSize: 20, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
      fill: "#FFFFFF", textAlign: "center",
    });
    canvas.add(yearText);
    
    // Goals in timeline style
    const startY = 160;
    template.goals.forEach((goal, index) => {
      const y = startY + index * 130;
      
      // Timeline dot
      const dot = new Rect({
        left: 100, top: y + 20, width: 16, height: 16,
        fill: colors.primary, rx: 8, ry: 8, selectable: false,
      });
      canvas.add(dot);
      
      // Timeline line
      if (index < template.goals.length - 1) {
        const line = new Rect({
          left: 107, top: y + 36, width: 2, height: 110,
          fill: colors.light, selectable: false,
        });
        canvas.add(line);
      }
      
      // Goal card
      const card = new Rect({
        left: 140, top: y, width: CANVAS_WIDTH - 200, height: 100,
        fill: "#FFFFFF", rx: 12, ry: 12,
        shadow: new Shadow({ color: "rgba(0,0,0,0.05)", blur: 10, offsetX: 0, offsetY: 2 }),
        stroke: colors.light, strokeWidth: 1,
      });
      canvas.add(card);
      
      // Q badge
      const qBadge = new Rect({
        left: 160, top: y + 15, width: 40, height: 24,
        fill: colors.light, rx: 4, ry: 4, selectable: false,
      });
      canvas.add(qBadge);
      const qText = new Textbox(`Q${index + 1}`, {
        left: 160, top: y + 18, width: 40,
        fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
        fill: colors.primary, textAlign: "center",
      });
      canvas.add(qText);
      
      // Goal text
      const goalText = new Textbox(goal, {
        left: 220, top: y + 25, width: CANVAS_WIDTH - 300,
        fontSize: 18, fontFamily: "DM Sans, sans-serif", fontWeight: "600",
        fill: colors.dark, editable: true,
      });
      canvas.add(goalText);
      
      const detailText = new Textbox("Add milestones and deadlines...", {
        left: 220, top: y + 55, width: CANVAS_WIDTH - 300,
        fontSize: 13, fontFamily: "DM Sans, sans-serif",
        fill: "#94A3B8", editable: true,
      });
      canvas.add(detailText);
    });
    
    // Quote footer
    const quoteBar = new Rect({
      left: 80, top: CANVAS_HEIGHT - 60, width: CANVAS_WIDTH - 80, height: 60,
      fill: colors.light, selectable: false,
    });
    canvas.add(quoteBar);
    const quoteText = new Textbox(quote, {
      left: 120, top: CANVAS_HEIGHT - 45, width: CANVAS_WIDTH - 180,
      fontSize: 13, fontFamily: "DM Sans, sans-serif", fontStyle: "italic",
      fill: colors.accent, textAlign: "center", editable: true,
    });
    canvas.add(quoteText);
  };

  // EDUCATION: Academic notebook style
  const renderEducationTemplate = (
    canvas: FabricCanvas,
    template: Template,
    colors: { primary: string; light: string; accent: string; dark: string },
    quote: string
  ) => {
    canvas.backgroundColor = "#FFFEF7";
    
    // Paper texture lines
    for (let i = 0; i < 20; i++) {
      const line = new Rect({
        left: 100, top: 80 + i * 36, width: CANVAS_WIDTH - 140, height: 1,
        fill: "rgba(123, 90, 166, 0.1)", selectable: false,
      });
      canvas.add(line);
    }
    
    // Left margin line
    const marginLine = new Rect({
      left: 90, top: 0, width: 2, height: CANVAS_HEIGHT,
      fill: "rgba(220, 38, 38, 0.3)", selectable: false,
    });
    canvas.add(marginLine);
    
    // Spiral binding holes
    for (let i = 0; i < 12; i++) {
      const hole = new Rect({
        left: 30, top: 60 + i * 60, width: 20, height: 20,
        fill: colors.light, rx: 10, ry: 10, selectable: false,
      });
      canvas.add(hole);
    }
    
    // Header with graduation cap emoji
    const headerBg = new Rect({
      left: 100, top: 20, width: CANVAS_WIDTH - 140, height: 100,
      fill: colors.primary, rx: 0, ry: 0, selectable: false,
    });
    canvas.add(headerBg);
    
    const title = new Textbox("🎓 " + template.title, {
      left: 130, top: 40, width: CANVAS_WIDTH - 200,
      fontSize: 28, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
      fill: "#FFFFFF", editable: true,
    });
    canvas.add(title);
    
    const subtitle = new Textbox("Academic Year Goals & Achievements", {
      left: 130, top: 80, width: 400,
      fontSize: 14, fontFamily: "DM Sans, sans-serif",
      fill: "rgba(255,255,255,0.8)", editable: true,
    });
    canvas.add(subtitle);
    
    // Goals as checklist items
    const startY = 150;
    template.goals.forEach((goal, index) => {
      const y = startY + index * 140;
      
      // Checkbox
      const checkbox = new Rect({
        left: 120, top: y + 10, width: 28, height: 28,
        fill: "transparent", rx: 4, ry: 4,
        stroke: colors.primary, strokeWidth: 2,
      });
      canvas.add(checkbox);
      
      // Goal card
      const card = new Rect({
        left: 170, top: y, width: CANVAS_WIDTH - 230, height: 110,
        fill: colors.light, rx: 8, ry: 8,
      });
      canvas.add(card);
      
      // Subject tag
      const subjects = ["📚 Core", "🔬 Research", "🏆 Achievement", "🌍 Experience"];
      const tagText = new Textbox(subjects[index % 4], {
        left: 190, top: y + 12, width: 100,
        fontSize: 11, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
        fill: colors.primary,
      });
      canvas.add(tagText);
      
      // Goal text
      const goalText = new Textbox(goal, {
        left: 190, top: y + 35, width: CANVAS_WIDTH - 280,
        fontSize: 18, fontFamily: "DM Sans, sans-serif", fontWeight: "600",
        fill: colors.dark, editable: true,
      });
      canvas.add(goalText);
      
      const noteText = new Textbox("Notes: Add your study plan here...", {
        left: 190, top: y + 70, width: CANVAS_WIDTH - 280,
        fontSize: 12, fontFamily: "DM Sans, sans-serif", fontStyle: "italic",
        fill: "#888", editable: true,
      });
      canvas.add(noteText);
    });
    
    // Quote at bottom
    const quoteBox = new Rect({
      left: 100, top: CANVAS_HEIGHT - 90, width: CANVAS_WIDTH - 140, height: 70,
      fill: colors.accent, rx: 0, ry: 0, selectable: false,
    });
    canvas.add(quoteBox);
    const quoteText = new Textbox(quote, {
      left: 130, top: CANVAS_HEIGHT - 70, width: CANVAS_WIDTH - 200,
      fontSize: 14, fontFamily: "DM Sans, sans-serif", fontStyle: "italic",
      fill: "#FFFFFF", textAlign: "center", editable: true,
    });
    canvas.add(quoteText);
  };

  // HEALTH: Organic wellness style with flowing shapes
  const renderHealthTemplate = (
    canvas: FabricCanvas,
    template: Template,
    colors: { primary: string; light: string; accent: string; dark: string },
    quote: string
  ) => {
    canvas.backgroundColor = "#F0FDF4";
    
    // Large decorative circles
    const circle1 = new Rect({
      left: -100, top: -100, width: 300, height: 300,
      fill: "rgba(74, 155, 109, 0.1)", rx: 150, ry: 150, selectable: false,
    });
    canvas.add(circle1);
    
    const circle2 = new Rect({
      left: CANVAS_WIDTH - 150, top: CANVAS_HEIGHT - 200, width: 250, height: 250,
      fill: "rgba(74, 155, 109, 0.08)", rx: 125, ry: 125, selectable: false,
    });
    canvas.add(circle2);
    
    // Center title area
    const titleBg = new Rect({
      left: CANVAS_WIDTH / 2 - 300, top: 30, width: 600, height: 100,
      fill: colors.primary, rx: 50, ry: 50, selectable: false,
    });
    canvas.add(titleBg);
    
    const title = new Textbox("🌿 " + template.title, {
      left: CANVAS_WIDTH / 2 - 280, top: 55, width: 560,
      fontSize: 28, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
      fill: "#FFFFFF", textAlign: "center", editable: true,
    });
    canvas.add(title);
    
    const subtitle = new Textbox("Mind • Body • Spirit", {
      left: CANVAS_WIDTH / 2 - 100, top: 95, width: 200,
      fontSize: 14, fontFamily: "DM Sans, sans-serif",
      fill: "rgba(255,255,255,0.8)", textAlign: "center", editable: true,
    });
    canvas.add(subtitle);
    
    // Goals in a circular/radial layout
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2 + 50;
    const radius = 250;
    const icons = ["💪", "🧘", "🥗", "😴"];
    
    template.goals.forEach((goal, index) => {
      const angle = (index * Math.PI / 2) - Math.PI / 4;
      const x = centerX + Math.cos(angle) * radius - 150;
      const y = centerY + Math.sin(angle) * radius - 60;
      
      // Goal bubble
      const bubble = new Rect({
        left: x, top: y, width: 300, height: 120,
        fill: "#FFFFFF", rx: 20, ry: 20,
        shadow: new Shadow({ color: "rgba(0,0,0,0.08)", blur: 15, offsetX: 0, offsetY: 5 }),
      });
      canvas.add(bubble);
      
      // Icon circle
      const iconBg = new Rect({
        left: x + 20, top: y + 20, width: 50, height: 50,
        fill: colors.light, rx: 25, ry: 25, selectable: false,
      });
      canvas.add(iconBg);
      const iconText = new Textbox(icons[index], {
        left: x + 20, top: y + 30, width: 50,
        fontSize: 24, textAlign: "center",
      });
      canvas.add(iconText);
      
      // Goal text
      const goalText = new Textbox(goal, {
        left: x + 85, top: y + 25, width: 190,
        fontSize: 16, fontFamily: "DM Sans, sans-serif", fontWeight: "600",
        fill: colors.dark, editable: true,
      });
      canvas.add(goalText);
      
      const progressText = new Textbox("Track your progress...", {
        left: x + 85, top: y + 70, width: 190,
        fontSize: 12, fontFamily: "DM Sans, sans-serif",
        fill: "#888", editable: true,
      });
      canvas.add(progressText);
    });
    
    // Center wellness circle
    const centerCircle = new Rect({
      left: centerX - 60, top: centerY - 60, width: 120, height: 120,
      fill: colors.primary, rx: 60, ry: 60, selectable: false,
    });
    canvas.add(centerCircle);
    const centerText = new Textbox("WELLNESS", {
      left: centerX - 50, top: centerY - 8, width: 100,
      fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
      fill: "#FFFFFF", textAlign: "center", charSpacing: 100,
    });
    canvas.add(centerText);
    
    // Quote
    const quoteText = new Textbox(quote, {
      left: 60, top: CANVAS_HEIGHT - 60, width: CANVAS_WIDTH - 120,
      fontSize: 14, fontFamily: "DM Sans, sans-serif", fontStyle: "italic",
      fill: colors.accent, textAlign: "center", editable: true,
    });
    canvas.add(quoteText);
  };

  // FINANCE: Modern dashboard style with charts aesthetic
  const renderFinanceTemplate = (
    canvas: FabricCanvas,
    template: Template,
    colors: { primary: string; light: string; accent: string; dark: string },
    quote: string
  ) => {
    canvas.backgroundColor = "#1A1A2E";
    
    // Grid pattern background
    for (let i = 0; i < 15; i++) {
      const vLine = new Rect({
        left: 80 * i, top: 0, width: 1, height: CANVAS_HEIGHT,
        fill: "rgba(255,255,255,0.03)", selectable: false,
      });
      canvas.add(vLine);
      const hLine = new Rect({
        left: 0, top: 80 * i, width: CANVAS_WIDTH, height: 1,
        fill: "rgba(255,255,255,0.03)", selectable: false,
      });
      canvas.add(hLine);
    }
    
    // Header
    const header = new Rect({
      left: 0, top: 0, width: CANVAS_WIDTH, height: 100,
      fill: "rgba(196, 164, 66, 0.1)", selectable: false,
    });
    canvas.add(header);
    
    const title = new Textbox("💰 " + template.title.toUpperCase(), {
      left: 60, top: 30, width: 600,
      fontSize: 30, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
      fill: colors.primary, charSpacing: 50, editable: true,
    });
    canvas.add(title);
    
    const subtitle = new Textbox("Financial Dashboard • " + new Date().getFullYear(), {
      left: 60, top: 70, width: 400,
      fontSize: 12, fontFamily: "DM Sans, sans-serif",
      fill: "rgba(255,255,255,0.5)", editable: true,
    });
    canvas.add(subtitle);
    
    // Stats cards row
    const stats = ["Net Worth", "Savings Rate", "Investments", "Debt-Free"];
    stats.forEach((stat, i) => {
      const card = new Rect({
        left: 60 + i * 280, top: 120, width: 250, height: 80,
        fill: "rgba(255,255,255,0.05)", rx: 12, ry: 12,
        stroke: "rgba(255,255,255,0.1)", strokeWidth: 1,
      });
      canvas.add(card);
      const statLabel = new Textbox(stat, {
        left: 80 + i * 280, top: 135, width: 210,
        fontSize: 11, fontFamily: "DM Sans, sans-serif",
        fill: "rgba(255,255,255,0.5)",
      });
      canvas.add(statLabel);
      const statValue = new Textbox("$--,---", {
        left: 80 + i * 280, top: 155, width: 210,
        fontSize: 24, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
        fill: colors.primary, editable: true,
      });
      canvas.add(statValue);
    });
    
    // Goals as metric cards
    const startY = 230;
    template.goals.forEach((goal, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 60 + col * 560;
      const y = startY + row * 180;
      
      const card = new Rect({
        left: x, top: y, width: 530, height: 150,
        fill: "rgba(255,255,255,0.03)", rx: 16, ry: 16,
        stroke: "rgba(196, 164, 66, 0.3)", strokeWidth: 1,
      });
      canvas.add(card);
      
      // Progress bar background
      const progressBg = new Rect({
        left: x + 20, top: y + 110, width: 490, height: 8,
        fill: "rgba(255,255,255,0.1)", rx: 4, ry: 4, selectable: false,
      });
      canvas.add(progressBg);
      
      // Progress bar fill
      const progressFill = new Rect({
        left: x + 20, top: y + 110, width: 120 + index * 80, height: 8,
        fill: colors.primary, rx: 4, ry: 4,
      });
      canvas.add(progressFill);
      
      // Goal number
      const numText = new Textbox(`0${index + 1}`, {
        left: x + 25, top: y + 20, width: 50,
        fontSize: 32, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
        fill: colors.primary,
      });
      canvas.add(numText);
      
      // Goal text
      const goalText = new Textbox(goal, {
        left: x + 90, top: y + 25, width: 400,
        fontSize: 18, fontFamily: "DM Sans, sans-serif", fontWeight: "600",
        fill: "#FFFFFF", editable: true,
      });
      canvas.add(goalText);
      
      const targetText = new Textbox("Target: Set your financial goal amount...", {
        left: x + 90, top: y + 60, width: 400,
        fontSize: 13, fontFamily: "DM Sans, sans-serif",
        fill: "rgba(255,255,255,0.4)", editable: true,
      });
      canvas.add(targetText);
    });
    
    // Quote
    const quoteText = new Textbox(quote, {
      left: 60, top: CANVAS_HEIGHT - 50, width: CANVAS_WIDTH - 120,
      fontSize: 13, fontFamily: "DM Sans, sans-serif", fontStyle: "italic",
      fill: "rgba(255,255,255,0.5)", textAlign: "center", editable: true,
    });
    canvas.add(quoteText);
  };

  // PERSONAL: Creative scrapbook/mood board style
  const renderPersonalTemplate = (
    canvas: FabricCanvas,
    template: Template,
    colors: { primary: string; light: string; accent: string; dark: string },
    quote: string
  ) => {
    canvas.backgroundColor = "#FDF6F0";
    
    // Decorative tape strips
    const tape1 = new Rect({
      left: 80, top: 30, width: 120, height: 30,
      fill: "rgba(155, 90, 124, 0.3)", angle: -5, selectable: false,
    });
    canvas.add(tape1);
    
    const tape2 = new Rect({
      left: CANVAS_WIDTH - 200, top: 50, width: 100, height: 25,
      fill: "rgba(155, 90, 124, 0.2)", angle: 8, selectable: false,
    });
    canvas.add(tape2);
    
    // Main title with decorative elements
    const starLeft = new Textbox("✨", {
      left: 60, top: 60, width: 50, fontSize: 40,
    });
    canvas.add(starLeft);
    
    const title = new Textbox(template.title, {
      left: 120, top: 50, width: CANVAS_WIDTH - 240,
      fontSize: 36, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
      fill: colors.accent, textAlign: "center", editable: true,
    });
    canvas.add(title);
    
    const starRight = new Textbox("✨", {
      left: CANVAS_WIDTH - 100, top: 60, width: 50, fontSize: 40,
    });
    canvas.add(starRight);
    
    const subtitle = new Textbox("My Personal Growth Journey", {
      left: CANVAS_WIDTH / 2 - 150, top: 100, width: 300,
      fontSize: 16, fontFamily: "DM Sans, sans-serif",
      fill: colors.primary, textAlign: "center", editable: true,
    });
    canvas.add(subtitle);
    
    // Goals as polaroid-style cards with random rotation
    const rotations = [-3, 2, -2, 4];
    const positions = [
      { x: 80, y: 160 },
      { x: 620, y: 180 },
      { x: 120, y: 450 },
      { x: 660, y: 430 },
    ];
    const emojis = ["🌟", "📖", "🤝", "🎯"];
    
    template.goals.forEach((goal, index) => {
      const pos = positions[index];
      
      // Polaroid frame
      const frame = new Rect({
        left: pos.x, top: pos.y, width: 480, height: 220,
        fill: "#FFFFFF", angle: rotations[index],
        shadow: new Shadow({ color: "rgba(0,0,0,0.15)", blur: 20, offsetX: 5, offsetY: 5 }),
      });
      canvas.add(frame);
      
      // Inner colored area
      const inner = new Rect({
        left: pos.x + 15, top: pos.y + 15, width: 450, height: 140,
        fill: colors.light, angle: rotations[index],
      });
      canvas.add(inner);
      
      // Emoji
      const emoji = new Textbox(emojis[index], {
        left: pos.x + 30, top: pos.y + 40, width: 60,
        fontSize: 40, angle: rotations[index],
      });
      canvas.add(emoji);
      
      // Goal text
      const goalText = new Textbox(goal, {
        left: pos.x + 100, top: pos.y + 50, width: 340,
        fontSize: 20, fontFamily: "DM Sans, sans-serif", fontWeight: "bold",
        fill: colors.dark, angle: rotations[index], editable: true,
      });
      canvas.add(goalText);
      
      const noteText = new Textbox("Why this matters to me...", {
        left: pos.x + 100, top: pos.y + 100, width: 340,
        fontSize: 13, fontFamily: "DM Sans, sans-serif", fontStyle: "italic",
        fill: "#888", angle: rotations[index], editable: true,
      });
      canvas.add(noteText);
      
      // Bottom label area
      const labelText = new Textbox(`Goal ${index + 1}`, {
        left: pos.x + 15, top: pos.y + 175, width: 450,
        fontSize: 14, fontFamily: "DM Sans, sans-serif",
        fill: colors.primary, textAlign: "center", angle: rotations[index],
      });
      canvas.add(labelText);
    });
    
    // Decorative elements
    const heart = new Textbox("💖", {
      left: CANVAS_WIDTH / 2 - 25, top: 380, width: 50, fontSize: 50,
    });
    canvas.add(heart);
    
    // Quote with decorative border
    const quoteBorder = new Rect({
      left: CANVAS_WIDTH / 2 - 350, top: CANVAS_HEIGHT - 100, width: 700, height: 70,
      fill: "transparent", rx: 8, ry: 8,
      stroke: colors.primary, strokeWidth: 2, strokeDashArray: [8, 4],
    });
    canvas.add(quoteBorder);
    const quoteText = new Textbox(quote, {
      left: CANVAS_WIDTH / 2 - 330, top: CANVAS_HEIGHT - 80, width: 660,
      fontSize: 14, fontFamily: "DM Sans, sans-serif", fontStyle: "italic",
      fill: colors.accent, textAlign: "center", editable: true,
    });
    canvas.add(quoteText);
  };

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
