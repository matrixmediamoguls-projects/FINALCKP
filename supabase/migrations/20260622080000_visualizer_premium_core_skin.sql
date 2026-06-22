alter table public.reclamation_tracks
  alter column core_theme set default 'act_three_reclamation_fire',
  alter column visual_skin set default 'reclamation_premium_core',
  alter column motion_style set default 'cinematic_reactor_corona',
  alter column viewport_layer_config set default '{"baseLayer":"premium-reactive-video","rootPath":"frontend/public/media/visualizer/","frontendSrc":"/media/visualizer/reclamation-city-gatekeeper.png","skinId":"reclamation-premium-core","palette":{"void":"#030304","gunmetal":"#111319","crimson":"#6f050c","red":"#ff2634","ember":"#ff8a62"},"overlays":["red-eclipse-corona","reactive-vignette","edge-spectrum","scanline-glass","mainframe-corners"],"reactivity":{"sub":"viewport-pressure","bass":"corona-expansion","lowMid":"spoke-rotation","mid":"ring-orbit","highMid":"glass-sweep","high":"ember-particles","beat":"border-shockwave"},"centerViewportClear":true,"emblemVisible":false}'::jsonb;

update public.reclamation_tracks
set
  core_theme = coalesce(core_theme, 'act_three_reclamation_fire'),
  visual_skin = coalesce(visual_skin, 'reclamation_premium_core'),
  motion_style = coalesce(motion_style, 'cinematic_reactor_corona'),
  signal_types = case when coalesce(array_length(signal_types, 1), 0) = 0 then array['sub','bass','lowMid','mid','highMid','high','beat'] else signal_types end,
  particle_types = case when coalesce(array_length(particle_types, 1), 0) = 0 then array['ember-dust','crimson-micro-shards','signal-sparks'] else particle_types end,
  resonance_events = case when coalesce(array_length(resonance_events, 1), 0) = 0 then array['bass-corona-expansion','beat-border-shockwave','treble-ember-release'] else resonance_events end,
  viewport_layer_config = coalesce(viewport_layer_config, '{}'::jsonb) || '{"skinId":"reclamation-premium-core","centerViewportClear":true,"emblemVisible":false}'::jsonb;

alter table public.visualizer_requirements
  add column if not exists premium_visual_skin jsonb not null default '{"skinId":"reclamation-premium-core","component":"CKPVisualizerCore","visualLanguage":"deep crimson glass, gunmetal mainframe, controlled Promethean reactor, low-amber accents only","palette":{"void":"#030304","gunmetal":"#111319","crimson":"#6f050c","red":"#ff2634","ember":"#ff8a62"},"reactivity":{"sub":"viewport pressure","bass":"corona expansion","lowMid":"signal spokes","mid":"orbital rings","highMid":"glass sweep","high":"ember particles","beat":"border shockwave"},"centerViewportClear":true,"emblemVisible":false}'::jsonb;

alter table public.visualizer_requirements
  alter column background_style set default 'premium_reclamation_mainframe',
  alter column camera_motion set default 'slow_cinematic_breath',
  alter column emblem_visible set default false,
  alter column center_viewport_clear set default true,
  alter column production_framework set default '{"component":"CKPVisualizerCore","skinId":"reclamation-premium-core","src":"/media/visualizer/reclamation-city-gatekeeper.png","physicalPath":"frontend/public/media/visualizer/reclamation-city-gatekeeper.png","lyricsOverlay":true,"audioReactive":true,"centerViewportClear":true,"emblemVisible":false,"overlays":["red-eclipse-corona","edge-spectrum","reactive-vignette","mainframe-corners"]}'::jsonb;

update public.visualizer_requirements
set
  background_style = coalesce(background_style, 'premium_reclamation_mainframe'),
  camera_motion = coalesce(camera_motion, 'slow_cinematic_breath'),
  emblem_visible = false,
  center_viewport_clear = true,
  premium_visual_skin = coalesce(premium_visual_skin, '{}'::jsonb) || '{"skinId":"reclamation-premium-core","centerViewportClear":true,"emblemVisible":false}'::jsonb,
  production_framework = coalesce(production_framework, '{}'::jsonb) || '{"skinId":"reclamation-premium-core","centerViewportClear":true,"emblemVisible":false}'::jsonb;
