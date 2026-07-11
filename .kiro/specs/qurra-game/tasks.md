# Implementation Plan: QURRA (Quranic Understanding: Reading Rules Adventure)

## Overview

This implementation plan breaks down the QURRA game-based learning platform into discrete coding tasks. The application uses Nuxt 3, Vue 3 Composition API, TypeScript, Tailwind CSS, and Phaser.js 3 to create an interactive 2D game for teaching Tajwid rules. Tasks are organized to build incrementally, with early validation through testing and checkpoints to ensure quality at each stage.

## Tasks

- [x] 1. Set up project structure and configuration
  - Initialize Nuxt 3 project with TypeScript and strict mode enabled
  - Configure Tailwind CSS with custom Islamic theme (green, dark blue, gold, cream colors)
  - Set up Phaser.js 3 behind a lazy client-only loader so the engine is not imported before a game route requests it
  - Create project directory structure (components/, composables/, types/, game/)
  - Configure ESLint and Prettier for code quality
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 2. Define core TypeScript interfaces and types
  - Create types/game.ts with Question, TajwidRule, QuestionResult interfaces
  - Create types/storage.ts with GameProgress, LevelProgress, Badge interfaces
  - Create types/tajwid.ts with content-related types
  - Define GameEvents and EventBridge interfaces for Phaser-Vue communication
  - _Requirements: 14.2, 14.6_

- [x] 3. Implement localStorage persistence layer
  - [x] 3.1 Create composables/useLocalStorage.ts with save and load functions
    - Implement saveProgress and loadProgress functions
    - Add error handling for quota exceeded, access denied, and unavailable scenarios
    - Return default empty progress object when localStorage is empty or unavailable
    - _Requirements: 3.2, 10.1, 10.3, 17.2_
  
  - [x]* 3.2 Write property tests for localStorage persistence
    - **Property 3: localStorage Persistence Round-Trip**
    - **Validates: Requirements 3.2, 6.3, 8.3, 9.3, 10.1, 10.5**
    - Test that any valid GameProgress object saved then retrieved is equivalent

- [x] 4. Implement progress tracking composable
  - [x] 4.1 Create composables/useGameProgress.ts
    - Implement reactive progress state loaded from localStorage
    - Create updateLevelProgress function to update specific level data
    - Create markLevelComplete function
    - Persist changes to localStorage on updates
    - _Requirements: 3.2, 3.3, 10.1, 10.2, 10.4_
  
  - [x]* 4.2 Write property tests for progress percentage calculation
    - **Property 5: Progress Percentage Calculation**
    - **Validates: Requirements 2.2, 10.2, 10.4**
    - Test that (answeredQuestions / totalQuestions) × 100 equals displayed percentage

- [x] 5. Implement score management composable
  - [x] 5.1 Create composables/useScore.ts
    - Implement reactive score state initialized from localStorage
    - Create incrementScore function that adds 10 points for correct answers
    - Create getTotalScore function to aggregate scores across levels
    - Persist score to localStorage on updates
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [x]* 5.2 Write property tests for score increment consistency
    - **Property 1: Score Increment Consistency**
    - **Validates: Requirements 6.2, 8.2**
    - Test that for any initial score and correct answer, score increases by exactly 10 points
  
  - [x]* 5.3 Write property test for score immutability on incorrect answers
    - **Property 2: Score Immutability on Incorrect Answers**
    - **Validates: Requirements 7.3**
    - Test that for any initial score and incorrect answer, score remains unchanged

- [x] 6. Implement badge system composable
  - [x] 6.1 Create composables/useBadges.ts
    - Define BADGE_DEFINITIONS constant with all 5 level badges
    - Implement awardBadge function that checks conditions and adds badge
    - Create getEarnedBadges function to retrieve player badges
    - Persist badges to localStorage when awarded
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x]* 6.2 Write property test for level-badge mapping consistency
    - **Property 4: Level-Badge Mapping Consistency**
    - **Validates: Requirements 3.5, 9.2**
    - Test that level completion awards badge with matching levelId

