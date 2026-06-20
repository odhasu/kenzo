export type BlockType =
  | 'heading' | 'text' | 'button' | 'image' | 'form'
  | 'ic-hero' | 'ic-ticker' | 'ic-cards' | 'ic-faq' | 'ic-apply' | 'ic-cta' | 'ic-results'

export type ThemeId = 'dark-green' | 'dark-minimal' | 'light-clean' | 'light-blue'

export type FormField = 'email' | 'name' | 'phone'

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

export type Block = BlockProps & { id: string }

export interface FunnelSettings {
  theme: ThemeId
  accentColor: string
  bgColor: string
  textColor: string
  font: string
  tickerSpeed: number
  pageTitle: string
  faviconUrl: string
}

export const DEFAULT_SETTINGS: FunnelSettings = {
  theme: 'dark-green',
  accentColor: '',
  bgColor: '',
  textColor: '',
  font: 'Inter',
  tickerSpeed: 34,
  pageTitle: '',
  faviconUrl: '',
}
