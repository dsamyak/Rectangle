# Product Requirements Document (PRD)
## Rectangle: Introduction to Geometry (Shapes)
### Grade 1 Math | Intellia SG — Gamified Simulation Module

**Version:** 1.0  
**Platform:** Web (React SPA) | Hosted at intelliasg.com/courses/grade-1-math/  
**Target Audience:** Grade 1 students (Ages 5–7), global learners  
**Prepared for:** Intellia SG Product Team  
**Learning Framework:** Intellia 5-Step Journey (Wonder → Story → Simulate → Play → Reflect)

---

## 1. Product Overview

This module is a fully interactive, gamified web experience teaching Grade 1 students the concept of **Rectangles** as part of the broader Introduction to Geometry unit. It follows the Intellia SG 5-step learning journey and mirrors the design language, audio architecture, and simulation-first pedagogy established in the `equal-tau.vercel.app` reference module.

The product is a single-page React application that guides a young learner from curiosity (Wonder) through narrative immersion (Story), hands-on exploration (Simulate), skill-testing gameplay (Play), and reflective journaling (Reflect) — all anchored by warm, character-driven voice narration delivered via the ElevenLabs audio pipeline.

---

## 2. Educational Goals

### Primary Learning Objectives
Students will be able to:

1. **Identify** a rectangle by its defining properties: 4 sides, 4 right-angle corners, opposite sides equal in length.
2. **Distinguish** rectangles from other shapes (squares, triangles, circles, hexagons).
3. **Recognize** rectangles in real-world environments (doors, books, phone screens, windows).
4. **Name and trace** the properties: sides and corners (vertices).
5. **Sort and classify** shapes as rectangles or non-rectangles.

### Curriculum Alignment
- **Singapore MOE Primary 1 Math** — Geometry Strand: Recognising and naming 2D shapes
- **US Common Core CCSS.MATH.CONTENT.K.G** — Identify and describe shapes
- **UK National Curriculum KS1** — Recognise and name common 2D shapes
- **Australian Curriculum F-2** — Recognise and classify familiar 2D shapes
- **IB PYP** — Shape, Space and Measure: Properties of shapes

---

## 3. User Personas

| Persona | Description |
|---|---|
| **Primary Learner** | Age 5–7, Grade 1, global student, English-medium instruction, uses tablet or desktop with parental supervision |
| **Parent/Guardian** | Monitors progress, may assist with technical setup; prefers trust signals and clear UI |
| **Teacher** | Assigns module as supplementary activity; needs alignment with curriculum standards |

---

## 4. Learning Flow: 5-Step Journey

### Step 1 — WONDER (Hook & Curiosity)
**Goal:** Pique the child's curiosity before revealing the concept.

- The screen opens with an animated mystery: silhouettes of everyday objects (door, book, phone, window) gently pulse and shimmer.
- A friendly narrating character (Alice, the AI educator voice) asks: *"Do you see something hiding all around you? Look at your door… your book… what shape do you notice?"*
- A glowing question mark floats in the centre. The student taps it to begin.
- No concept name is given yet — the mystery drives engagement.
- Duration: ~45–60 seconds.

**Audio Style:** `question` — higher pitch, slower pace, curious and inviting.

---

### Step 2 — STORY (Narrative Introduction)
**Goal:** Deliver the concept through an emotionally resonant, character-driven story.

**Story: "Sarah's Amazing Shape Adventure"**

Sarah (age 6) is helping her friend Mike set up a picture gallery in their classroom. As they hang paintings on the wall, their robot friend "Robo" points out: *"Every frame you're using — look at their edges! Count the sides… count the corners. They all look the same!"*

Mike notices that the door, the whiteboard, and even his tablet are all the same shape. Robo introduces the word: **"Rectangle!"**

The story includes:
- Animated character vignettes: Sarah, Mike, Robo
- Each story beat highlights a new rectangle property (4 sides → 4 corners → opposite sides equal)
- Real-world connections: picture frame, door, book, phone, window, table