- [ ] 7. Create question content data
  - [ ] 7.1 Create content/questions directory and JSON files
    - Create level-1-nun-sukun.json with 10 questions
    - Create level-2-mim-sukun.json with 10 questions
    - Create level-3-mad.json with 10 questions
    - Create level-4-qalqalah.json with 10 questions
    - Create level-5-review.json with 10 questions
    - Include verseText, verseReference, highlightRange, correctAnswer, and options for each question
    - Validate every verse reference, highlighted segment, tajwid rule, and explanation with a qualified tajwid reviewer before release
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [x]* 7.2 Write property test for question data structure validity
    - **Property 18: Question Data Structure Validity**
    - **Validates: Requirements 13.4**
    - Test that all question files parse as valid JSON conforming to Question interface
  
  - [x]* 7.3 Write property test for question option count constraint
    - **Property 15: Question Option Count Constraint**
    - **Validates: Requirements 5.3**
    - Test that all questions have 3-5 answer options

- [x] 8. Implement level configuration data
  - Create game/levels.ts with LEVEL_CONFIGS constant (Phaser runtime configuration remains in game/config.ts)
  - Define all 5 levels with id, name, description, tajwidCategory, questionCount, pointsPerQuestion
  - Include badge reward configuration for each level
  - _Requirements: 3.1, 9.1_

- [x] 9. Checkpoint - Verify data layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Create base UI components
  - [x] 10.1 Create components/layout/AppHeader.vue
    - Display QURRA logo and application name
    - Include navigation links using NuxtLink
    - Apply Islamic-themed styling with Tailwind
    - Make responsive for mobile and desktop viewports
    - _Requirements: 12.1, 12.2, 12.5_
  
  - [x] 10.2 Create components/layout/AppFooter.vue
    - Display branding and credits
    - Apply Islamic-themed styling
    - _Requirements: 12.1, 12.2, 12.5_
  
  - [x] 10.3 Create components/ui/ProgressBar.vue
    - Accept percentage prop
    - Display visual progress bar with fill animation
    - Use Islamic color theme (green for fill, gold accents)
    - _Requirements: 2.2, 10.4, 12.1_
  
  - [x]* 10.4 Write unit tests for ProgressBar component
    - Test that prop percentage correctly renders visual fill
    - Test edge cases (0%, 100%, invalid values)
    - _Requirements: 2.2, 10.4_

- [x] 11. Create score and badge display components
  - [x] 11.1 Create components/ui/ScoreDisplay.vue
    - Accept score prop
    - Display score with number formatting
    - Include star or coin icon
    - Apply Islamic styling
    - _Requirements: 2.3, 8.4, 12.1_
  
  - [x] 11.2 Create components/ui/BadgeDisplay.vue
    - Accept badges array prop
    - Display badge icons in grid layout
    - Show badge name and description on hover/tap
    - Apply responsive layout for mobile
    - _Requirements: 2.4, 9.4, 11.1, 11.2, 12.2_
  
  - [x]* 11.3 Write property test for badge display completeness
    - **Property 11: Badge Display Completeness**
    - **Validates: Requirements 2.4, 9.4**
    - Test that displayed badges exactly match earned badges with no omissions

- [x] 12. Create level selection component
  - [x] 12.1 Create components/ui/LevelCard.vue
    - Accept level configuration and progress props
    - Display level name, description, and completion status
    - Display progress percentage using ProgressBar component
    - Include clickable area to navigate to game page
    - Apply Islamic-themed card design with hover effects
    - Make touch-friendly with minimum 44x44px tap targets
    - _Requirements: 2.1, 2.2, 2.5, 11.6, 12.1, 12.2_
  
  - [x]* 12.2 Write property test for touch target minimum size
    - **Property 21: Touch Target Minimum Size**
    - **Validates: Requirements 11.6**
    - Test that interactive elements on mobile are at least 44x44 pixels

- [x] 13. Implement landing page
  - [x] 13.1 Create pages/index.vue
    - Display application name "QURRA (Quranic Understanding: Reading Rules Adventure)"
    - Display brief description of application purpose
    - Include call-to-action button to navigate to Dashboard
    - Use LandingHero component for hero section
    - Apply Islamic-themed design with green, dark blue, gold, cream colors
    - Make fully responsive for mobile and desktop
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 12.1, 12.2, 12.5_
  
  - [x] 13.2 Create components/ui/LandingHero.vue
    - Design hero section with compelling visual elements
    - Include Islamic motifs (lanterns, stars, books)
    - Display CTA button with navigation to /dashboard
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 12.2, 12.4_

