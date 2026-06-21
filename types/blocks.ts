export type BlockType =
  | 'heading' | 'text' | 'button' | 'image' | 'form'
  | 'ic-hero' | 'ic-ticker' | 'ic-cards' | 'ic-faq' | 'ic-apply' | 'ic-cta' | 'ic-results'

export type ThemeId = 'dark-green' | 'dark-minimal' | 'light-clean' | 'light-blue'
export type BackgroundId = 'none' | 'gradient' | 'particles' | 'grid' | 'glow' | 'aurora' | 'dots' | 'noise' | 'waves' | 'stars'

export type FormField = 'email' | 'name' | 'phone'

export type LetterSpacing = 'tight' | 'normal' | 'wide'
export type FontWeight = 'regular' | 'medium' | 'bold'
export type SectionSpacing = 'compact' | 'normal' | 'spacious'
export type ButtonStyle = 'filled' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface HeadingProps { text: string }
export interface TextProps    { text: string }
export interface ButtonProps  { label: string; href: string }
export interface ImageProps   { src: string; alt: string }
export interface FormProps    { fields: FormField[] }

export interface IcHeroProps {
  badge: string
  headline: string
  subtext: string
  ctaLabel: string
  ctaHref: string
}

export interface IcTickerProps {
  items: string[]
}

export interface IcCardsProps {
  headline: string
  cards: { title: string; desc: string; bullets: string[] }[]
  ctaLabel: string
  ctaHref: string
}

export interface IcFaqProps {
  headline: string
  items: { q: string; a: string }[]
}

export interface IcApplyProps {
  headline: string
  subtext: string
}

export interface IcCtaProps {
  label: string
  href: string
  subtext: string
}

export interface IcResultsProps {
  headline: string
  photos: string[]
}

export type BlockProps =
  | { type: 'heading';    props: HeadingProps }
  | { type: 'text';       props: TextProps }
  | { type: 'button';     props: ButtonProps }
  | { type: 'image';      props: ImageProps }
  | { type: 'form';       props: FormProps }
  | { type: 'ic-hero';    props: IcHeroProps }
  | { type: 'ic-ticker';  props: IcTickerProps }
  | { type: 'ic-cards';   props: IcCardsProps }
  | { type: 'ic-faq';     props: IcFaqProps }
  | { type: 'ic-apply';   props: IcApplyProps }
  | { type: 'ic-cta';     props: IcCtaProps }
  | { type: 'ic-results'; props: IcResultsProps }

export type Block = BlockProps & { id: string; hidden?: boolean }

export interface FunnelSettings {
  theme: ThemeId
  accentColor: string
  bgColor: string
  textColor: string
  font: string
  headingFont: string
  fontScale: number
  letterSpacing: LetterSpacing
  fontWeight: FontWeight
  maxWidth: number
  sectionSpacing: SectionSpacing
  borderRadius: number
  buttonStyle: ButtonStyle
  buttonSize: ButtonSize
  buttonRadius: number
  glowEnabled: boolean
  gradientHeadlines: boolean
  glassmorphism: boolean
  tickerSpeed: number
  background: BackgroundId
  pageTitle: string
  faviconUrl: string
  ogImage: string
  pixelId: string
  customCss: string
}

export const DEFAULT_SETTINGS: FunnelSettings = {
  theme: 'dark-green',
  accentColor: '',
  bgColor: '',
  textColor: '',
  font: 'Inter',
  headingFont: '',
  fontScale: 1.0,
  letterSpacing: 'tight',
  fontWeight: 'bold',
  maxWidth: 1100,
  sectionSpacing: 'normal',
  borderRadius: 12,
  buttonStyle: 'filled',
  buttonSize: 'lg',
  buttonRadius: 12,
  glowEnabled: true,
  gradientHeadlines: true,
  glassmorphism: false,
  tickerSpeed: 34,
  background: 'none',
  pageTitle: '',
  faviconUrl: '',
  ogImage: '',
  pixelId: '',
  customCss: '',
}
