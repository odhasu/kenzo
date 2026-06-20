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
      <p className="text-xs text-gray-400">
        {blocks.length} block{blocks.length !== 1 ? 's' : ''}
        {saving && ' · Saving...'}
      </p>

      {blocks.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
          No blocks yet. Add one below.
        </div>
      )}

      {blocks.map((block, i) => (
        <div key={block.id} className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="absolute -top-3 right-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
            <button onClick={() => moveBlock(i, -1)} disabled={i === 0}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 shadow-sm hover:bg-gray-50 disabled:opacity-30">↑</button>
            <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 shadow-sm hover:bg-gray-50 disabled:opacity-30">↓</button>
            <button onClick={() => deleteBlock(i)}
              className="rounded-lg border border-red-100 bg-white px-2 py-1 text-xs text-red-500 shadow-sm hover:bg-red-50">✕</button>
          </div>
          <BlockRenderer block={block} editable onUpdate={(props) => updateBlock(i, props)} />
        </div>
      ))}

      <div className="relative">
        <button onClick={() => setShowMenu(!showMenu)}
          className="w-full rounded-2xl border-2 border-dashed border-gray-200 py-4 text-sm text-gray-400 transition hover:border-gray-300 hover:text-gray-600">
          + Add block
        </button>
        {showMenu && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
            {(['heading', 'text', 'button', 'image', 'form'] as BlockType[]).map((type) => (
              <button key={type} onClick={() => addBlock(type)}
                className="block w-full rounded-xl px-4 py-2.5 text-left text-sm capitalize text-black hover:bg-gray-50">
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
