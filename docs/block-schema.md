# Block Schema

Every page's `content` column is a JSON array of blocks.

## Shape

```json
[
  { "id": "abc123", "type": "heading", "props": { "text": "Welcome" } },
  { "id": "def456", "type": "text",    "props": { "text": "Body copy here" } },
  { "id": "ghi789", "type": "button",  "props": { "label": "Buy now", "href": "#" } },
  { "id": "jkl012", "type": "image",   "props": { "src": "/image.jpg", "alt": "Hero" } },
  { "id": "mno345", "type": "form",    "props": { "fields": ["email"] } }
]
```

## Rules

- `id` — unique string per block, generated with `crypto.randomUUID()` on creation
- `type` — one of: `heading` | `text` | `button` | `image` | `form`
- `props` — shape depends on type (see TypeScript types in `src/types/blocks.ts`)
- Order is determined by array index — reordering = array splice
- No `video` block type in v1

## Block prop shapes

| type    | props fields                                      |
|---------|---------------------------------------------------|
| heading | `text: string`                                    |
| text    | `text: string`                                    |
| button  | `label: string`, `href: string`                   |
| image   | `src: string`, `alt: string`                      |
| form    | `fields: ("email" \| "name" \| "phone")[]`        |
