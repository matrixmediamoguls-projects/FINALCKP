# Reclamation University

A production-ready, Supabase-backed educational platform for the Chroma Key Protocol. This implementation provides a complete six-faculty curriculum with persistent progress tracking, journal records, unlock logic, and comprehensive analytics.

## Quick Start

### For Students

1. Navigate to `/experiencemode/sovereign/reclamation-university`
2. Browse available faculties
3. Click on a faculty to view modules
4. Click "Start Module" to begin the experience
5. Progress through scenes: Signal Keys → Shadow Codes → Light Codes → Declaration → Integration Key
6. Seal your private record to save progress

### For Developers

#### Installation

```bash
cd /home/ubuntu/FINALCKP
npm install
```

#### Environment Setup

Ensure these environment variables are configured:

```env
VITE_APP_SUPABASE_URL=https://your-project.supabase.co
VITE_APP_SUPABASE_ANON_KEY=your-anon-key
```

#### Database Migrations

Apply the Reclamation University schema migration:

```bash
supabase migration up 20260711000000_create_reclamation_university_schema
```

#### Running Locally

```bash
npm run dev
```

Navigate to `http://localhost:5173/experiencemode/sovereign/reclamation-university`

## Architecture Overview

### Core Components

| Component | Purpose |
|-----------|---------|
| **ReclamationModuleEngine** | Generic orchestrator for any module from the curriculum |
| **ReclamationFacultyPage** | Faculty overview with module list and unlock status |
| **ReclamationModulePage** | Wrapper that loads and renders modules |
| **ModuleBriefScene** | Entry brief and learning sequence |
| **PairedTrackPortal** | Track listening interface with lyric anchors |
| **ShadowCodeSelector** | Mark restrictions and dense material |
| **LightCodeMapper** | Convert shadow codes to light codes |
| **DeclarationBuilder** | Dynamic form for student declarations |
| **IntegrationKeyReveal** | Completion screen with integration key |
| **RecUniJournalSave** | Save completion record to journal |

### Data Flow

```
Student navigates to /reclamation-university/:facultySlug/:moduleSlug
        ↓
ReclamationModulePage loads module from curriculum registry
        ↓
useReclamationModuleProgress hook loads prior progress
        ↓
ReclamationModuleEngine renders with restored state
        ↓
Student progresses through scenes
        ↓
Progress saved incrementally after each scene
        ↓
Analytics events emitted for all interactions
        ↓
On completion: journal entry saved + integration key revealed
```

### Database Schema

**Tables**:
- `rec_uni_faculties` - Faculty metadata and configuration
- `rec_uni_modules` - Module definitions and content
- `rec_uni_user_progress` - Student progress tracking
- `rec_uni_journal_entries` - Student journal records
- `rec_uni_events` - Analytics event tracking

**Security**: All tables have Row-Level Security (RLS) enabled. Users can only access their own data.

### Curriculum Registry

The curriculum is defined in `frontend/src/data/reclamationUniversityCurriculum.js`. Each module includes:

```javascript
{
  id: 'unique-module-id',
  slug: 'module-slug',
  title: 'Module Title',
  subtitle: 'Module subtitle',
  sourceTrackIds: ['track-1', 'track-2'],
  initiationCopy: [...],           // Multi-paragraph narrative
  lyricAnchors: [...],             // Teaching points with lines
  shadowCodes: [...],              // Dense material to be named
  lightMappings: [...],            // Shadow to light code mappings
  declarationFields: [...],        // Dynamic form fields
  integrationKey: '...',           // Completion message
  xpReward: 500,
  estimatedMinutes: 45,
}
```

## Key Features

### Progress Persistence

Progress is automatically saved to Supabase:
- Last active scene
- Listened tracks
- Selected shadow codes
- Retrieved light codes
- Declaration responses
- Completion status

Students can close the browser and resume where they left off.

### Unlock Logic

Faculties unlock based on prerequisites:
- **Foundations** - No prerequisites (always unlocked)
- **Identity** - Requires Foundations completion
- **Language** - Requires Identity completion
- **Thought Forms** - Requires Language completion
- **Sovereign Mind** - Requires Thought Forms completion
- **Aftermath** - Requires Sovereign Mind completion

The unlock status is checked on faculty page load and displayed to students.

### Analytics

Comprehensive event tracking includes:
- `module_viewed` - Student enters module
- `module_brief_completed` - Student completes the module brief
- `track_listened` - Student listens to a source track
- `shadow_code_selected` - Student marks a shadow code
- `light_code_retrieved` - Student retrieves a light code
- `scene_progression` - Student advances to next scene
- `module_completed` - Student completes module