**Narration Beats (each spoken aloud with synced on-screen text):**
1. *"Sarah and Mike were decorating their classroom."*
2. *"Mike picked up a picture frame. 'Robo, how many sides does this have?' he asked."*
3. *"Robo counted: one, two, three, four! Four sides!"*
4. *"'And how many corners?' asked Sarah. One, two, three, four! Four corners too!'"*
5. *"Robo pointed at the door. 'Look — the door is the same shape! Four sides, four corners!'"*
6. *"'This shape,' said Robo, 'is called a RECTANGLE!'"*
7. *"Rectangles have 4 sides and 4 corners. The sides across from each other are the same length."*

**Audio Style:** `statement` / `thinking` / `celebration` (varied per beat).

---

### Step 3 — SIMULATE (Hands-On Exploration)
**Goal:** Let the child explore and discover rectangle properties through interactive manipulation. This is the deepest phase.

#### Simulation 1: Shape Builder
- A drag-and-drop dot-grid canvas.
- The student connects 4 dots to draw a shape. The app checks: Is it a rectangle?
- If yes: corners glow green, sides animate, Robo celebrates.
- If no: gentle corrective feedback. *"Almost! Try making your opposite sides equal!"*

#### Simulation 2: Real-World Spotter
- A cartoon classroom scene (desk, window, door, books, tablet, clock, poster).
- Clickable objects. When clicked, the app highlights the rectangle outline.
- Robo narrates: *"The window! Yes! That's a rectangle. Count the sides with me!"*
- Score counter: "Rectangles found: 3 of 6."

#### Simulation 3: Properties Explorer
- An interactive rectangle on screen with adjustable side lengths (drag handles).
- Top label: "Width" | Side label: "Height"
- Student can widen/stretch the rectangle. Robo comments: *"Look! The opposite sides always stay the same! That's the secret of rectangles!"*
- A "Check my rectangle" button triggers a side-by-side comparison of two opposite sides.

#### Simulation 4: Sort the Shapes
- 8 shapes appear (3 rectangles, 2 squares, 2 triangles, 1 circle) in a jumbled pile.
- Two buckets: "Rectangle" and "Not a Rectangle."
- Drag each shape to the correct bucket.
- Immediate visual + audio feedback per drop.
- Special note on squares: *"A square is a special rectangle — all four sides are the same! But it still has 4 sides and 4 corners."* (age-appropriate nuance, not required to master).

**Audio Style:** Mix of `instruction`, `encouragement`, `thinking`.

---

### Step 4 — PLAY (Gamified Practice)
**Goal:** Test knowledge in a fun, challenge-driven game format.

#### Game: "Robo's Rectangle Quest"
**Narrative framing:** Robo has lost his shape tokens around the city. Help him collect the rectangle tokens!

- **World Map:** A cartoon city with 3 levels (Park, School, Supermarket).
- Each level has 5 questions (randomly selected from a question bank of 20+).
- Correct answers unlock the next level.
- Stars awarded per level (1–3 stars based on accuracy).

**Question Types (all randomised):**
1. **Identify:** "Tap all the rectangles!" (Grid of 6 mixed shapes — random selection each time)
2. **Count:** "How many sides does a rectangle have?" (Multiple choice: 3 / 4 / 5 / 6 — options shuffled)
3. **Real-World Match:** "Which of these is shaped like a rectangle?" (Images: door / ball / triangle sign / pizza)
4. **True or False:** "A rectangle has 4 corners." (True / False — randomly mixed with false variants)
5. **Trace & Identify:** Partially drawn shape — "Is this a rectangle?" (student traces the missing side)
6. **Property Check:** "These two sides are equal. Is this a rectangle?" (Yes / No with visual)
7. **Fill in the blank:** "A rectangle has ___ sides and ___ corners." (Number picker)
8. **Which is different?** (3 rectangles, 1 triangle — odd one out)

**Randomisation Rules:**
- Questions drawn randomly from pool each session (no two sessions identical).
- Answer option order shuffled every render.
- Shape orientations randomised (upright, rotated 90°, rotated 180°).
- Distractor shapes change each attempt.

**Gamification Mechanics:**
- XP points per correct answer (10 XP first try, 5 XP second try).
- Combo multiplier for 3+ in a row.
- Robo reaction animations (happy, confused, celebrating).
- "Try Again" for wrong answers — no elimination, encouragement-first.
- Level completion badge with star rating.
- Unlockable Robo stickers as rewards.

