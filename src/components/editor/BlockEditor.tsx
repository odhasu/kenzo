'use client'

import { useState, useCallback } from 'react'
import type { Block, BlockType } from '@/types/blocks'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { createClient } from '@/lib/supabase/client'

const defaultProps: Record<BlockType, Block['props']> = {
  heading: { text: 'New heading' },
  text: { text: 'New paragraph text' },
  button: { label: 'Click me', href: '#' },
  image: { src: '', alt: '' },
  form: { fields: ['email'] },
}

export function BlockEditor({ pageId, initialBlocks }: {
  pageId: string
  initialBlocks: Block[]
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [saving, setSaving] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const save = useCallback(async (updated: Block[]) => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('pages').update({ content: updated }).eq('id', pageId)
    setSaving(false)
  }, [pageId])

  function addBlock(type: BlockType) {
    const block: Block = {
      id: crypto.randomUUID(),
      type,
      props: defaultProps[type],
    } as Block
    const updated = [...blocks, block]
    setBlocks(updated)
    save(updated)
    setShowMenu(false)
  }

  function updateBlock(index: number, props: Block['props']) {
    const updated = blocks.map((b, i) => i === index ? { ...b, props } as Block : b)
    setBlocks(updated)
    save(updated)
  }

  function deleteBlock(index: number) {
    if (!confirm('Delete this block?')) return
    const updated = blocks.filter((_, i) => i !== index)
    setBlocks(updated)
    save(updated)
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= blocks.length) return
    const updated = [...blocks]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    setBlocks(updated)
    save(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''}
          {saving && ' · Saving...'}
        </p>
      </div>

      {blocks.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          No blocks yet. Add one below.
        </div>
      )}

      {blocks.map((block, i) => (
        <div key={block.id} className="group relative rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="absolute -top-3 right-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              onClick={() => moveBlock(i, -1)}
              disabled={i === 0}
              className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              onClick={() => moveBlock(i, 1)}
              disabled={i === blocks.length - 1}
              className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700 disabled:opacity-30"
            >
              ↓
            </button>
            <button
              onClick={() => deleteBlock(i)}
              className="rounded bg-red-900/50 px-2 py-1 text-xs text-red-400 hover:bg-red-900"
            >
              ✕
            </button>
          </div>
          <BlockRenderer
            block={block}
            editable
            onUpdate={(props) => updateBlock(i, props)}
          />
        </div>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full rounded-lg border-2 border-dashed border-zinc-800 py-3 text-sm text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-400"
        >
          + Add block
        </button>
        {showMenu && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-zinc-700 bg-zinc-800 p-2 shadow-xl">
            {(['heading', 'text', 'button', 'image', 'form'] as BlockType[]).map((type) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="block w-full rounded px-3 py-2 text-left text-sm capitalize text-white hover:bg-zinc-700"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
