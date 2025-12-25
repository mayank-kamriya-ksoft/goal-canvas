import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Template data with 4 templates per category
const templateData = [
  // CAREER - 4 templates
  {
    category: 'career',
    name: 'Executive Success',
    description: 'Modern design for ambitious professionals climbing the corporate ladder',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1a1a2e',
      items: [
        { type: 'quote', x: 50, y: 50, width: 400, height: 80, content: '"Success is not the key to happiness. Happiness is the key to success."', fontSize: 18, color: '#ffffff' },
        { type: 'image', x: 50, y: 150, width: 180, height: 180, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
        { type: 'image', x: 250, y: 150, width: 180, height: 180, imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300' },
        { type: 'text', x: 50, y: 350, width: 200, height: 40, content: 'Leadership', fontSize: 24, color: '#ffd700' },
        { type: 'image', x: 50, y: 400, width: 380, height: 150, imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500' },
        { type: 'quote', x: 50, y: 570, width: 380, height: 60, content: '"The only way to do great work is to love what you do."', fontSize: 16, color: '#a0a0a0' },
      ]
    }
  },
  {
    category: 'career',
    name: 'Entrepreneur Vision',
    description: 'Vibrant design for startup founders and business owners',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#4a0e4e',
      items: [
        { type: 'text', x: 50, y: 50, width: 300, height: 50, content: 'BUILD YOUR EMPIRE', fontSize: 28, color: '#ff6b6b' },
        { type: 'image', x: 50, y: 120, width: 200, height: 200, imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300' },
        { type: 'image', x: 270, y: 120, width: 200, height: 95, imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300' },
        { type: 'image', x: 270, y: 225, width: 200, height: 95, imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300' },
        { type: 'quote', x: 50, y: 340, width: 420, height: 80, content: '"Your limitation—it\'s only your imagination."', fontSize: 20, color: '#feca57' },
        { type: 'image', x: 50, y: 440, width: 420, height: 160, imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500' },
      ]
    }
  },
  {
    category: 'career',
    name: 'Professional Growth',
    description: 'Clean minimal design focusing on skills and advancement',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#f8f9fa',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 40, content: 'My Career Goals', fontSize: 32, color: '#212529' },
        { type: 'image', x: 50, y: 110, width: 190, height: 140, imageUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=300' },
        { type: 'image', x: 260, y: 110, width: 190, height: 140, imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300' },
        { type: 'text', x: 50, y: 270, width: 150, height: 30, content: '✓ Promotion', fontSize: 18, color: '#28a745' },
        { type: 'text', x: 220, y: 270, width: 150, height: 30, content: '✓ New Skills', fontSize: 18, color: '#28a745' },
        { type: 'image', x: 50, y: 320, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500' },
        { type: 'quote', x: 50, y: 520, width: 400, height: 60, content: '"Invest in yourself. Your career is the engine of your wealth."', fontSize: 16, color: '#6c757d' },
      ]
    }
  },
  {
    category: 'career',
    name: 'Work-Life Harmony',
    description: 'Classic elegant design balancing career success with personal fulfillment',
    style: 'classic',
    layout_data: {
      backgroundColor: '#fdf6e3',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Balance & Achievement', fontSize: 28, color: '#5c4033' },
        { type: 'image', x: 50, y: 120, width: 195, height: 130, imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 130, imageUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=300' },
        { type: 'quote', x: 50, y: 270, width: 400, height: 60, content: '"Success is liking yourself, liking what you do, and liking how you do it."', fontSize: 16, color: '#8b7355' },
        { type: 'image', x: 50, y: 350, width: 400, height: 200, imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500' },
      ]
    }
  },

  // HEALTH - 4 templates
  {
    category: 'health',
    name: 'Fitness Transformation',
    description: 'Energetic design for your fitness and workout goals',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#1a472a',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'STRONGER EVERY DAY', fontSize: 32, color: '#7cfc00' },
        { type: 'image', x: 50, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300' },
        { type: 'quote', x: 50, y: 290, width: 410, height: 60, content: '"Take care of your body. It\'s the only place you have to live."', fontSize: 18, color: '#98fb98' },
        { type: 'image', x: 50, y: 370, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500' },
      ]
    }
  },
  {
    category: 'health',
    name: 'Mindful Wellness',
    description: 'Serene design for mental health and mindfulness practice',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#f0f5f0',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 40, content: 'Inner Peace', fontSize: 36, color: '#2d5a27' },
        { type: 'image', x: 50, y: 110, width: 400, height: 160, imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500' },
        { type: 'quote', x: 50, y: 290, width: 400, height: 80, content: '"Almost everything will work again if you unplug it for a few minutes, including you."', fontSize: 16, color: '#4a7c59' },
        { type: 'image', x: 50, y: 390, width: 195, height: 140, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300' },
        { type: 'image', x: 255, y: 390, width: 195, height: 140, imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=300' },
      ]
    }
  },
  {
    category: 'health',
    name: 'Nutrition Goals',
    description: 'Fresh design for healthy eating and nutrition tracking',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1e3a29',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Nourish Your Body', fontSize: 28, color: '#90ee90' },
        { type: 'image', x: 50, y: 120, width: 195, height: 140, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 140, imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300' },
        { type: 'image', x: 50, y: 280, width: 400, height: 150, imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500' },
        { type: 'quote', x: 50, y: 450, width: 400, height: 60, content: '"Let food be thy medicine and medicine be thy food."', fontSize: 18, color: '#98d8aa' },
      ]
    }
  },
  {
    category: 'health',
    name: 'Active Lifestyle',
    description: 'Dynamic design for outdoor activities and sports',
    style: 'classic',
    layout_data: {
      backgroundColor: '#f5f0e6',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Move Your Body', fontSize: 32, color: '#8b4513' },
        { type: 'image', x: 50, y: 120, width: 130, height: 180, imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200' },
        { type: 'image', x: 190, y: 120, width: 130, height: 180, imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200' },
        { type: 'image', x: 330, y: 120, width: 130, height: 180, imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=200' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"The body achieves what the mind believes."', fontSize: 20, color: '#654321' },
        { type: 'image', x: 50, y: 400, width: 410, height: 150, imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=500' },
      ]
    }
  },

  // RELATIONSHIPS - 4 templates
  {
    category: 'relationships',
    name: 'Love & Connection',
    description: 'Romantic design for relationship goals and love life',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#4a1942',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Love Without Limits', fontSize: 28, color: '#ff69b4' },
        { type: 'image', x: 50, y: 120, width: 200, height: 180, imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 180, imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"The best thing to hold onto in life is each other."', fontSize: 20, color: '#ffb6c1' },
        { type: 'image', x: 50, y: 400, width: 410, height: 150, imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500' },
      ]
    }
  },
  {
    category: 'relationships',
    name: 'Friendship Goals',
    description: 'Joyful design celebrating friendship and social connections',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1a1a3e',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Better Together', fontSize: 32, color: '#00bfff' },
        { type: 'image', x: 50, y: 120, width: 410, height: 160, imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500' },
        { type: 'image', x: 50, y: 300, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=300' },
        { type: 'image', x: 260, y: 300, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300' },
        { type: 'quote', x: 50, y: 460, width: 410, height: 60, content: '"Good friends are like stars. You don\'t always see them, but they\'re always there."', fontSize: 16, color: '#87ceeb' },
      ]
    }
  },
  {
    category: 'relationships',
    name: 'Community Building',
    description: 'Warm design for building meaningful community connections',
    style: 'classic',
    layout_data: {
      backgroundColor: '#faf0e6',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Stronger Together', fontSize: 28, color: '#8b4513' },
        { type: 'image', x: 50, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300' },
        { type: 'quote', x: 50, y: 290, width: 400, height: 60, content: '"Alone we can do so little; together we can do so much."', fontSize: 18, color: '#a0522d' },
        { type: 'image', x: 50, y: 370, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500' },
      ]
    }
  },
  {
    category: 'relationships',
    name: 'Self-Love Journey',
    description: 'Gentle design focusing on self-care and self-love',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#fff5f5',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Love Yourself First', fontSize: 28, color: '#c71585' },
        { type: 'image', x: 50, y: 120, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500' },
        { type: 'quote', x: 50, y: 320, width: 400, height: 80, content: '"You yourself, as much as anybody in the entire universe, deserve your love and affection."', fontSize: 16, color: '#db7093' },
        { type: 'image', x: 50, y: 420, width: 195, height: 130, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
        { type: 'image', x: 255, y: 420, width: 195, height: 130, imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=300' },
      ]
    }
  },

  // FINANCE - 4 templates
  {
    category: 'finance',
    name: 'Wealth Builder',
    description: 'Bold design for financial independence and wealth building',
    style: 'modern',
    layout_data: {
      backgroundColor: '#0a1929',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Financial Freedom', fontSize: 32, color: '#ffd700' },
        { type: 'image', x: 50, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300' },
        { type: 'quote', x: 50, y: 290, width: 410, height: 60, content: '"The goal isn\'t more money. The goal is living life on your terms."', fontSize: 18, color: '#daa520' },
        { type: 'image', x: 50, y: 370, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500' },
      ]
    }
  },
  {
    category: 'finance',
    name: 'Smart Investor',
    description: 'Sophisticated design for investment and portfolio goals',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#f8f9fa',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Invest Wisely', fontSize: 32, color: '#1a5f7a' },
        { type: 'image', x: 50, y: 120, width: 400, height: 160, imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500' },
        { type: 'text', x: 50, y: 300, width: 130, height: 30, content: '📈 Stocks', fontSize: 18, color: '#28a745' },
        { type: 'text', x: 190, y: 300, width: 130, height: 30, content: '🏠 Real Estate', fontSize: 18, color: '#28a745' },
        { type: 'text', x: 330, y: 300, width: 130, height: 30, content: '💎 Crypto', fontSize: 18, color: '#28a745' },
        { type: 'image', x: 50, y: 350, width: 400, height: 150, imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500' },
        { type: 'quote', x: 50, y: 520, width: 400, height: 50, content: '"Don\'t save what is left after spending; spend what is left after saving."', fontSize: 14, color: '#6c757d' },
      ]
    }
  },
  {
    category: 'finance',
    name: 'Debt-Free Life',
    description: 'Motivating design for debt elimination and financial peace',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#1a3a1a',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'BREAK FREE', fontSize: 36, color: '#00ff7f' },
        { type: 'image', x: 50, y: 120, width: 195, height: 140, imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 140, imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300' },
        { type: 'quote', x: 50, y: 280, width: 400, height: 60, content: '"Debt is the slavery of the free."', fontSize: 20, color: '#90ee90' },
        { type: 'image', x: 50, y: 360, width: 400, height: 190, imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500' },
      ]
    }
  },
  {
    category: 'finance',
    name: 'Abundance Mindset',
    description: 'Elegant design embracing prosperity consciousness',
    style: 'classic',
    layout_data: {
      backgroundColor: '#f5f0e1',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Prosperity Awaits', fontSize: 28, color: '#8b6914' },
        { type: 'image', x: 50, y: 120, width: 410, height: 160, imageUrl: 'https://images.unsplash.com/photo-1618044619888-009e412ff12a?w=500' },
        { type: 'quote', x: 50, y: 300, width: 410, height: 60, content: '"Abundance is not something we acquire. It is something we tune into."', fontSize: 18, color: '#b8860b' },
        { type: 'image', x: 50, y: 380, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300' },
        { type: 'image', x: 260, y: 380, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=300' },
      ]
    }
  },

  // PERSONAL - 4 templates
  {
    category: 'personal',
    name: 'Growth Mindset',
    description: 'Inspiring design for personal development and self-improvement',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1a1a2e',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Become Your Best Self', fontSize: 26, color: '#9b59b6' },
        { type: 'image', x: 50, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=300' },
        { type: 'quote', x: 50, y: 290, width: 410, height: 60, content: '"The only person you are destined to become is the person you decide to be."', fontSize: 16, color: '#a29bfe' },
        { type: 'image', x: 50, y: 370, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500' },
      ]
    }
  },
  {
    category: 'personal',
    name: 'Life Goals',
    description: 'Comprehensive design for all your life aspirations',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#ffffff',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Dream Big', fontSize: 36, color: '#2c3e50' },
        { type: 'image', x: 50, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
        { type: 'image', x: 190, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200' },
        { type: 'image', x: 330, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=200' },
        { type: 'quote', x: 50, y: 270, width: 410, height: 60, content: '"Life is what happens when you\'re busy making other plans."', fontSize: 18, color: '#7f8c8d' },
        { type: 'image', x: 50, y: 350, width: 410, height: 200, imageUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=500' },
      ]
    }
  },
  {
    category: 'personal',
    name: 'Confidence Boost',
    description: 'Empowering design to build self-confidence',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#2d1b69',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'BELIEVE IN YOURSELF', fontSize: 28, color: '#f39c12' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"You are braver than you believe, stronger than you seem, and smarter than you think."', fontSize: 16, color: '#f1c40f' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300' },
      ]
    }
  },
  {
    category: 'personal',
    name: 'Habit Tracker',
    description: 'Structured design for building positive habits',
    style: 'classic',
    layout_data: {
      backgroundColor: '#f9f6f0',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Daily Habits', fontSize: 32, color: '#5d4e37' },
        { type: 'text', x: 50, y: 120, width: 200, height: 30, content: '☀️ Morning Routine', fontSize: 18, color: '#8b7355' },
        { type: 'text', x: 260, y: 120, width: 200, height: 30, content: '🌙 Evening Ritual', fontSize: 18, color: '#8b7355' },
        { type: 'image', x: 50, y: 160, width: 200, height: 130, imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300' },
        { type: 'image', x: 260, y: 160, width: 200, height: 130, imageUrl: 'https://images.unsplash.com/photo-1489659639091-8b687bc4386e?w=300' },
        { type: 'quote', x: 50, y: 310, width: 410, height: 60, content: '"We are what we repeatedly do. Excellence is not an act, but a habit."', fontSize: 16, color: '#a0937d' },
        { type: 'image', x: 50, y: 390, width: 410, height: 160, imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500' },
      ]
    }
  },

  // BUSINESS - 4 templates
  {
    category: 'business',
    name: 'Startup Launch',
    description: 'Dynamic design for launching your startup',
    style: 'modern',
    layout_data: {
      backgroundColor: '#0f0f23',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Launch & Scale', fontSize: 32, color: '#00d4ff' },
        { type: 'image', x: 50, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300' },
        { type: 'quote', x: 50, y: 290, width: 410, height: 60, content: '"The best way to predict the future is to create it."', fontSize: 18, color: '#7dd3fc' },
        { type: 'image', x: 50, y: 370, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500' },
      ]
    }
  },
  {
    category: 'business',
    name: 'Team Growth',
    description: 'Collaborative design for building amazing teams',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#1e3a5f',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'BUILD YOUR DREAM TEAM', fontSize: 24, color: '#ffa500' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"Coming together is a beginning, staying together is progress, working together is success."', fontSize: 14, color: '#ffd700' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300' },
      ]
    }
  },
  {
    category: 'business',
    name: 'Brand Building',
    description: 'Creative design for brand development',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#fafafa',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Build Your Brand', fontSize: 32, color: '#1a1a1a' },
        { type: 'image', x: 50, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300' },
        { type: 'quote', x: 50, y: 290, width: 400, height: 60, content: '"Your brand is what people say about you when you\'re not in the room."', fontSize: 16, color: '#666666' },
        { type: 'image', x: 50, y: 370, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500' },
      ]
    }
  },
  {
    category: 'business',
    name: 'Revenue Goals',
    description: 'Results-focused design for business growth',
    style: 'classic',
    layout_data: {
      backgroundColor: '#f4f1ea',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Scale Your Business', fontSize: 28, color: '#2c5530' },
        { type: 'image', x: 50, y: 120, width: 410, height: 160, imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500' },
        { type: 'text', x: 50, y: 300, width: 130, height: 30, content: '📊 Analytics', fontSize: 16, color: '#3d7c47' },
        { type: 'text', x: 190, y: 300, width: 130, height: 30, content: '💰 Revenue', fontSize: 16, color: '#3d7c47' },
        { type: 'text', x: 330, y: 300, width: 130, height: 30, content: '🚀 Growth', fontSize: 16, color: '#3d7c47' },
        { type: 'image', x: 50, y: 350, width: 410, height: 160, imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500' },
      ]
    }
  },

  // STUDENTS - 4 templates
  {
    category: 'students',
    name: 'Academic Excellence',
    description: 'Focused design for academic achievement',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1a237e',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Ace Your Studies', fontSize: 32, color: '#90caf9' },
        { type: 'image', x: 50, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300' },
        { type: 'quote', x: 50, y: 290, width: 410, height: 60, content: '"Education is the passport to the future."', fontSize: 20, color: '#bbdefb' },
        { type: 'image', x: 50, y: 370, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500' },
      ]
    }
  },
  {
    category: 'students',
    name: 'Study Motivation',
    description: 'Energizing design to keep you motivated',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#4a148c',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'STUDY HARD, DREAM BIG', fontSize: 26, color: '#ce93d8' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"The beautiful thing about learning is that no one can take it away from you."', fontSize: 16, color: '#e1bee7' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=300' },
      ]
    }
  },
  {
    category: 'students',
    name: 'College Dreams',
    description: 'Aspirational design for college applications',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#f5f5f5',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Dream Campus', fontSize: 36, color: '#37474f' },
        { type: 'image', x: 50, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=300' },
        { type: 'quote', x: 50, y: 290, width: 400, height: 60, content: '"Your future is created by what you do today, not tomorrow."', fontSize: 16, color: '#78909c' },
        { type: 'image', x: 50, y: 370, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500' },
      ]
    }
  },
  {
    category: 'students',
    name: 'Skills & Growth',
    description: 'Development-focused design for learning new skills',
    style: 'classic',
    layout_data: {
      backgroundColor: '#fff8e1',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Learn & Grow', fontSize: 32, color: '#5d4037' },
        { type: 'image', x: 50, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200' },
        { type: 'image', x: 190, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=200' },
        { type: 'image', x: 330, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200' },
        { type: 'quote', x: 50, y: 270, width: 410, height: 60, content: '"Live as if you were to die tomorrow. Learn as if you were to live forever."', fontSize: 16, color: '#8d6e63' },
        { type: 'image', x: 50, y: 350, width: 410, height: 200, imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500' },
      ]
    }
  },

  // FAMILY - 4 templates
  {
    category: 'family',
    name: 'Family Goals',
    description: 'Heartwarming design for family aspirations',
    style: 'classic',
    layout_data: {
      backgroundColor: '#faf3e0',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Our Family Dreams', fontSize: 28, color: '#8b4513' },
        { type: 'image', x: 50, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=300' },
        { type: 'quote', x: 50, y: 300, width: 410, height: 60, content: '"Family is not an important thing. It\'s everything."', fontSize: 20, color: '#a0522d' },
        { type: 'image', x: 50, y: 380, width: 410, height: 170, imageUrl: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=500' },
      ]
    }
  },
  {
    category: 'family',
    name: 'Dream Home',
    description: 'Cozy design for home and living goals',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#f8f4f0',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Home Sweet Home', fontSize: 32, color: '#4a4a4a' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"Home is where love resides, memories are created, and laughter never ends."', fontSize: 16, color: '#7a7a7a' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=300' },
      ]
    }
  },
  {
    category: 'family',
    name: 'Parenting Journey',
    description: 'Nurturing design for parenting goals',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#ff7043',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Raising Happy Kids', fontSize: 26, color: '#ffffff' },
        { type: 'image', x: 50, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300' },
        { type: 'quote', x: 50, y: 290, width: 410, height: 60, content: '"The best thing you can give your children is your time."', fontSize: 18, color: '#fff3e0' },
        { type: 'image', x: 50, y: 370, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=500' },
      ]
    }
  },
  {
    category: 'family',
    name: 'Family Adventures',
    description: 'Exciting design for family travel and activities',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1a2a3a',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Adventure Awaits', fontSize: 32, color: '#4fc3f7' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"The family that travels together stays together."', fontSize: 18, color: '#81d4fa' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=300' },
      ]
    }
  },

  // WELLNESS - 4 templates
  {
    category: 'wellness',
    name: 'Holistic Healing',
    description: 'Peaceful design for holistic wellness',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#e8f5e9',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Mind Body Soul', fontSize: 36, color: '#2e7d32' },
        { type: 'image', x: 50, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300' },
        { type: 'quote', x: 50, y: 290, width: 400, height: 60, content: '"Wellness is the complete integration of body, mind, and spirit."', fontSize: 16, color: '#4caf50' },
        { type: 'image', x: 50, y: 370, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=500' },
      ]
    }
  },
  {
    category: 'wellness',
    name: 'Self-Care Sanctuary',
    description: 'Luxurious design for self-care rituals',
    style: 'classic',
    layout_data: {
      backgroundColor: '#fce4ec',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Self-Care First', fontSize: 28, color: '#880e4f' },
        { type: 'image', x: 50, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=300' },
        { type: 'quote', x: 50, y: 300, width: 410, height: 60, content: '"Rest and self-care are so important."', fontSize: 20, color: '#ad1457' },
        { type: 'image', x: 50, y: 380, width: 410, height: 170, imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500' },
      ]
    }
  },
  {
    category: 'wellness',
    name: 'Energy Flow',
    description: 'Dynamic design for vitality and energy',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#00695c',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'RADIATE ENERGY', fontSize: 32, color: '#a7ffeb' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"Energy flows where attention goes."', fontSize: 20, color: '#80cbc4' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=300' },
      ]
    }
  },
  {
    category: 'wellness',
    name: 'Sleep & Recovery',
    description: 'Calming design for better sleep and rest',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1a237e',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Rest & Restore', fontSize: 32, color: '#9fa8da' },
        { type: 'image', x: 50, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 150, imageUrl: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=300' },
        { type: 'quote', x: 50, y: 290, width: 410, height: 60, content: '"Sleep is the best meditation."', fontSize: 20, color: '#c5cae9' },
        { type: 'image', x: 50, y: 370, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=500' },
      ]
    }
  },

  // SUCCESS - 4 templates
  {
    category: 'success',
    name: 'Victory Mindset',
    description: 'Bold design for achieving greatness',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#b7950b',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'WINNER MENTALITY', fontSize: 32, color: '#1a1a1a' },
        { type: 'image', x: 50, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=300' },
        { type: 'quote', x: 50, y: 300, width: 410, height: 60, content: '"Success is not final, failure is not fatal: it is the courage to continue that counts."', fontSize: 14, color: '#2c2c2c' },
        { type: 'image', x: 50, y: 380, width: 410, height: 170, imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500' },
      ]
    }
  },
  {
    category: 'success',
    name: 'Goal Crusher',
    description: 'Focused design for relentless goal pursuit',
    style: 'modern',
    layout_data: {
      backgroundColor: '#0d1117',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Crush Every Goal', fontSize: 28, color: '#58a6ff' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"A goal without a plan is just a wish."', fontSize: 20, color: '#8b949e' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=300' },
      ]
    }
  },
  {
    category: 'success',
    name: 'Abundance Life',
    description: 'Prosperous design for an abundant lifestyle',
    style: 'classic',
    layout_data: {
      backgroundColor: '#fffde7',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Living Abundantly', fontSize: 28, color: '#f57f17' },
        { type: 'image', x: 50, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300' },
        { type: 'quote', x: 50, y: 290, width: 400, height: 60, content: '"Success is getting what you want. Happiness is wanting what you get."', fontSize: 16, color: '#ff8f00' },
        { type: 'image', x: 50, y: 370, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500' },
      ]
    }
  },
  {
    category: 'success',
    name: 'Peak Performance',
    description: 'High-energy design for peak performers',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#fafafa',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Perform at Your Peak', fontSize: 26, color: '#212121' },
        { type: 'image', x: 50, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1461896836934- voices?w=200' },
        { type: 'image', x: 190, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' },
        { type: 'image', x: 330, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
        { type: 'quote', x: 50, y: 270, width: 410, height: 60, content: '"Excellence is not a skill, it\'s an attitude."', fontSize: 18, color: '#616161' },
        { type: 'image', x: 50, y: 350, width: 410, height: 200, imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500' },
      ]
    }
  },

  // TRAVEL - 4 templates
  {
    category: 'travel',
    name: 'Wanderlust Dreams',
    description: 'Adventurous design for travel bucket list',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#0097a7',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'EXPLORE THE WORLD', fontSize: 28, color: '#ffffff' },
        { type: 'image', x: 50, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300' },
        { type: 'quote', x: 50, y: 300, width: 410, height: 60, content: '"The world is a book and those who do not travel read only one page."', fontSize: 16, color: '#e0f7fa' },
        { type: 'image', x: 50, y: 380, width: 410, height: 170, imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500' },
      ]
    }
  },
  {
    category: 'travel',
    name: 'Beach Escapes',
    description: 'Relaxing design for beach and tropical destinations',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#e3f2fd',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Paradise Awaits', fontSize: 36, color: '#0277bd' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"Life is better at the beach."', fontSize: 22, color: '#0288d1' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=300' },
      ]
    }
  },
  {
    category: 'travel',
    name: 'City Explorer',
    description: 'Urban design for city destinations',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1c1c1c',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Urban Adventures', fontSize: 28, color: '#ff5722' },
        { type: 'image', x: 50, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=300' },
        { type: 'quote', x: 50, y: 290, width: 400, height: 60, content: '"A city is the place to be. There is no life outside of the city."', fontSize: 16, color: '#ff8a65' },
        { type: 'image', x: 50, y: 370, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500' },
      ]
    }
  },
  {
    category: 'travel',
    name: 'Mountain Adventures',
    description: 'Majestic design for mountain and nature destinations',
    style: 'classic',
    layout_data: {
      backgroundColor: '#efebe9',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Conquer Mountains', fontSize: 28, color: '#5d4037' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"The mountains are calling and I must go."', fontSize: 20, color: '#6d4c41' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=300' },
      ]
    }
  },

  // CREATIVITY - 4 templates
  {
    category: 'creativity',
    name: 'Artist\'s Vision',
    description: 'Expressive design for artistic pursuits',
    style: 'vibrant',
    layout_data: {
      backgroundColor: '#6a1b9a',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'CREATE FEARLESSLY', fontSize: 28, color: '#ea80fc' },
        { type: 'image', x: 50, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300' },
        { type: 'image', x: 260, y: 120, width: 200, height: 160, imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300' },
        { type: 'quote', x: 50, y: 300, width: 410, height: 60, content: '"Creativity takes courage."', fontSize: 24, color: '#ce93d8' },
        { type: 'image', x: 50, y: 380, width: 410, height: 170, imageUrl: 'https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=500' },
      ]
    }
  },
  {
    category: 'creativity',
    name: 'Writer\'s Retreat',
    description: 'Inspiring design for writers and authors',
    style: 'classic',
    layout_data: {
      backgroundColor: '#fff3e0',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Write Your Story', fontSize: 28, color: '#6d4c41' },
        { type: 'image', x: 50, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300' },
        { type: 'image', x: 255, y: 120, width: 195, height: 150, imageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300' },
        { type: 'quote', x: 50, y: 290, width: 400, height: 60, content: '"Start writing, no matter what. The water does not flow until the faucet is turned on."', fontSize: 14, color: '#8d6e63' },
        { type: 'image', x: 50, y: 370, width: 400, height: 180, imageUrl: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=500' },
      ]
    }
  },
  {
    category: 'creativity',
    name: 'Music Dreams',
    description: 'Melodic design for musicians and music lovers',
    style: 'modern',
    layout_data: {
      backgroundColor: '#1a1a2e',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Feel the Music', fontSize: 32, color: '#00bcd4' },
        { type: 'image', x: 50, y: 120, width: 410, height: 180, imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500' },
        { type: 'quote', x: 50, y: 320, width: 410, height: 60, content: '"Music is the universal language of mankind."', fontSize: 18, color: '#4dd0e1' },
        { type: 'image', x: 50, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300' },
        { type: 'image', x: 260, y: 400, width: 200, height: 140, imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300' },
      ]
    }
  },
  {
    category: 'creativity',
    name: 'Design Studio',
    description: 'Clean design for designers and creatives',
    style: 'minimal',
    layout_data: {
      backgroundColor: '#fafafa',
      items: [
        { type: 'text', x: 50, y: 50, width: 400, height: 50, content: 'Design Your Life', fontSize: 32, color: '#424242' },
        { type: 'image', x: 50, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=200' },
        { type: 'image', x: 190, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=200' },
        { type: 'image', x: 330, y: 120, width: 130, height: 130, imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=200' },
        { type: 'quote', x: 50, y: 270, width: 410, height: 60, content: '"Design is intelligence made visible."', fontSize: 20, color: '#757575' },
        { type: 'image', x: 50, y: 350, width: 410, height: 200, imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500' },
      ]
    }
  },
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use external Supabase if configured
    const supabaseUrl = Deno.env.get('EXTERNAL_SUPABASE_URL') || Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting template seeding...');

    // First, delete existing templates
    const { error: deleteError } = await supabase
      .from('vision_board_templates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error deleting existing templates:', deleteError);
    }

    // Insert all templates
    const { data, error } = await supabase
      .from('vision_board_templates')
      .insert(templateData)
      .select();

    if (error) {
      console.error('Error seeding templates:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to seed templates', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully seeded ${data?.length || 0} templates`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Seeded ${data?.length || 0} templates`,
        templates: data
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Seed templates error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
