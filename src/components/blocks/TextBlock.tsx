import type { TextProps } from '@/types/blocks'

export function TextBlock({ props, editable, onUpdate }: {
  props: TextProps
  editable?: boolean
  onUpdate?: (props: TextProps) => void
}) {
  if (editable) {
    return (
      <p
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ text: e.currentTarget.textContent || '' })}
        className="text-base leading-7 text-zinc-300 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded px-1"
      >
        {props.text}
      </p>
    )
  }
  return <p className="text-base leading-7 text-zinc-300">{props.text}</p>
}
