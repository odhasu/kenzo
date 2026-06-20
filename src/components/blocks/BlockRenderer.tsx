'use client'

import type { Block } from '@/types/blocks'
import { HeadingBlock } from './HeadingBlock'
import { TextBlock } from './TextBlock'
import { ButtonBlock } from './ButtonBlock'
import { ImageBlock } from './ImageBlock'
import { FormBlock } from './FormBlock'

export function BlockRenderer({ block, editable, onUpdate }: {
  block: Block
  editable?: boolean
  onUpdate?: (props: Block['props']) => void
}) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'text':
      return <TextBlock props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'button':
      return <ButtonBlock props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'image':
      return <ImageBlock props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'form':
      return <FormBlock props={block.props} editable={editable} onUpdate={onUpdate} />
  }
}
