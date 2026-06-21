'use client'

import { useState } from 'react'
import type { FormProps, FormField } from '@/types/blocks'

const fieldLabels: Record<FormField, string> = {
  email: 'Email',
  name: 'Name',
  phone: 'Phone',
}

export function FormBlock({ props, editable, onUpdate }: {
  props: FormProps
  editable?: boolean
  onUpdate?: (props: FormProps) => void
}) {
  const [editing, setEditing] = useState(false)

  if (editable && editing) {
    const allFields: FormField[] = ['email', 'name', 'phone']
    return (
      <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs font-medium text-gray-500">Form fields:</p>
        {allFields.map((field) => (
          <label key={field} className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={props.fields.includes(field)}
              onChange={(e) => {
                const next = e.target.checked
                  ? [...props.fields, field]
                  : props.fields.filter((f) => f !== field)
                onUpdate?.({ fields: next })
              }}
              className="rounded"
            />
            {fieldLabels[field]}
          </label>
        ))}
        <button
          onClick={() => setEditing(false)}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => editable && setEditing(true)}
      className={`space-y-3 rounded-xl border border-gray-200 bg-white p-4 ${editable ? 'cursor-pointer hover:border-zinc-600' : ''}`}
    >
      {(Array.isArray(props.fields) ? props.fields : (['email'] as FormField[])).map((field) => (
        <input
          key={field}
          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
          placeholder={fieldLabels[field]}
          disabled={editable}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black placeholder-gray-400 disabled:opacity-60"
        />
      ))}
      <button
        type="button"
        disabled={editable}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        Submit
      </button>
    </div>
  )
}
