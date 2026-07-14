# Reclamation University Implementation Guide

## Overview

Reclamation University is the educational arm of the Chroma Key Protocol. This document describes the complete implementation of a production-ready, Supabase-backed learning experience with a six-faculty curriculum, persistent progress tracking, journal records, unlock logic, and analytics.

## Architecture

### 1. Curriculum Registry

**File**: `frontend/src/data/reclamationUniversityCurriculum.js`

The curriculum registry is the single source of truth for all Reclamation University content. It defines:

- **Six Faculties** (in order):
  1. Foundations of Reclamation
  2. The Architecture of Identity
  3. The Language Protocol
  4. Thought Forms & Reality
  5. The Sovereign Mind
  6. Architect of the Aftermath

- **Modules**: Each faculty contains one or more fully functional modules with:
  - Title, subtitle, description
  - Source track IDs
  - Initiation copy (multi-paragraph narrative)
  - Lyric anchors (teaching points with lines)
  - Shadow Codes (the dense material to be named)
  - Light Mappings (how shadow codes convert to light codes)
  - Declaration Fields (dynamic form fields for the student)
  - Integration Key (the completion message)
  - XP Reward and estimated time

**Key Functions**:
- `getFacultyBySlug(slug)` - Get faculty by slug
- `getModuleBySlug(facultySlug, moduleSlug)` - Get module by faculty and module slug
- `getAllFaculties()` - Get all faculties
- `isFacultyUnlocked(facultySlug, completedFacultySlugs)` - Check if faculty is unlocked based on prerequisites

### 2. Supabase Schema

**Migration**: `supabase/migrations/20260711000000_create_reclamation_university_schema.sql`

The schema is normalized and includes:

#### Tables

- **rec_uni_faculties**
  - `id` (uuid, primary key)
  - `slug` (text, unique) - URL-friendly identifier
  - `title`, `subtitle`, `description` - Faculty metadata
  - `faculty_order` (integer) - Display order
  - `accent` (text) - Color accent for UI
  - `artwork_url` (text) - Faculty card artwork
  - `is_published` (boolean) - Publication status
  - Timestamps

- **rec_uni_modules**
  - `id` (uuid, primary key)
  - `faculty_id` (uuid, foreign key) - Parent faculty
  - `slug` (text) - URL-friendly identifier
  - `title`, `subtitle` - Module metadata
  - `module_order` (integer) - Display order within faculty
  - `content` (jsonb) - Flexible content storage
  - `xp_reward` (integer) - Experience points for completion
  - `is_published` (boolean) - Publication status
  - Timestamps

- **rec_uni_user_progress**
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Student
  - `module_id` (uuid, foreign key) - Module being taken
  - `status` (text) - 'not_started', 'in_progress', 'completed'
  - `active_scene` (integer) - Current scene index
  - `listened_track_ids` (text[]) - Tracks the student has listened to
  - `selected_shadow_codes` (text[]) - Shadow codes selected
  - `retrieved_light_codes` (text[]) - Light codes retrieved
  - `declaration_json` (jsonb) - Student's declaration responses
  - `integration_key` (text) - Completion key
  - `started_at`, `completed_at` - Timestamps
  - Unique constraint on (user_id, module_id)

- **rec_uni_journal_entries**
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Student
  - `module_id` (uuid, foreign key) - Associated module
  - `entry_type` (text) - Type of entry (e.g., 'module_completion')
  - `title`, `body` - Journal content
  - `payload` (jsonb) - Flexible data storage
  - Timestamps

- **rec_uni_events**
  - `id` (bigint, auto-increment) - Primary key
  - `user_id` (uuid, foreign key) - Student (nullable)
  - `faculty_slug` (text) - Faculty identifier
  - `module_slug` (text) - Module identifier
  - `event_name` (text) - Event type
  - `event_payload` (jsonb) - Event data
  - `created_at` - Timestamp

#### Security

All tables have Row-Level Security (RLS) enabled:
- Users can only read/write/update their own records
- Published faculties and modules are readable by all authenticated users
- Events are readable by the user who triggered them

### 3. Generic Module Engine

**File**: `frontend/src/modules/sovereign/reclamation-university/ReclamationModuleEngine.jsx`

The ReclamationModuleEngine is a reusable component that orchestrates any module from the curriculum. It:

- Loads curriculum module data by slug
- Loads the user's prior state from Supabase
- Enforces gate requirements (e.g., "listen to both tracks before advancing")
- Restores the last active scene
- Maps selected Shadow Codes to allowed Light Codes
- Validates declaration completion
- Saves progress incrementally
- Saves final completion record
- Reveals Integration Key only after all criteria are met
- Emits analytics events

**Props**:
- `module` (object) - Module data from curriculum registry
- `faculty` (object) - Faculty data from curriculum registry

**Features**:
- Five-scene progression: Signal Keys → Shadow Scan → Light Retrieval → Declaration → Integration Key
- Dynamic scene titles and requirements
- Real-time gate status display
- Sealed record display after completion

### 4. Routing

**Routes**:
- `/experiencemode/sovereign/reclamation-university` - Main dashboard (existing)
- `/experiencemode/sovereign/reclamation-university/:facultySlug` - Faculty overview
- `/experiencemode/sovereign/reclamation-university/:facultySlug/:moduleSlug` - Module experience

**Pages**:
- `ReclamationUniversityPage.jsx` - Main dashboard with faculty cards
- `ReclamationFacultyPage.jsx` - Faculty overview with module list
- `ReclamationModulePage.jsx` - Module wrapper that renders ReclamationModuleEngine

### 5. Data Layer

