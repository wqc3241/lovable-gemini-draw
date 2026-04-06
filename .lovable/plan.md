

## Plan: Redesign History Page with Grouped Generations

### Problem
Currently, each image is shown as a separate card in a flat grid. Users can't see the full prompt (it's truncated to 2 lines), and images from the same generation batch are scattered individually.

### UI Layout

```text
┌─────────────────────────────────────────────────────┐
│  ← Back                                   [Avatar]  │
│                                                     │
│  Generation History                                 │
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ April 5, 2026                                   ││
│  │                                                 ││
│  │ "A cinematic shot of a futuristic city at       ││
│  │  sunset with flying cars and neon lights..."     ││
│  │                                                 ││
│  │ ┌────────┐ ┌────────┐ ┌────────┐        [🗑]   ││
│  │ │  img1  │ │  img2  │ │  img3  │               ││
│  │ └────────┘ └────────┘ └────────┘               ││
│  │                                                 ││
│  │ Generate · Pro                                  ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ April 4, 2026                                   ││
│  │ "Portrait of a woman..."                        ││
│  │ ┌────────┐                              [🗑]   ││
│  │ │  img1  │                                     ││
│  │ └────────┘                                     ││
│  │ Edit · Nano Banana                              ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Changes

**`src/pages/History.tsx`** — single file change:

1. **Group history items** by prompt + mode + model + created_at (rounded to the same minute) to cluster images from the same generation batch
2. **Render grouped cards** — each card shows:
   - Date at top right (e.g. "April 5, 2026 at 3:42 PM")
   - Full prompt text (no `line-clamp` truncation), with expand/collapse for very long prompts (>200 chars)
   - Horizontal row of image thumbnails (scrollable if many)
   - Mode and model label at bottom
   - Delete button deletes all images in the group
3. **Click image** opens a lightbox/fullscreen dialog to view at full size
4. Styling uses `bg-card border-border` cards consistent with the home page design system

### Technical Details
- Group by: `prompt + mode + model + created_at` (truncated to nearest minute via `toISOString().slice(0, 16)`)
- Each group becomes a `{ prompt, mode, model, date, images: [{id, image_url}] }` object
- Delete group: batch-delete all IDs in the group
- Lightbox: use existing `Dialog` component with full-size image view

