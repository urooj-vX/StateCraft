# StateCraft

> **A digital alchemy sandbox where order and chaos dance at the edge of emergence**

StateCraft is an interactive element-combining game that thrives on instability. It's a system where simple rules cascade into unexpected complexity, where your discoveries mutate the game's behavior, and where the act of creation itself becomes increasingly unpredictable.

---

## 🎯 The Core Concept

StateCraft lives in the sweet spot between control and collapse. Start with four basic elements (Water, Fire, Air, Earth), combine them to create new discoveries, and watch as the system evolves through **feedback loops**, **emergent behavior**, and **adaptive rules** that respond to your creative chaos.

### What Makes It Unstable?

1. **AI-Driven Emergence** - Element combinations aren't predetermined. An AI generates new elements based on context, meaning the same combination can yield different results as your world evolves.

2. **Git-Inspired Version Control** - Your discoveries are tracked as commits and branches. The system automatically categorizes your progress (volcanic, geological, atmospheric) and creates divergent timelines based on your exploration patterns.

3. **Feedback Loops** - The more you discover, the more complex the combinations become. Late-game elements reference earlier discoveries, creating a self-referential web of dependencies.

4. **Entropy Mechanics** - Element categories drift from basic → structure → process → system → event, with each tier introducing more instability and unpredictability.

---

## 🔬 Technical Architecture

### Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand with persistence
- **Drag & Drop**: @dnd-kit/core (optimized for element fusion)
- **Styling**: TailwindCSS + Framer Motion
- **AI Integration**: Multi-provider support (Gemini, OpenAI, Anthropic)
- **Audio**: Web Audio API for procedural sound effects

### Key Systems

#### 1. Element Combination Engine
```typescript
// src/store/gameStore.ts
combineElements(canvasId1, canvasId2) → Promise<void>
```
- Checks recipe cache for known combinations
- Falls back to AI generation for novel fusions
- Categorizes results using pattern matching
- Triggers version control commits for significant discoveries

#### 2. Version Control System
```typescript
// src/lib/versionControl.ts
```
- **Commits**: Auto-generated when discovering tier 2+ elements
- **Branches**: Created based on exploration themes (volcanic, hydrology, etc.)
- **Diffs**: Track added elements, processes, and systems
- **Time Travel**: Checkout previous commits to restore earlier world states

#### 3. Dynamic Categorization
Elements are classified into 5 categories that determine commit behavior:
- `basic` - Starting elements (Water, Fire, Air, Earth)
- `structure` - Physical formations (Mountain, Crystal, Rock)
- `process` - Ongoing transformations (Erosion, Photosynthesis, Fusion)
- `system` - Complex ecosystems (Ocean, Forest, Wetland)
- `event` - Dramatic occurrences (Eruption, Black Hole, Supernova)

#### 4. Adaptive Audio
```typescript
// src/lib/audio.ts
soundManager.playPop()    // Element pickup
soundManager.playSnap()   // Successful drop
soundManager.playSuccess() // New discovery
soundManager.playFailure() // Rediscovery
```

---

## 🎮 How to Play

### Installation
```bash
npm install
npm run dev
```

### Gameplay Loop
1. **Drag** elements from the sidebar onto the canvas
2. **Combine** by dropping one element onto another
3. **Discover** new elements through AI-powered fusion
4. **Explore** branching evolution paths via the version control system
5. **Observe** emergent patterns as complexity compounds

### Advanced Features
- **Menu System**: Access settings, history, and world state
- **Dark Mode**: Toggle visual theme
- **Sound Control**: Enable/disable audio feedback
- **Git Terminal**: View commit history and branch structure
- **Discovery Guide**: Track unlocked elements by category

---

## 🌀 Instability Mechanics (Hackathon Features)

### ✅ Feedback Loops
- **Self-Referential Recipes**: Later elements consume earlier discoveries as ingredients
- **Contextual AI**: The AI considers your entire library when generating new elements
- **Cascading Complexity**: Each discovery expands the possibility space exponentially