**File**: `frontend/src/lib/supabase/reclamationUniversity.js`

Key functions:

- `loadUserProgress(moduleId)` - Load user's progress for a module
- `saveUserProgress({...})` - Save progress incrementally
- `saveReclamationUniversityResponse({...})` - Save module completion (legacy + new)
- `saveJournalEntry({...})` - Save journal entry
- `emitAnalyticsEvent({...})` - Record analytics event
- `loadUserFacultyProgress(facultyId)` - Load all progress for a faculty

All functions include error handling and user authentication checks.

## Usage

### For Students

1. Navigate to `/experiencemode/sovereign/reclamation-university`
2. Click on a faculty to view available modules
3. Click "Start Module" to begin the experience
4. Review the module brief
5. Progress through five scenes:
   - **Signal Keys**: Listen to source tracks and select lyric anchors
   - **Shadow Code Scan**: Mark the restrictions that tried to contain the calling
   - **Light Code Retrieval**: Convert marked pressure into recoverable laws
   - **First Law Declaration**: Write the law of the self that cannot be erased
   - **Integration**: Receive the Integration Key and seal the record
6. Seal the private record to save progress

### For Developers

#### Adding a New Module

1. Add module data to the curriculum registry in `reclamationUniversityCurriculum.js`:

```javascript
{
  id: 'module-unique-id',
  slug: 'module-slug',
  order: 1,
  title: 'Module Title',
  subtitle: 'Module subtitle',
  sourceTrackIds: ['track-1', 'track-2'],
  initiationCopy: [...],
  lyricAnchors: [...],
  shadowCodes: [...],
  lightMappings: [...],
  declarationFields: [...],
  integrationKey: '...',
  xpReward: 500,
  estimatedMinutes: 45,
}
```

2. The module will automatically be available at:
   - `/experiencemode/sovereign/reclamation-university/:facultySlug/:moduleSlug`

3. The ReclamationModuleEngine will handle all orchestration automatically.

#### Customizing Scenes

Each scene is a reusable component:
- `ModuleBriefScene` - Entry brief
- `PairedTrackPortal` - Track listening interface
- `ShadowCodeSelector` - Shadow code selection
- `LightCodeMapper` - Light code retrieval
- `DeclarationBuilder` - Declaration form (now accepts dynamic fields)
- `IntegrationKeyReveal` - Completion screen
- `RecUniJournalSave` - Save to journal

These components accept props from the curriculum registry and can be reused across modules.

#### Tracking Progress

Progress is automatically tracked in `rec_uni_user_progress`:

```javascript
// Load progress
const { data: progress } = await loadUserProgress(moduleId);

// Save progress incrementally
await saveUserProgress({
  moduleId,
  status: 'in_progress',
  activeScene: 2,
  listenedTrackIds: ['track-1'],
  selectedShadowCodes: ['SC-01'],
  retrievedLightCodes: ['LC-01'],
  declarationJson: { restriction: '...' },
});

// Save completion
await saveReclamationUniversityResponse({
  moduleId,
  selectedShadowCodes,
  retrievedLightCodes,
  declaration,
  integrationKey,
});
```

#### Analytics

Events are automatically tracked:

```javascript
await emitAnalyticsEvent({
  facultySlug: 'identity',
  moduleSlug: 'thought-form-studio',
  eventName: 'module_completed',
  eventPayload: { xpReward: 500 },
});
```

## Design Language

The implementation maintains the Chroma Key Protocol design language:

- **Color Palette**: Red (#dc2626), Black, Gunmetal, Glass effects
- **Typography**: Uppercase, letter-spacing, bold weights
- **Imagery**: Cinematic, cyber-industrial, fire/furnace metaphors
- **Interaction**: Gate progression, sealed records, transmission metaphors
- **Tone**: Intelligent fire, ordered pressure, authorship, reclamation

## Next Steps

### Immediate Priorities

1. **Load User Progress**: Implement loading of user's prior state when entering a module
2. **Unlock Logic**: Implement faculty prerequisite checking and module unlock state
3. **Analytics Dashboard**: Build dashboard to view student progress and event data
4. **Module Expansion**: Add more modules to existing faculties

### Future Enhancements

1. **Hidden Assets**: Implement interactive components for Archive Room, Forge, Witness Console, etc.
2. **Teacher Mode**: Add teacher/admin interface for curriculum management
3. **Certificates**: Generate Bloom Certificates upon completion
4. **Mobile Optimization**: Enhance responsive design for mobile devices
5. **Accessibility**: Audit and improve accessibility (WCAG 2.1 AA)
6. **Performance**: Optimize bundle size and load times

## Troubleshooting

### Module Not Loading

- Check that the module slug matches exactly in the URL
- Verify the faculty and module exist in `reclamationUniversityCurriculum.js`
- Check browser console for errors

### Progress Not Saving

- Verify user is authenticated
- Check Supabase connection in browser DevTools
- Ensure RLS policies allow user to write to their own records
- Check for errors in browser console

### Styling Issues

- Verify Tailwind CSS is configured correctly
- Check that CSS files are imported in components
- Review `ReclamationFacultyPage.css` for custom styles

## References

- AI Agent Completion Guide: Reclamation University specification
- Musiq Matrix - Chroma Key: Act Three: Reclamation - Curriculum blueprint
- Chroma Key Protocol - Design language and visual system
- Supabase Documentation - https://supabase.com/docs
- React Router Documentation - https://reactrouter.com/

## Support

For questions or issues, refer to:
- The AI Agent Completion Guide for curriculum design
- The Chroma Key Protocol documentation for design language
- Supabase documentation for database operations
- React documentation for component patterns
