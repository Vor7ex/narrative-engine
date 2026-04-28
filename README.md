# narrative-engine

**Tipo:** Motor de narrativa visual — first-person, escenas estáticas con animación  
**Stack:** Next.js 16 · TypeScript (strict) · Framer Motion · Lottie  
**Alcance de este documento:** arquitectura del motor únicamente

---

## 1. Modelo mental

El motor es un **intérprete de datos**. Una experiencia se define como un grafo de `Scene` y `DialogueScene` en TypeScript puro. El motor lee esos datos y renderiza. Ninguna escena nueva requiere tocar el código del motor.

```
Definición (datos TS)
       │
       ▼
  SceneEngine  ──────────────────────────────────────────────────────────┐
  (intérprete)                                                            │
       │                                                                  │
       ├── renderiza ──► Scene                                            │
       │                  ├── Background (imagen o Lottie)                │
       │                  ├── Sprite[]   (imagen, Lottie, clickeable)     │
       │                  └── UI[]       (botones, overlays)              │
       │                                                                  │
       └── renderiza ──► DialogueScene                                    │
                          ├── Background                                   │
                          ├── Avatar (= Sprite con rol semántico)          │
                          └── DialogueBox (typewriter, branches, skip)     │
                                                                           │
  TriggerSystem ◄─── Sprite / UI / Background disparan eventos ──────────┘
       │
       ├──► ejecuta AnimationSequence   (puede encadenar a ► )
       ├──► navega a DialogueScene
       └──► navega a Scene
```

---

## 2. Tipos de escena

### 2.1 `Scene` — escena de exploración

Contenedor principal de la experiencia. Compone capas independientes sobre un viewport fijo.

| Elemento | Descripción |
|----------|-------------|
| **Background** | Imagen o Lottie que ocupa todo el viewport. Puede recibir animaciones propias (scroll, scale, fade). Tratada como entidad independiente, no como un Sprite. |
| **Sprite[]** | Elementos visuales posicionados libremente. Pueden ser PNG estático, imagen con animación CSS/Framer, o Lottie JSON. Tienen hitbox, z-index, posición y tamaño configurables. Pueden ser clickeables y disparar Triggers. |
| **UI[]** | Botones u overlays que se superponen a toda la escena. No forman parte del espacio de la escena — viven en una capa DOM por encima. |

### 2.2 `DialogueScene` — escena de diálogo

Overlay modal que se superpone a cualquier `Scene` activa. No reemplaza la escena — la cubre.

| Elemento | Descripción |
|----------|-------------|
| **Background** | Mismo tipo que en Scene. Opcional — puede mostrar el fondo de la Scene activa con blur. |
| **Avatar** | Sprite simplificado: imagen o Lottie posicionado en la zona superior del diálogo. Semánticamente distinto de Sprite pero técnicamente el mismo subtipo. |
| **DialogueBox** | Caja inferior. Muestra texto con efecto typewriter, skippeable con tap/click. Progresa línea a línea o se ramifica según `branches`. Incluye scroll indicator cuando la línea es larga. |
| **Responses[]** | Botones de respuesta al final de un nodo de diálogo. La respuesta elegida determina el siguiente nodo. Estructura de árbol, no lista lineal. |

---

## 3. Schema TypeScript

El schema es la parte más crítica del motor. Todo lo que el motor puede hacer está representado aquí.

### 3.1 Primitivos compartidos

```typescript
// src/engine/types/primitives.ts

/** Posición relativa al viewport (0–100 en ambos ejes) */
type Position = { x: number; y: number }

/** Dimensiones como porcentaje del viewport */
type Size = { width: number; height?: number }

/** Hitbox rectangular relativa al bounding box del sprite */
type Hitbox = {
  offsetX: number   // % desde el borde izquierdo del sprite
  offsetY: number   // % desde el borde superior del sprite
  width: number     // % del ancho del sprite
  height: number    // % del alto del sprite
}

/** Asset: imagen estática o animación Lottie */
type AssetSource =
  | { kind: 'image'; src: string }           // ruta en /public
  | { kind: 'lottie'; src: string; loop?: boolean; autoplay?: boolean }
```