- [x] 14. Implement dashboard page
  - [x] 14.1 Create pages/dashboard.vue
    - Load progress data using useGameProgress composable
    - Display total score using ScoreDisplay component
    - Display earned badges using BadgeDisplay component
    - Render all 5 levels using LevelCard components
    - Handle level selection and navigation to /game/[level]
    - Apply Islamic-themed layout with adventure motifs
    - Make responsive for mobile and desktop
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 11.1, 11.2, 11.3, 12.1, 12.2, 12.4, 12.5_
  
  - [x]* 14.2 Write property test for navigation route mapping
    - **Property 14: Navigation Route Mapping**
    - **Validates: Requirements 2.5**
    - Test that selecting level with ID 1-5 navigates to /game/[levelId]
  
  - [x]* 14.3 Write property test for total score aggregation
    - **Property 12: Total Score Aggregation**
    - **Validates: Requirements 8.5**
    - Test that displayed total score equals sum of all level scores

- [x] 15. Checkpoint - Verify UI layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Implement Phaser-Vue event bridge
  - [ ] 16.1 Create game/bridge/EventBridge.ts
    - Implement EventBridge class with emit, on, off methods
    - Define type-safe event handlers for GameEvents interface
    - Handle event subscription cleanup
    - _Requirements: 4.1, 4.2_
  
  - [ ] 16.2 Create composables/usePhaserBridge.ts
    - Create singleton event bridge instance
    - Provide connectToGame and disconnect methods
    - Expose typed event emission and subscription functions
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 16.3 Write integration tests for event bridge
    - Test that events emitted from Phaser are received in Vue
    - Test that events emitted from Vue are received in Phaser
    - Test event subscription cleanup on disconnect

- [ ] 17. Implement Phaser game configuration
  - Create game/config.ts with Phaser game configuration
  - Set type to Phaser.AUTO for WebGL with Canvas fallback
  - Configure responsive canvas scaling
  - Define scene array with BootScene, GameScene, QuestionScene, FeedbackScene
  - Set up Islamic color theme background
  - _Requirements: 4.1, 4.2, 4.5, 11.5, 17.1_

- [ ] 18. Implement Phaser boot scene
  - [ ] 18.1 Create game/scenes/BootScene.ts
    - Preload game assets (character sprites, backgrounds, UI elements)
    - Display loading progress indicator
    - Transition to GameScene when loading complete
    - Handle asset loading errors gracefully
    - _Requirements: 4.1, 4.2, 17.1, 17.3_
  
  - [ ]* 18.2 Write unit tests for BootScene
    - Test that scene preloads required assets
    - Test error handling for failed asset loads

- [ ] 19. Implement question management system
  - [ ] 19.1 Create game/systems/QuestionManager.ts
    - Load questions for specified level from JSON data
    - Track current question index
    - Provide getNextQuestion function
    - Implement evaluateAnswer function comparing selected vs correct answer
    - Enforce single submission per question
    - _Requirements: 5.1, 5.4, 5.5, 13.1, 13.4_
  
  - [ ]* 19.2 Write property test for answer evaluation correctness
    - **Property 7: Answer Evaluation Correctness**
    - **Validates: Requirements 5.4**
    - Test that evaluation returns true if and only if selected ID matches correct answer ID
  
  - [ ]* 19.3 Write property test for single submission enforcement
    - **Property 8: Single Submission Enforcement**
    - **Validates: Requirements 5.5**
    - Test that subsequent submissions after first are rejected

- [ ] 20. Implement Phaser game scene
  - [ ] 20.1 Create game/scenes/GameScene.ts
    - Initialize game scene with Islamic adventure background
    - Create and display player character sprite
    - Set up scene layout and UI positioning
    - Listen for 'game:start' event from Vue to load level
    - Initialize QuestionManager with level data
    - Transition to QuestionScene when ready
    - _Requirements: 4.2, 4.3, 4.5, 5.1, 12.1, 12.2, 12.4_
  
  - [ ]* 20.2 Write unit tests for GameScene initialization
    - Test that scene correctly initializes with level data
    - Test transition to QuestionScene

