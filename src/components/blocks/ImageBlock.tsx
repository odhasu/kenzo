'use client'

import { useState } from 'react'
import type { ImageProps } from '@/types/blocks'

export function ImageBlock({ props, editable, onUpdate }: {
  props: ImageProps
  editable?: boolean
  onUpdate?: (props: ImageProps) => void
}) {
  const [editing, setEditing] = useState(false)
  const [src, setSrc] = useState(props.src)
  const [alt, setAlt] = useState(props.alt)

  if (editable && editing) {
    return (
      <div className="space-y-2 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
        <input
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          placeholder="Image URL"
          className="w-full rounded bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 border border-zinc-700"
        />
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text"
          className="w-full rounded bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 border border-zinc-700"
        />
        <button
          onClick={() => { onUpdate?.({ src, alt }); setEditing(false) }}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
        >
          Save
        </button>
      </div>
    )
  }

  if (!props.src) {
    return (
      <div
        onClick={() => editable && setEditing(true)}
        className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 text-zinc-500 cursor-pointer hover:border-zinc-600"
      >
        {editable ? 'Click to set image URL' : 'No image'}
      </div>
    )
  }

  return (
    <img
      src={props.src}
      alt={props.alt}
      onClick={() => editable && setEditing(true)}
      className={`w-full rounded-lg ${editable ? 'cursor-pointer hover:opacity-80' : ''}`}
    />
  )
}
