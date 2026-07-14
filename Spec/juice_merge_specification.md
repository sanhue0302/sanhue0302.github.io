# Juice Merge Game Specification

This document outlines the detailed mechanics, physics tuning, and 2.5D visual rendering mathematics for the "Juice Merge" game. It serves as a comprehensive prompt and design contract for recreating the game using AI.

## 1. Core Mechanics
- **Genre**: Suika-style (Watermelon Game) object merging physics game.
- **Engine**: `Matter.js` (2D rigid body physics).
- **Gravity Direction**: **Inverted** (`y = -1`). Objects are spawned at the bottom of the screen and "float" or are pushed upwards towards the top wall.
- **Merge Logic**: When two bodies with the same `itemIndex` collide, they are removed, and a new body of `itemIndex + 1` is spawned at the midpoint of the collision.
- **Queue System**: Displays the next 2 items in a "Next" UI panel.

## 2. Physics Tuning (Crucial for Stability)
To prevent objects from tunneling through each other or slipping sideways continuously:
- **Solver Iterations**: Must be exceptionally high. `positionIterations: 20`, `velocityIterations: 20`.
- **Item Body Properties**:
  - `restitution: 0.05` (Virtually zero bounce so items stick on impact).
  - `friction: 0.9` (High surface friction).
  - `frictionStatic: 10` (Extreme static friction to prevent perfect circles from rolling off each other under continuous upward gravity).
  - `frictionAir: 0.04` (Simulates sliding drag on a table).
- **Launch Mechanics**: Fired from the bottom with `Matter.Body.setVelocity(body, { x: 0, y: -15 })`. The velocity is capped at -15 to prevent tunneling on frame 1.

## 3. 2.5D Pseudo-3D Perspective Rendering
The game uses a custom HTML5 Canvas rendering loop to map flat 2D physics coordinates into a 3D isometric/perspective room.

### 3.1 Viewport & Table Bounds
- **Logical Canvas**: 800 x 800.
- **Table Visual Height**: The table occupies the center of the screen, starting at `y = 220` (back edge touching the wall) and ending at `y = 750` (front edge). This covers ~66% of the screen.
- **Coordinate Mapping**: 
  - Physical `Y` (0 to 800) maps to Visual `Y` (220 to 750).
  - Formula: `visualContactY = 220 + (physY / 800) * 530`.
  - **CRITICAL**: The `visualContactY` must represent the **base** (contact point) of the cup on the table, not its geometric center.
- **Perspective Tapering**:
  - Top width is `80%` of canvas, Bottom width is `95%`.
  - X Position Scale: `posScale = 0.8 + (physY / 800) * 0.15`.
  - Visual `X`: `px = gameWidth/2 + (physicsX - gameWidth/2) * posScale`.
- **Depth Scaling**:
  - Cups shrink slightly in the distance, but only down to 95%.
  - Radius Scale: `sizeScale = 0.95 + (physY / 800) * 0.05`.

### 3.2 Cup Rendering (`drawCup`)
- **Shape**: A 3D cylinder.
- **Proportions**:
  - `pHeight = pRadius * 1.05` (Distance from center to top/bottom).
  - `ellipseRatio = 0.25` (Flattens the top/bottom circles to simulate a high camera angle).
- **Translucency (Anti-Occlusion)**: 
  - Large cups in the front will block small cups in the back.
  - **Solution**: The cup body fill must use `ctx.globalAlpha = 0.7`. This gives it a "glass/juice" translucent aesthetic while elegantly solving gameplay occlusion.
- **Details**: Draw a semi-transparent white ellipse (`rgba(255,255,255,0.4)`) for the liquid surface/lid, and a curved polygon on the side for glass reflection.

### 3.3 Environmental Background
To ground the 3D table, a detailed static background is drawn behind it:
- **Floor**: Dark wood/brown (`#A1887F`) visible behind and to the sides of the table, with horizontal perspective lines from `y = 350` downwards.
- **Wall**: Warm yellow wallpaper (`#FFF8E1`) from `y = 0` to `y = 350`.
- **Baseboard**: Dark wood strip at `y = 335` to `350`. Because the table's far edge is at `220`, the tabletop obscures the baseboard directly behind it, making the table look perfectly pushed flush against the wall.
- **Table Legs**: Dark brown rectangles descending from the front corners (`y = 750`) down to the screen bottom (`y = 800`) to prove the table is elevated above the floor.
- **Wall Decorations**: 
  - Left: A framed landscape painting (`x: 50, y: 40`).
  - Right: A window showing blue sky and clouds (`x: 270, y: 30`).

## 4. Game Over Logic
- The "Danger Line" physically exists at `physY = 700` (inverted gravity threshold).
- Visually, it is drawn across the table at `visualContactY = 220 + (700 / 800) * 530`.
- If a cup's physical `Y` exceeds `700` (meaning its visual base crosses the line), the game over sequence is triggered.