- [ ] 21. Implement Phaser question scene
  - [ ] 21.1 Create game/scenes/QuestionScene.ts
    - Display current question verse text with proper Arabic typography
    - Display verse reference below verse text
    - Render 3-5 multiple choice options as interactive buttons
    - Highlight selected option on click/tap
    - Submit the selected answer through an explicit submit action
    - Provide a skip action that submits null exactly once and records the Question as answered and incorrect
    - Emit 'question:answered' event to Vue with QuestionResult
    - Transition to FeedbackScene after answer submission
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 13.2, 13.5_
  
  - [ ]* 21.2 Write property test for verse text display consistency
    - **Property 16: Verse Text Display Consistency**
    - **Validates: Requirements 5.2**
    - Test that displayed verse text exactly matches question verseText property
  
  - [ ]* 21.3 Write property test for question sequence ordering
    - **Property 6: Question Sequence Ordering**
    - **Validates: Requirements 5.1**
    - Test that questions display in array order with sequential indexing

- [ ] 22. Implement Phaser feedback scene
  - [ ] 22.1 Create game/scenes/FeedbackScene.ts for correct answers
    - Display positive feedback message ("Benar! Luar biasa!")
    - Show encouraging visual elements (stars, sparkles, checkmarks)
    - Animate player character celebration
    - Keep feedback visible for at least 2 seconds and automatically continue no later than 5 seconds
    - Transition to next question or level complete based on question count
    - _Requirements: 4.4, 6.1, 6.5, 6.6_
  
  - [ ] 22.2 Extend FeedbackScene.ts for incorrect answers
    - Display correct Tajwid_Rule name in Arabic and Indonesian
    - Display brief explanation (2-3 sentences maximum)
    - Highlight verse excerpt range corresponding to correct rule using highlightRange
    - Display an immediately available continue action with no minimum reading delay
    - Keep feedback visible until Player activates continue
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6, 13.6_
  
  - [ ]* 22.3 Write property test for feedback display for all answers
    - **Property 9: Feedback Display for All Answers**
    - **Validates: Requirements 6.1, 7.1, 7.2**
    - Test that any answer submission displays feedback with appropriate content
  
  - [ ]* 22.4 Write property test for highlight range correspondence
    - **Property 17: Highlight Range Correspondence**
    - **Validates: Requirements 7.5**
    - Test that highlighted text corresponds to highlightRange indices in verse text
  
  - [ ]* 22.5 Write property test for Tajwid explanation conciseness
    - **Property 19: Tajwid Explanation Conciseness**
    - **Validates: Requirements 13.6**
    - Test that explanation sentence count is at most 3

- [ ] 23. Implement game state transitions and level completion
  - [ ] 23.1 Add question progression logic to FeedbackScene
    - Check if current question is last in sequence
    - If not last, emit event and transition to QuestionScene with next question
    - If last, emit 'level:completed' event to Vue with final score
    - _Requirements: 6.4, 7.4, 3.3_
  
  - [ ]* 23.2 Write property test for question state progression
    - **Property 10: Question State Progression**
    - **Validates: Requirements 6.4, 7.4**
    - Test that after feedback for non-last question, system transitions to next question

- [ ] 24. Implement Phaser container component
  - [ ] 24.1 Create components/game/PhaserContainer.vue
    - Create container div with ref for Phaser game mounting
    - Initialize Phaser.Game instance in onMounted with game configuration
    - Connect event bridge to game instance
    - Emit 'game:start' event with level ID on mount
    - Clean up game instance and disconnect bridge in onBeforeUnmount
    - Handle Phaser initialization errors with fallback UI
    - _Requirements: 4.1, 4.5, 4.6, 17.1_
  
  - [ ]* 24.2 Write integration tests for PhaserContainer lifecycle
    - Test that Phaser game initializes on mount
    - Test that game destroys on unmount
    - Test error handling for initialization failure

- [ ] 25. Implement game overlay components
  - [ ] 25.1 Create components/game/GameOverlay.vue
    - Display current score during gameplay
    - Include pause button (future feature placeholder)
    - Apply semi-transparent overlay styling
    - Position absolutely over Phaser canvas
    - _Requirements: 8.4_
  
  - [ ] 25.2 Create components/game/FeedbackModal.vue
    - Accept feedback data (correct/incorrect, message, explanation)
    - Display modal overlay with feedback content
    - Include continue button to proceed
    - Apply Islamic styling with appropriate colors
    - _Requirements: 6.1, 6.5, 7.1, 7.2_