### 3.2 Animaciones

Framer Motion es el motor de animación. Las propiedades del schema mapean 1:1 a variantes de Framer Motion, lo que permite que el `AnimationPlayer` las interprete sin lógica condicional.

```typescript
// src/engine/types/animation.ts

type AnimatableProps = {
  x?: number | string
  y?: number | string
  scale?: number
  opacity?: number
  rotate?: number
}

type AnimationStep = {
  target: string              // id del Sprite, Background, o 'scene'
  to: AnimatableProps
  duration?: number           // segundos, default 0.4
  ease?: string               // easing de Framer Motion
  delay?: number
}

/**
 * Secuencia de pasos de animación.
 * Se ejecutan en orden. Al completarse, puede disparar un Trigger adicional.
 */
type AnimationSequence = {
  steps: AnimationStep[]
  onComplete?: Trigger        // trigger encadenado post-animación
}
```

### 3.3 Sistema de Triggers

Un Trigger es la unidad de comportamiento. Todo efecto observable en la experiencia es el resultado de un Trigger.

```typescript
// src/engine/types/trigger.ts

type Trigger =
  | { type: 'navigate-scene';    sceneId: string }
  | { type: 'navigate-dialogue'; dialogueId: string }
  | { type: 'play-animation';    animation: AnimationSequence }
  | { type: 'play-audio';        src: string; loop?: boolean }
  | { type: 'stop-audio' }
  | { type: 'set-flag';          key: string; value: boolean }
  | { type: 'composite';         sequence: Trigger[] }   // ejecuta varios en orden

/** Un Trigger puede estar condicionado al estado global */
type ConditionalTrigger = {
  condition?: (state: GameState) => boolean
  trigger: Trigger
}
```

### 3.4 Sprites

```typescript
// src/engine/types/sprite.ts

type Sprite = {
  id: string
  asset: AssetSource

  // Layout
  position: Position         // centro del sprite, % del viewport
  size: Size                 // % del viewport
  zIndex: number

  // Interacción
  hitbox?: Hitbox            // si ausente: hitbox = bounding box completo
  onTap?: ConditionalTrigger
  onHover?: ConditionalTrigger

  // Estado inicial de animación (Framer Motion initial)
  initial?: AnimatableProps
}
```

### 3.5 Background

```typescript
// src/engine/types/background.ts

type Background = {
  id: string
  asset: AssetSource

  // El fondo puede ser animado (parallax, scroll, fade)
  initial?: AnimatableProps
}
```

> **Nota de diseño:** `Background` y `Sprite` son tipos separados a pesar de tener estructura similar. El motor los renderiza en capas distintas y los trata con semántica diferente. Compartir una implementación interna es un detalle del motor, no del schema.

### 3.6 UI Elements

```typescript
// src/engine/types/ui.ts

type UIButton = {
  id: string
  label: string
  position: Position
  onTap: ConditionalTrigger
  style?: 'primary' | 'secondary' | 'ghost'
  visible?: (state: GameState) => boolean
}

type UIElement = UIButton   // extensible en el futuro
```

### 3.7 Diálogo

```typescript
// src/engine/types/dialogue.ts

type DialogueLine = {
  text: string
  avatarAsset?: AssetSource   // puede cambiar el avatar línea a línea
  speed?: number              // ms por carácter, default 30
}

type DialogueNode = {
  id: string
  lines: DialogueLine[]       // secuencia typewriter antes de mostrar respuestas
  responses?: DialogueResponse[]
  onComplete?: Trigger        // si no hay responses, se dispara al terminar
}

type DialogueResponse = {
  label: string
  nextNodeId?: string         // null = cerrar diálogo
  onSelect?: Trigger
}

type DialogueScene = {
  id: string
  background?: Background     // null = mostrar Scene activa con blur
  avatar?: Sprite
  rootNodeId: string
  nodes: Record<string, DialogueNode>
}
```

