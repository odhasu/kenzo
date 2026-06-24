// Content types for the AI Dropshipping Builder clone

export interface StatBadge {
  value: string;
  label: string;
}

export interface FeatureChip {
  icon: string;
  label: string;
}

export interface StepData {
  number: string;
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  description: string;
  chips: FeatureChip[];
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  visualType: "screenshot" | "mockup" | "zoom-call";
  reverse?: boolean;
}

export interface PricingItem {
  name: string;
  description: string;
  value: string;
}

export interface PartnerLogo {
  name: string;
  src: string;
  alt: string;
}

export interface StoreCard {
  url: string;
  image: string;
  alt: string;
}

export interface FounderInfo {
  name: string;
  role: string;
  social: string;
  photo: string;
  photoAlt: string;
  paragraphs: string[];
  benefits: string[];
  signature: string;
  signatureRole: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel";
  placeholder: string;
  icon: string;
  required: boolean;
}

export interface CountdownSlot {
  digits: number[];
}