- [ ] 26. Implement game page
  - [ ] 26.1 Create pages/game/[level].vue dynamic route
    - Extract level ID from route params
    - Verify level ID is valid (1-5)
    - Render PhaserContainer component with level ID
    - Render GameOverlay component
    - Listen for 'question:answered' event and update score via useScore
    - Listen for 'score:updated' event and update UI
    - Listen for 'level:completed' event to handle completion
    - On level completion: update progress, award badge, navigate to dashboard
    - Make responsive for mobile and desktop
    - _Requirements: 2.5, 3.3, 3.5, 6.2, 6.3, 6.4, 7.3, 7.4, 8.2, 8.3, 9.2, 9.3, 11.1, 11.2, 11.3_
  
  - [ ]* 26.2 Write property test for level accessibility invariant
    - **Property 13: Level Accessibility Invariant**
    - **Validates: Requirements 3.4**
    - Test that any level remains accessible regardless of completion status

- [ ] 27. Checkpoint - Verify game integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 28. Implement responsive canvas scaling
  - [ ] 28.1 Add resize handling to PhaserContainer.vue
    - Listen for window resize events
    - Call Phaser game.scale.resize with new dimensions
    - Maintain aspect ratio during scaling
    - Update canvas dimensions based on viewport size
    - _Requirements: 4.5, 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 28.2 Write property test for canvas proportional scaling
    - **Property 20: Canvas Proportional Scaling**
    - **Validates: Requirements 11.5**
    - Test that canvas aspect ratio remains constant during viewport changes

- [ ] 29. Implement error handling across application
  - [ ] 29.1 Add localStorage error handling
    - Wrap localStorage calls in try-catch blocks
    - Display warning modal when localStorage is full (quota exceeded)
    - Display warning when localStorage is unavailable (privacy mode)
    - Allow temporary in-memory state when localStorage fails
    - _Requirements: 10.6, 17.2_
  
  - [ ] 29.2 Add Phaser initialization error handling
    - Catch Phaser game initialization errors in PhaserContainer
    - Display fallback UI with error message and dashboard link
    - Log error details to console
    - _Requirements: 17.1_
  
  - [ ] 29.3 Add question data loading error handling
    - Wrap question file imports in try-catch
    - Display error modal with retry button
    - Allow navigation back to dashboard on error
    - Log error to console
    - _Requirements: 17.3_
  
  - [ ] 29.4 Add global Vue error handler
    - Configure app.config.errorHandler in app.vue or plugin
    - Log errors to console
    - Prevent full application crash
    - _Requirements: 17.4, 17.5_
  
  - [ ]* 29.5 Write property test for error logging completeness
    - **Property 23: Error Logging Completeness**
    - **Validates: Requirements 17.4**
    - Test that any caught runtime error writes to console
  
  - [ ]* 29.6 Write property test for error recovery options availability
    - **Property 24: Error Recovery Options Availability**
    - **Validates: Requirements 17.6**
    - Test that error UI provides at least one recovery action

- [ ] 30. Implement PWA readiness features
  - Create public/manifest.json with app metadata
  - Add meta tags for mobile browsers in app.vue or nuxt.config.ts
  - Document and configure HTTPS requirements for the selected production deployment target
  - Add placeholder for future service worker
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 31. Optimize performance and bundle size
  - [ ] 31.1 Configure lazy loading for Phaser
    - Use dynamic import for Phaser.js only on game routes
    - Verify Phaser loads only when /game/[level] is accessed
    - _Requirements: 16.3_
  
  - [ ] 31.2 Optimize images and assets
    - Compress all image assets
    - Use appropriate image formats (WebP with fallbacks)
    - Implement responsive image loading
    - _Requirements: 16.4_
  
  - [ ] 31.3 Enable code splitting and tree shaking
    - Configure Vite to split vendor and app bundles
    - Verify tree shaking removes unused code
    - Monitor bundle sizes in build output
    - _Requirements: 16.5_
  
  - [ ]* 31.4 Write performance test for navigation speed
    - **Property 22: Navigation Performance Bound**
    - **Validates: Requirements 16.6**
    - Test that route transitions complete within 200 milliseconds

