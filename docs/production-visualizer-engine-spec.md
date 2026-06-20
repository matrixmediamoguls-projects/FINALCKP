# Chroma Key Protocol Act Three Visualizer Engine

## Production viewport contract

The cinematic center viewport image is a frontend public asset.

Physical repository path:

```text
frontend/public/media/visualizer/reclamation-city-gatekeeper.png
```

Frontend source path:

```text
/media/visualizer/reclamation-city-gatekeeper.png
```

Do not reference `frontend/public` inside React `src` attributes or CSS `url()` values. Anything under `frontend/public` is served from the browser root.

## Runtime mapping

The production viewport background is resolved in this order:

1. `activeTrack.viewport_image_url`
2. `activeTrack.visual_media_fallback_image`
3. `activeTrack.background_image_url`
4. `activeTrack.act_background_image`
5. `/media/visualizer/reclamation-city-gatekeeper.png`

The final resolved value is bound to the CSS custom property:

```css
--pva-viewport-image
```

The center stage consumes it as the third background layer of `.pva-center`, behind the lyrics protocol panel and status rail.

## Supabase fields

The production migration adds these fields to `public.reclamation_tracks`:

| Field | Type | Purpose |
| --- | --- | --- |
| `album_title` | text | Display album context for the active track. |
| `viewport_image_url` | text | Browser-facing image source for the center viewport. Defaults to `/media/visualizer/reclamation-city-gatekeeper.png`. |
| `viewport_media_type` | text | Usually `image`; reserved for future video viewport handling. |
| `viewport_alt_text` | text | Accessible description for the viewport layer. |
| `visualizer_scene_id` | text | Stable scene key for track-specific visualizer profiles. |
| `viewport_layer_config` | jsonb | Frontend layer contract for base layer, overlays, and center viewport rules. |

The migration also extends `public.visualizer_requirements` with:

| Field | Type | Purpose |
| --- | --- | --- |
| `viewport_image_url` | text | Browser-facing viewport source. |
| `frontend_public_path` | text | Repository storage path for the source asset. |
| `center_viewport_role` | text | Declares the viewport as the cinematic background layer. |
| `production_framework` | jsonb | Component-level production contract for the visualizer engine. |

## Frontend components

Primary files:

```text
frontend/src/acts/Reclamation/ReclamationCodex.jsx
frontend/src/modules/ImmersiveProtocol/useReclamationTracks.jsx
frontend/src/components/visuals/VisualDisplayPanel.jsx
frontend/src/styles/reclamation-command-center.css
```

`useReclamationTracks.jsx` exports the constant:

```js
DEFAULT_VISUALIZER_VIEWPORT_IMAGE = '/media/visualizer/reclamation-city-gatekeeper.png'
```

`ReclamationCodex.jsx` binds the resolved viewport image to `.pva-center` through inline CSS variables.

`VisualDisplayPanel.jsx` uses the same viewport source as its fallback so the right-side visual card never renders an empty visual state.

## Production design rules

The center viewport must remain cinematic and readable. The lyrics protocol panel and bottom status bar may overlay the viewport, but the image itself must remain the dominant center-stage visual layer.

The center viewport should not contain a permanent emblem. Emblems belong in supporting modules or the bottom protocol control dock, not as a blocking overlay on the cinematic viewport.

Audio-reactive effects should be implemented as overlay layers above the viewport image and below the lyrics protocol module.
