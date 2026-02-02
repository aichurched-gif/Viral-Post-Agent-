
export enum Platform {
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  X = 'x'
}

export type ImageSize = '1K' | '2K' | '4K';

export interface PlatformConfig {
  name: string;
  icon: string;
  mechanics: string;
  rules: string[];
}

export interface GeneratedPost {
  platform: Platform;
  name: string;
  icon: string;
  algorithm: string;
  content: string;
  explanation: string;
  virality_score: number;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  isThinking?: boolean;
}

export const PLATFORM_ALGORITHMS: Record<Platform, PlatformConfig> = {
  [Platform.TIKTOK]: {
    name: "TikTok",
    icon: "🎵",
    mechanics: "3-sec hook + pattern interrupt + curiosity gap + sound design",
    rules: [
      "First 3 seconds determine 90% of completion",
      "Use contrarian/relatable opening",
      "Trending audio or silence break",
      "CTA at 80% through (hold till end)"
    ]
  },
  [Platform.INSTAGRAM]: {
    name: "Instagram",
    icon: "📸",
    mechanics: "Visual hook + story progression + emotional arc + hashtag strategy",
    rules: [
      "First line is EVERYTHING (hook in 5 words)",
      "Build tension through carousel/caption",
      "Emotional climax = save/share trigger",
      "Strategic hashtag selection"
    ]
  },
  [Platform.YOUTUBE]: {
    name: "YouTube",
    icon: "▶️",
    mechanics: "Title/thumbnail CTR + retention curve + pattern breaks",
    rules: [
      "Title: curiosity gap + number + benefit",
      "Hook first 15 seconds = watch time retention",
      "Pattern interrupt every 20 seconds",
      "Thumbnail: high contrast + face/emotion"
    ]
  },
  [Platform.X]: {
    name: "X",
    icon: "𝕏",
    mechanics: "Quote-tweet bait + contrarian data + emotional hit",
    rules: [
      "Lead with controversial/counterintuitive take",
      "Back with 1 data point (specificity > vagueness)",
      "End with question or CTA that triggers replies",
      "Thread potential"
    ]
  }
};
