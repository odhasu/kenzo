'use client'

import type { Block, FunnelSettings } from '@/types/blocks'
import { HeadingBlock } from './HeadingBlock'
import { TextBlock } from './TextBlock'
import { ButtonBlock } from './ButtonBlock'
import { ImageBlock } from './ImageBlock'
import { FormBlock } from './FormBlock'
import { CodeBlock } from './CodeBlock'
import { IcHeroBlock } from './IcHeroBlock'
import { IcTickerBlock } from './IcTickerBlock'
import { IcCardsBlock } from './IcCardsBlock'
import { IcFaqBlock } from './IcFaqBlock'
import { IcApplyBlock } from './IcApplyBlock'
import { IcCtaBlock } from './IcCtaBlock'
import { IcResultsBlock } from './IcResultsBlock'

export function BlockRenderer({ block, editable, onUpdate, settings, trusted }: {
  block: Block
  editable?: boolean
  onUpdate?: (props: Block['props']) => void
  settings?: FunnelSettings
  trusted?: boolean
}) {
  switch (block.type) {
    case 'heading':    return <HeadingBlock    props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'text':       return <TextBlock       props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'button':     return <ButtonBlock     props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'image':      return <ImageBlock      props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'form':       return <FormBlock       props={block.props} editable={editable} onUpdate={onUpdate} />
    case 'code':       return <CodeBlock       props={block.props} trusted={trusted} />
    case 'ic-hero':    return <IcHeroBlock     props={block.props} settings={settings} />
    case 'ic-ticker':  return <IcTickerBlock   props={block.props} tickerSpeed={settings?.tickerSpeed} />
    case 'ic-cards':   return <IcCardsBlock    props={block.props} settings={settings} />
    case 'ic-faq':     return <IcFaqBlock      props={block.props} settings={settings} />
    case 'ic-apply':   return <IcApplyBlock    props={block.props} settings={settings} />
    case 'ic-cta':     return <IcCtaBlock      props={block.props} settings={settings} />
    case 'ic-results': return <IcResultsBlock  props={block.props} tickerSpeed={settings?.tickerSpeed} />
  }
}