Events include metadata like faculty slug, module slug, and event payload.

### Journal Records

On module completion, a journal entry is automatically created with:
- Module metadata (faculty, module title)
- Student's declaration responses
- Selected shadow codes and retrieved light codes
- Integration key
- Timestamp

Students can view their journal to review past completions.

## Customization

### Adding a New Module

1. Add module data to `reclamationUniversityCurriculum.js`:

```javascript
const MODULES = {
  'identity': {
    modules: [
      {
        id: 'new-module-id',
        slug: 'new-module-slug',
        title: 'New Module Title',
        // ... rest of module config
      }
    ]
  }
};
```

2. The module will automatically be available at:
   - `/experiencemode/sovereign/reclamation-university/identity/new-module-slug`

3. ReclamationModuleEngine will handle all orchestration.

### Customizing Scenes

Each scene is a reusable component that accepts props from the curriculum:

```javascript
<PairedTrackPortal
  sourceTracks={sourceTracksForPortal}
  lyricAnchors={module.lyricAnchors}
  listenedTracks={listenedTracks}
  onMarkListened={toggleListenedTrack}
  onAnchorSelect={setSelectedAnchorKey}
/>
```

Modify scene components in `frontend/src/modules/sovereign/reclamation-university/` to customize appearance and behavior.

### Styling

The implementation uses Tailwind CSS with custom CSS files:
- `reclamationModule.css` - Module engine styling
- `reclamationModuleOverrides.css` - Design language overrides
- `ReclamationFacultyPage.css` - Faculty page styling

Customize colors, typography, and layout in these files.

## Hooks

### useReclamationModuleProgress

Manages module progress loading, saving, and analytics.

```javascript
const { progress, isLoading, isSaving, saveProgress, saveCompletion, trackEvent } =
  useReclamationModuleProgress(moduleId, facultySlug, moduleSlug);
```

### useReclamationFacultyUnlock

Manages faculty unlock status based on prerequisites.

```javascript
const { faculties, completedFacultySlugs, isFacultyAccessible, getFacultyRequirements } =
  useReclamationFacultyUnlock();
```

## API Functions

### Progress Functions

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

### Journal Functions

```javascript
// Save journal entry
await saveJournalEntry({
  moduleId,
  entryType: 'module_completion',
  title: 'Module Completed',
  body: 'Completion notes...',
  payload: { /* data */ },
});
```

### Analytics Functions

```javascript
// Emit event
await emitAnalyticsEvent({
  facultySlug: 'identity',
  moduleSlug: 'thought-form-studio',
  eventName: 'module_completed',
  eventPayload: { xpReward: 500 },
});
```

## Testing

### Manual Testing

1. **Module Loading**: Navigate to a module and verify it loads correctly
2. **Scene Progression**: Click through scenes and verify gates work
3. **Progress Saving**: Close browser and reopen to verify progress persists
4. **Unlock Logic**: Complete a faculty and verify next faculty unlocks
5. **Analytics**: Check Supabase `rec_uni_events` table for events

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## Troubleshooting

### Module Not Loading

- Check browser console for errors
- Verify module slug matches curriculum registry
- Ensure Supabase is connected

### Progress Not Saving

- Verify user is authenticated
- Check Supabase RLS policies
- Look for errors in browser console

### Faculty Locked When Should Be Unlocked

- Verify prerequisite faculty is marked as completed
- Check `rec_uni_user_progress` table for completion records
- Ensure all modules in prerequisite faculty are marked `status: 'completed'`

## Performance

- Module page load: < 2 seconds
- Scene transition: < 500ms
- Progress save: < 1 second
- Analytics event: < 100ms

## Security

- All user data is protected by RLS policies
- No service-role keys in frontend code
- User authentication required for all writes
- Input validation on all forms

## Future Enhancements

- Hidden assets (Archive Room, Forge, Witness Console)
- Teacher/admin interface
- Bloom Certificates on completion
- Mobile optimization
- Accessibility audit (WCAG 2.1 AA)
- Performance optimization
- Module prerequisites
- Video/audio content
- Peer feedback system

## Support

For questions or issues:
- Review `RECLAMATION_UNIVERSITY_IMPLEMENTATION.md` for architecture details
- Check `IMPLEMENTATION_CHECKLIST.md` for testing and deployment steps
- Consult the AI Agent Completion Guide for curriculum design
- Review Supabase documentation for database operations

## License

Part of the Chroma Key Protocol by Matrix Media Moguls.
