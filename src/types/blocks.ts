export type BlockType = 'heading' | 'text' | 'button' | 'image' | 'form'

export type FormField = 'email' | 'name' | 'phone'

export interface HeadingProps { text: string }
export interface TextProps    { text: string }
export interface ButtonProps  { label: string; href: string }
export interface ImageProps   { src: string; alt: string }
export interface FormProps    { fields: FormField[] }

export type BlockProps =
  | { type: 'heading'; props: HeadingProps }
  | { type: 'text';    props: TextProps }
  | { type: 'button';  props: ButtonProps }
  | { type: 'image';   props: ImageProps }
  | { type: 'form';    props: FormProps }

export type Block = BlockProps & { id: string }