### 3.8 Scene

```typescript
// src/engine/types/scene.ts

type Scene = {
  id: string
  background: Background
  sprites?: Sprite[]
  ui?: UIElement[]
  transition?: 'fade' | 'slide-left' | 'slide-right' | 'zoom-in' | 'dissolve'
  audio?: {
    ambient?: string          // loop
    music?: string
    onEnterSfx?: string
  }
  onEnter?: Trigger           // se dispara al montar la escena
}
```

### 3.9 Estado global

```typescript
// src/engine/types/state.ts

type GameState = {
  currentSceneId: string
  activeDialogueId: string | null
  flags: Record<string, boolean>
  visitedScenes: string[]
  audio: {
    ambientSrc: string | null
    musicSrc: string | null
    muted: boolean
  }
}
```

---

## 4. Arquitectura de renderizado

### 4.1 Jerarquía de capas

Las capas son divs apilados con `position: absolute` y `z-index` fijo por categoría, no por sprite individual. El z-index de un Sprite es relativo a la capa de sprites, no al DOM global.

```
z-index 400  │  UILayer          ← botones, overlays no-diegéticos
z-index 300  │  DialogueLayer    ← DialogueScene cuando está activa
z-index 200  │  SpriteLayer      ← todos los Sprites (z-index relativo entre ellos)
z-index 100  │  BackgroundLayer  ← fondo
```

### 4.2 Sub-motor de assets: SpriteRenderer

Los Sprites pueden ser PNG o Lottie. El `SpriteRenderer` es el componente que abstrae esta diferencia. Internamente detecta el `kind` del asset y delega al renderer correspondiente.

```
SpriteRenderer
├── ImageRenderer   ← para asset.kind === 'image'
│     └── <img> + Framer Motion wrapper
└── LottieRenderer  ← para asset.kind === 'lottie'
      └── lottie-react + Framer Motion wrapper externo
```

**Por qué Framer Motion como wrapper externo de Lottie:** Lottie controla la animación interna del asset (fotogramas). Framer Motion controla la animación de posición, escala y opacidad del *contenedor* del Lottie. Ambas capas son ortogonales y compatibles.

### 4.3 TriggerSystem

El `TriggerSystem` es un servicio singleton (no un componente React) que recibe un `Trigger` y lo ejecuta contra el `GameStateStore`.

```typescript
// Pseudocódigo del despachador
function dispatch(trigger: Trigger, state: GameState): void {
  switch (trigger.type) {
    case 'navigate-scene':
      store.set({ currentSceneId: trigger.sceneId })
      break
    case 'navigate-dialogue':
      store.set({ activeDialogueId: trigger.dialogueId })
      break
    case 'play-animation':
      AnimationPlayer.run(trigger.animation)
      // onComplete se despacha al resolverse la Promise
      break
    case 'composite':
      trigger.sequence.reduce(
        (p, t) => p.then(() => dispatch(t, store.get())),
        Promise.resolve()
      )
      break
    // ...
  }
}
```

El tipo `composite` es la pieza que habilita el flujo del diagrama: `Sprite → Trigger → Animación → (onComplete) → Diálogo/Escena`.

### 4.4 AnimationPlayer

Recibe una `AnimationSequence`, resuelve los targets por id y aplica las animaciones usando las referencias de Framer Motion (`useAnimationControls`). Retorna una `Promise` que resuelve al completarse todos los steps.

Los targets (`sprite.id`, `background.id`) se registran en un `Map<string, AnimationControls>` cuando se montan los componentes. El `AnimationPlayer` accede a ese mapa. Esto desacopla la lógica de animación del árbol de componentes.

---

## 5. Flujo de interacción (del diagrama)