- [ ] 32. Add visual enhancements and animations
  - Implement smooth transitions between pages using Vue transitions
  - Add hover and tap animations to buttons and cards
  - Implement fade-in animations for modals and overlays
  - Add celebration animations for level completion
  - Ensure animations don't cause distraction or accessibility issues
  - _Requirements: 12.6_

- [ ] 33. Implement badge unlock notification
  - Create notification component that displays when badge is earned
  - Show badge icon, name, and description
  - Animate notification entrance and exit
  - Auto-dismiss after 5 seconds with manual close option
  - _Requirements: 9.5, 9.6_

- [ ] 34. Final integration and testing
  - [ ] 34.1 Test complete user flows end-to-end
    - Landing page → Dashboard navigation
    - Dashboard → Level selection → Game page
    - Answer all questions in a level correctly
    - Answer all questions in a level incorrectly
    - Complete a level and verify badge award
    - Verify progress persistence across page reloads
  
  - [ ] 34.2 Test responsive behavior across viewport sizes
    - Test on mobile viewport (<768px)
    - Test on tablet viewport (768px-1024px)
    - Test on desktop viewport (>1024px)
    - Verify Arabic text readability at all sizes
    - Verify touch targets are adequate on mobile
  
  - [ ] 34.3 Run Lighthouse audits
    - Achieve performance score ≥80 on desktop
    - Achieve performance score ≥70 on mobile
    - Verify Largest Contentful Paint ≤3 seconds on an initial production-build load with Lighthouse mobile throttling
    - Verify accessibility score is satisfactory
    - _Requirements: 16.1, 16.2_
  
  - [ ] 34.4 Verify TypeScript compilation
    - Run TypeScript compiler with strict mode
    - Ensure zero compilation errors
    - Fix any type errors or warnings
    - _Requirements: 14.2, 14.6_

- [ ] 35. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- All property-based tests use fast-check library with minimum 100 iterations
- Each property test references specific properties from the design document
- Checkpoints ensure incremental validation and quality gates
- Focus on implementing core gameplay first, then polish with animations and enhancements
- localStorage failures gracefully degrade to in-memory state management
- All code uses TypeScript with strict type checking enabled
- Islamic visual theme is applied consistently across all components
- Responsive design ensures mobile-first approach with desktop enhancements

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2"] },
    { "id": 1, "tasks": ["3.1", "8"] },
    { "id": 2, "tasks": ["3.2", "4.1", "5.1", "6.1"] },
    { "id": 3, "tasks": ["4.2", "5.2", "5.3", "6.2", "7.1"] },
    { "id": 4, "tasks": ["7.2", "7.3", "10.1", "10.2", "10.3"] },
    { "id": 5, "tasks": ["10.4", "11.1", "11.2"] },
    { "id": 6, "tasks": ["11.3", "12.1"] },
    { "id": 7, "tasks": ["12.2", "13.2"] },
    { "id": 8, "tasks": ["13.1"] },
    { "id": 9, "tasks": ["14.1"] },
    { "id": 10, "tasks": ["14.2", "14.3", "16.1", "17"] },
    { "id": 11, "tasks": ["16.2", "18.1"] },
    { "id": 12, "tasks": ["16.3", "18.2", "19.1"] },
    { "id": 13, "tasks": ["19.2", "19.3", "20.1"] },
    { "id": 14, "tasks": ["20.2", "21.1"] },
    { "id": 15, "tasks": ["21.2", "21.3", "22.1"] },
    { "id": 16, "tasks": ["22.2"] },
    { "id": 17, "tasks": ["22.3", "22.4", "22.5", "23.1"] },
    { "id": 18, "tasks": ["23.2", "24.1", "25.1", "25.2"] },
    { "id": 19, "tasks": ["24.2", "26.1"] },
    { "id": 20, "tasks": ["26.2", "28.1"] },
    { "id": 21, "tasks": ["28.2", "29.1", "29.2", "29.3", "29.4"] },
    { "id": 22, "tasks": ["29.5", "29.6", "30", "31.1", "31.2", "31.3"] },
    { "id": 23, "tasks": ["31.4", "32", "33"] },
    { "id": 24, "tasks": ["34.1", "34.2", "34.3", "34.4"] }
  ]
}
```
