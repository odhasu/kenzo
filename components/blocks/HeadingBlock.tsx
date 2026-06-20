import type { HeadingProps } from '@/types/blocks'

export function HeadingBlock({ props, editable, onUpdate }: {
  props: HeadingProps
  editable?: boolean
  onUpdate?: (props: HeadingProps) => void
}) {
  if (editable) {
    return (
      <h2
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdate?.({ text: e.currentTarget.textContent || '' })}
        className="text-3xl font-bold text-black outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white rounded px-1"
      >
        {props.text}
      </h2>
    )
  }
  return <h2 className="text-3xl font-bold text-black">{props.text}</h2>
}