```
Usuario toca Sprite
       │
       ▼
SpriteRenderer detecta tap dentro del hitbox
       │
       ▼
Evalúa ConditionalTrigger (verifica condition contra GameState)
       │
       ├── condition false → no hace nada
       │
       └── condition true
              │
              ▼
        TriggerSystem.dispatch(trigger)
              │
              ├── play-animation
              │     └── AnimationPlayer.run(sequence)
              │           └── onComplete → dispatch(trigger.onComplete)
              │
              ├── navigate-dialogue
              │     └── GameStateStore.set({ activeDialogueId })
              │           └── DialogueLayer se monta con AnimatePresence
              │
              └── navigate-scene
                    └── GameStateStore.set({ currentSceneId })
                          └── SceneEngine renderiza nueva Scene
```

---

## 6. Estructura de archivos

```
src/
├── engine/
│   ├── types/
│   │   ├── primitives.ts
│   │   ├── animation.ts
│   │   ├── trigger.ts
│   │   ├── sprite.ts
│   │   ├── background.ts
│   │   ├── ui.ts
│   │   ├── dialogue.ts
│   │   ├── scene.ts
│   │   └── state.ts
│   │
│   ├── core/
│   │   ├── SceneEngine.tsx         ← raíz del motor, lee GameState y renderiza
│   │   ├── TriggerSystem.ts        ← despachador singleton
│   │   ├── AnimationPlayer.ts      ← ejecutor de AnimationSequence
│   │   ├── AnimationRegistry.ts    ← Map<id, AnimationControls>
│   │   └── GameStateStore.ts       ← Zustand store con persist
│   │
│   ├── renderers/
│   │   ├── BackgroundLayer.tsx
│   │   ├── SpriteLayer.tsx
│   │   ├── SpriteRenderer.tsx      ← delega a Image o Lottie renderer
│   │   ├── ImageRenderer.tsx
│   │   ├── LottieRenderer.tsx
│   │   ├── UILayer.tsx
│   │   └── DialogueLayer.tsx
│   │
│   └── dialogue/
│       ├── DialogueEngine.tsx      ← interpreta DialogueScene
│       ├── DialogueBox.tsx         ← typewriter + scroll
│       ├── TypewriterText.tsx
│       └── ResponseButtons.tsx
│
├── content/
│   ├── scenes/
│   │   ├── index.ts                ← Record<string, Scene>
│   │   ├── s01-forest.ts
│   │   └── ...
│   ├── dialogues/
│   │   ├── index.ts                ← Record<string, DialogueScene>
│   │   ├── d01-penguin-intro.ts
│   │   └── ...
│   └── characters.ts              ← assets de personajes reutilizables
│
├── app/
│   └── page.tsx                   ← monta SceneEngine, sin lógica
│
└── public/
    └── assets/
        ├── backgrounds/
        ├── sprites/
        ├── lottie/
        └── audio/
```

**Regla estricta:** `src/engine/` no importa nada de `src/content/`. El motor no conoce las escenas — las recibe como datos en runtime. `src/content/` sí importa tipos de `src/engine/types/`.

---

## 7. Decisiones arquitectónicas (ADR)

### ADR-001: Background y Sprite como tipos separados
**Decisión:** `Background` y `Sprite` son tipos distintos aunque compartan propiedades.  
**Razón:** El Background siempre ocupa el 100% del viewport, nunca tiene hitbox, y el motor puede aplicarle efectos específicos (parallax, blur al abrir diálogo). Unificarlos en un solo tipo lleva a `if (sprite.isBackground)` dispersos en el motor.  
**Consecuencia:** Si en el futuro se necesita un sprite de tamaño completo, sigue siendo un Sprite — la distinción es semántica, no solo de tamaño.

### ADR-002: Avatar es un Sprite
**Decisión:** `DialogueScene.avatar` es de tipo `Sprite`, no un tipo propio.  
**Razón:** El Avatar tiene exactamente las mismas propiedades que un Sprite (asset, posición, tamaño, animación inicial). Darle un tipo propio duplicaría el schema sin beneficio. El nombre `avatar` es semántico, no estructural.

