export interface TemplateLayoutItem {
  type: 'image' | 'text' | 'quote';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  imageUrl?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
}

export interface TemplateLayout {
  backgroundColor: string;
  items: TemplateLayoutItem[];
}

export interface VisionBoardTemplate {
  id: string;
  category: string;
  name: string;
  description: string | null;
  style: string;
  layout_data: TemplateLayout;
  preview_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplatesResponse {
  templates: VisionBoardTemplate[];
  grouped: Record<string, VisionBoardTemplate[]>;
}

export const TEMPLATE_CATEGORIES = [
  { id: 'career', label: 'Career', icon: 'Briefcase', color: 'bg-amber-500' },
  { id: 'health', label: 'Health', icon: 'Heart', color: 'bg-rose-500' },
  { id: 'relationships', label: 'Relationships', icon: 'Users', color: 'bg-pink-500' },
  { id: 'finance', label: 'Finance', icon: 'Wallet', color: 'bg-emerald-500' },
  { id: 'personal', label: 'Personal', icon: 'User', color: 'bg-violet-500' },
  { id: 'business', label: 'Business', icon: 'Building', color: 'bg-blue-500' },
  { id: 'students', label: 'Students', icon: 'GraduationCap', color: 'bg-indigo-500' },
  { id: 'family', label: 'Family', icon: 'Home', color: 'bg-orange-500' },
  { id: 'wellness', label: 'Wellness', icon: 'Leaf', color: 'bg-green-500' },
  { id: 'success', label: 'Success', icon: 'Trophy', color: 'bg-yellow-500' },
  { id: 'travel', label: 'Travel', icon: 'Plane', color: 'bg-sky-500' },
  { id: 'creativity', label: 'Creativity', icon: 'Palette', color: 'bg-purple-500' },
] as const;

export type TemplateCategoryId = typeof TEMPLATE_CATEGORIES[number]['id'];
