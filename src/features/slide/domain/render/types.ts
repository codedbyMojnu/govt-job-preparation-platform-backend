// Shared types for the slide rendering engine (grouped + single-question modes).

export type SlideMode = 'GROUPED' | 'SINGLE';

export interface BgGradientStop {
  color: string;
  offset: number; // 0..1
}

export interface BgGradient {
  type: 'linear' | 'radial';
  angle?: number; // degrees, linear only
  stops: BgGradientStop[];
}

// Mirrors the SlideStyleConfig Prisma model — the input a member configures before generating.
export interface SlideStyleConfigInput {
  mode: SlideMode;
  questionsPerSlide: number;
  slideWidth: number;
  slideHeight: number;
  bgColor?: string | null;
  bgGradient?: BgGradient | null;
  textColor: string;
  textSize: number;
  showOptions: boolean;
  showAnswer: boolean;
  showExplanation: boolean;
}

export interface SlideQuestionInput {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
  explanation?: string | null;
}

// A single drawable primitive — deliberately close to react-konva's node shapes so the
// editor (Phase 7) can load/mutate this JSON directly and the backend can repaint it.
export interface SceneNode {
  id: string;
  type: 'rect' | 'text' | 'circle' | 'line';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  cornerRadius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dash?: number[];
  points?: number[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: 'normal' | 'bold';
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
}

export interface Scene {
  width: number;
  height: number;
  background: {
    color?: string | null;
    gradient?: BgGradient | null;
  };
  nodes: SceneNode[];
}

export interface RenderedSlide {
  width: number;
  height: number;
  buffer: Buffer;
  sceneJson: Scene;
  questionIds: string[];
}

export interface SlideRenderContext {
  slideIndex: number;
  totalSlides: number;
}
