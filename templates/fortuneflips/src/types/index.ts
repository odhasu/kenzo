export interface MentorshipCard {
  tag: string;
  title: string;
  description: string;
  icon: "message-circle" | "circle-check-big" | "book-open" | "trending-up" | "users";
  gradient: string;
}

export interface TestimonialVideo {
  title: string;
  highlight: string;
  suffix: string;
  thumbnail: string;
  aspectRatio: "16:9" | "9:16";
  youtubeId?: string;
}

export interface ResultScreenshot {
  src: string;
  alt: string;
  aspectWidth: number;
  aspectHeight: number;
}

export interface ApplicationQuestion {
  id: number;
  label: string;
  subtitle?: string;
}
