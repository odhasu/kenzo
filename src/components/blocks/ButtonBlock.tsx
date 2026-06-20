'use client'

import { useState } from 'react'
import type { ButtonProps } from '@/types/blocks'

export function ButtonBlock({ props, editable, onUpdate }: {
  props: ButtonProps
  editable?: boolean
  onUpdate?: (props: ButtonProps) => void
}) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(props.label)
  const [href, setHref] = useState(props.href)

  if (editable && editing) {
    return (
      <div className="space-y-2 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Button label"
          className="w-full rounded bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 border border-zinc-700"
        />
        <input
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="Link URL"
          className="w-full rounded bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 border border-zinc-700"
        />
        <button
          onClick={() => { onUpdate?.({ label, href }); setEditing(false) }}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
        >
          Save
        </button>
      </div>
    )
  }

  if (editable) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        {props.label}
      </button>
    )
  }

  return (
    <a
      href={props.href}
      className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
    >
      {props.label}
    </a>
  )
}