### ADR-003: Framer Motion como wrapper externo de Lottie
**Decisión:** Las animaciones de posición/escala/opacidad de los Lotties se controlan con Framer Motion, no con la API de Lottie.  
**Razón:** Lottie controla fotogramas internos. Framer Motion controla el contenedor. Son ortogonales. Intentar usar la API de Lottie para mover el asset en el viewport mezcla responsabilidades y complica el `AnimationPlayer`.  
**Consecuencia:** Para animar propiedades internas de un Lottie (cambiar velocidad, ir a un frame específico), se necesita exponer la ref de Lottie. Esto es un caso edge — se contempla pero no se implementa en V1.

### ADR-004: TriggerSystem como singleton, no como hook
**Decisión:** `TriggerSystem` es un módulo TypeScript puro, no un hook o contexto React.  
**Razón:** Los triggers pueden dispararse desde callbacks de Framer Motion (en `onAnimationComplete`), no siempre desde el ciclo de render de React. Un módulo singleton puede ser llamado desde cualquier contexto sin violar las reglas de hooks.

### ADR-005: AnimationRegistry como Map global
**Decisión:** Las referencias de `AnimationControls` de Framer Motion se registran en un `Map<string, AnimationControls>` global al montar cada componente.  
**Razón:** El `AnimationPlayer` necesita acceder a los controles de animación de cualquier sprite por su `id`, pero los controles viven en los componentes. Un contexto React no resuelve esto porque el `AnimationPlayer` es un singleton. El Map se limpia al desmontar.  
**Riesgo:** IDs duplicados entre escenas pueden colisionar. **Mitigación:** el id de un sprite debe ser único globalmente, no solo dentro de su escena. Convención: `{sceneId}-{spriteId}`.

### ADR-006: Tipo de transición definido en la Scene destino
**Decisión:** El tipo de transición (`fade`, `slide-*`, etc.) se define en la Scene de destino, no en el Trigger de navegación.  
**Razón:** La transición es una propiedad de cómo se presenta una escena, no de cómo se llega a ella. Definirla en el Trigger implicaría especificarla cada vez que se navega a la misma escena desde distintos puntos.

### ADR-007: `composite` como tipo de Trigger
**Decisión:** Existe un tipo `composite` que ejecuta una secuencia de Triggers en orden.  
**Razón:** El diagrama de flujo muestra explícitamente que una animación puede encadenar a un diálogo o escena mediante `onComplete`. Sin `composite`, esto requeriría lógica especial en el `TriggerSystem`. Con `composite`, `onComplete` es simplemente otro Trigger — el sistema es uniforme y sin casos especiales.

---

## 8. Requisitos no funcionales del motor

| ID | Requisito |
|----|-----------|
| NF-01 | **TypeScript strict**: `strict: true` en `tsconfig.json`. Sin `any` en `src/engine/`. |
| NF-02 | **Sin side effects en el schema**: los objetos de tipo `Scene` y `DialogueScene` son datos puros. Las funciones (como `condition` en `ConditionalTrigger`) son las únicas excepciones y deben ser puras. |
| NF-03 | **Responsive**: el viewport del motor usa `aspect-ratio` fijo configurable (default 9:16 para móvil). Las posiciones en porcentaje garantizan que la escena escala sin recalcular coordenadas. |
| NF-04 | **`prefers-reduced-motion`**: el `AnimationPlayer` debe consultar este media query y reducir o eliminar las animaciones de desplazamiento. Los Lotties en loop pueden continuar. |
| NF-05 | **Carga lazy de assets**: los assets de una Scene se precargan al navegar a la escena anterior, no al iniciar la aplicación. |
| NF-06 | **Persistencia de estado**: `GameStateStore` persiste en `localStorage` via middleware Zustand `persist`. El motor reanuda desde `currentSceneId` al recargar. |

---

## 9. Fuera de alcance (V1 del motor)

- Sistema de guardado en servidor
- Editor visual de escenas
- Animaciones internas de Lottie controladas programáticamente (cambiar frames, velocidad)
- Efectos de partículas (nieve, chispas) — candidato para una capa adicional en V2
- Audio espacial / posicional
- Múltiples instancias del motor en la misma página