**Audio Style:** `encouragement` / `celebration` / `question`.

---

### Step 5 — REFLECT (Consolidation & Journaling)
**Goal:** Cement learning through self-expression. Lesson complete only here.

- Robo prompts: *"Wow, you found so many rectangles today! Can you tell me — what makes a rectangle special? Use your own words!"*
- Two options:
  1. **Voice Record:** Student records a short voice response (10–30 seconds). Robo listens with animated ears.
  2. **Draw & Label:** Drawing canvas — student draws a rectangle and labels "sides" and "corners."
- After completing either, a "Lesson Complete!" celebration screen plays.
- Summary card: "Today you learned: Rectangles have 4 sides and 4 corners. Opposite sides are equal."
- Share button: Download a printable "Shape Hero" certificate with the student's name.

**Audio Style:** `celebration` for completion.

---

## 5. Audio Architecture

Follows the ElevenLabs pipeline defined in `audio_generation_pipeline.md`:

- **Voice:** Alice (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`
- **Pre-generated:** All story, simulation instruction, and celebration lines stored as `.mp3` in `public/assets/audio/`
- **Dynamic fallback:** On-the-fly generation for feedback variations via `/api/elevenlabs`
- **Preloading:** Segment `i+1` loaded while segment `i` plays (zero-latency transitions)
- **1:1 parity:** Every spoken line matches on-screen text exactly

### Key Audio Segments (Phase → Style):
| Phase | Example Line | Style |
|---|---|---|
| Wonder | "Do you see something hiding all around you?" | `question` |
| Story | "This shape is called a RECTANGLE!" | `celebration` |
| Simulate | "Try making your opposite sides equal!" | `thinking` |
| Play Correct | "Amazing! That's a rectangle!" | `encouragement` |
| Play Wrong | "Hmm, let's look at that shape again!" | `thinking` |
| Reflect | "What makes a rectangle special?" | `question` |
| Complete | "You're a Shape Hero today!" | `celebration` |

---

## 6. UI/UX Requirements

### Design Language (Strict — matches equal-tau reference)
- Warm, vibrant colour palette: blues, purples, oranges, greens — per Intellia brand
- Rounded card components with soft drop shadows
- Large, chunky typography for young readers (minimum 18px body, 28px+ headings)
- Full-screen phase transitions with smooth slide/fade animations
- Progress indicator: 5-step phase bar at top (highlighted step glows)
- Mobile-first responsive: works on 320px → 1440px
- Touch-optimised: all interactive targets minimum 44×44px

### Characters
- **Sarah:** Curious girl with dark hair, purple hoodie (matches Intellia illustration style)
- **Mike:** Enthusiastic boy with orange hoodie
- **Robo:** Blue-accented friendly robot (the Intellia LearnFlow AI mascot)

### Accessibility
- All audio has visible on-screen subtitle/caption sync
- Colour contrast minimum 4.5:1
- Keyboard navigable (for teacher/parent preview)
- All images have alt text

---

## 7. Success Metrics

| Metric | Target |
|---|---|
| Phase Completion Rate | >85% of students who start reach Reflect |
| Play Accuracy (first attempt) | >70% correct on first try |
| Average Session Duration | 12–18 minutes |
| Return Rate (play again) | >40% within 7 days |
| Star Rating | Average ≥ 2.5 stars on Play phase |
| Parent NPS | ≥ 8/10 |

---

## 8. Out of Scope (v1.0)

- Teacher dashboard / analytics
- Multi-language narration (English only in v1)
- Offline PWA support
- Parent progress email reports
- Perimeter / area calculations (reserved for higher grades)

---

## 9. Dependencies

- ElevenLabs API key (pre-generation and dynamic fallback)
- Intellia SG brand assets (character illustrations, Robo mascot)
- Hosting on intelliasg.com under `/courses/grade-1-math/rectangle`
- React + Vite build toolchain
- Tailwind CSS for styling

---

*Document Version 1.0 — Intellia SG | Rectangle Module PRD*