### ✅ Entropy Visuals
- **Particle Background**: Dynamic particle system responds to canvas activity
- **Framer Motion**: Elements animate with spring physics during drag/drop
- **Category-Based Colors**: Visual coding shifts as elements evolve through tiers

### ✅ Adaptive Rules
- **Dynamic Categorization**: Elements are classified based on name/description patterns
- **Commit Thresholds**: Only significant discoveries trigger version control events
- **Branch Auto-Creation**: System analyzes recent discoveries to suggest exploration paths

### ✅ Emergent Behavior
- **Unexpected Combinations**: AI can generate results that surprise even the creator
- **Cross-Domain Fusion**: Black Hole + Mountain = Absorption (cosmic meets geological)
- **Tier Escalation**: Basic elements → Structures → Processes → Systems → Events

### ✅ Collapse Events
- **Super Eruptions**: Volcanic chains can cascade into global ash clouds
- **Extinction Events**: Supernova + Earth triggers ecosystem collapse/rebirth
- **Black Hole Absorption**: Cosmic events consume geological formations

---

## 🧬 Example Evolution Path

```
Water + Earth → Mud
Mud + Plant → Swamp
Swamp + Time → Bog
Bog + Pressure → Peat

Fire + Earth → Lava
Lava + Earth → Volcano
Volcano + Pressure → Super Volcano
Super Volcano + Eruption → Super Eruption
Super Eruption + Ash → Global Ash Cloud
```

Notice how **Time** and **Pressure** act as catalysts for instability, transforming stable structures into dynamic processes.

---

## 📊 System Metrics

- **Initial Elements**: 4 (Water, Fire, Air, Earth)
- **Static Recipes**: 50+ predefined combinations
- **AI-Generated Potential**: Infinite (limited only by creativity)
- **Element Categories**: 5 (basic, structure, process, system, event)
- **Version Control**: Full git-inspired commit/branch system
- **Persistence**: LocalStorage via Zustand middleware

---

## 🎨 Design Philosophy

StateCraft embraces **controlled chaos**. The rules are simple:
1. Combine two elements
2. Get a result

But the *outcomes* are unpredictable:
- Will the AI generate something logical or surreal?
- Will this discovery trigger a commit?
- Will a new branch emerge from this exploration path?

The game doesn't break—it **evolves**. Each session creates a unique world history, a personal timeline of creative experimentation.

---

## 🚀 Future Instability Enhancements

- **Mutation System**: Elements slowly drift in properties over time
- **Decay Mechanics**: Unstable elements break down into components
- **Multiplayer Chaos**: Collaborative worlds where players' discoveries influence each other
- **Procedural Sound**: Audio generated from element properties
- **Visual Glitches**: UI artifacts that emerge from complex combinations

---

## 🛠️ Development

### Project Structure
```
src/
├── components/          # UI components (Canvas, Sidebar, Modals)
├── lib/
│   ├── ai/             # Multi-provider AI integration
│   ├── audio.ts        # Sound effect manager
│   ├── gitCommands.ts  # Version control utilities
│   ├── recipes.ts      # Static element combinations
│   └── versionControl.ts # Commit/branch logic
├── store/
│   └── gameStore.ts    # Zustand state management
├── types/
│   └── index.ts        # TypeScript definitions
└── App.tsx             # Main application + DnD context
```

### Key Dependencies
- `@dnd-kit/core` - Collision detection and drag overlay
- `zustand` - Lightweight state management with persistence
- `framer-motion` - Physics-based animations
- `lucide-react` - Icon system
- `idb-keyval` - IndexedDB wrapper for AI response caching

---

## 🎯 Hackathon Alignment

StateCraft directly addresses the challenge of building systems that **thrive on instability**:

- **Not stable**: AI generation introduces unpredictability
- **Not random**: Combinations follow logical patterns with surprising outcomes
- **Emergent behavior**: Complex elements arise from simple rules
- **Lives between order and chaos**: Version control provides structure while AI provides entropy
- **Gets more interesting when it breaks**: Late-game combinations create cascading effects

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

Built with curiosity, chaos, and a deep appreciation for systems that surprise their creators.

**"The best discoveries are the ones you didn't program."**
