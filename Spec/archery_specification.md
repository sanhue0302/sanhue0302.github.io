# Archery Game Specification

This document outlines the mechanics, physics mathematics, and rendering logic for the 2D HTML5 Canvas "Archery Game".

## 1. Game Flow & UI
- **Canvas Size**: `800px` (Width) x `400px` (Height).
- **Goal**: Shoot arrows at randomly spawning enemy targets within a 60-second time limit to score points.
- **UI Elements**: 
  - A real-time tracker displaying "時間: X 秒｜分數: Y".
  - "Start Game" and "Restart" buttons to control the game loop.
- **Game Loop**: Controlled via `requestAnimationFrame`, executing at the browser's refresh rate.

## 2. Archery Mechanics & Custom Physics
The game uses a custom-built kinematics engine rather than an external physics library.

### 2.1 The Archer (Player)
- **Position**: Fixed at `x: 50, y: HEIGHT - 100`.
- **Aiming**: The player aims by moving the mouse. The bow rotates to face the cursor.
- **Drawing the Bow**: The player drags the mouse away from the bow to pull the string.
  - The pull distance (`dist`) is calculated using `Math.hypot(dx, dy)`.
  - The maximum pull distance (`maxPullDistance`) is capped at `70px`.

### 2.2 Arrow Flight Physics
- **Initial Velocity Calculation**:
  - The speed is dynamically based on how far the bow is pulled.
  - Formula: `speed = 8 + (dist / maxPullDistance) * 12`. (Minimum speed is 8, maximum is 20).
  - `vx = speed * Math.cos(angle)`, `vy = speed * Math.sin(angle)`.
- **In-Flight Kinematics**:
  - Constant gravity (`gravity = 0.5`) is applied to vertical velocity: `arrow.vy += gravity * 0.1` per frame.
  - Positions update linearly: `arrow.x += arrow.vx`, `arrow.y += arrow.vy`.
  - The arrow's visual rotation continuously updates to match its trajectory vector: `arrow.angle = Math.atan2(arrow.vy, arrow.vx)`.
- **Despawn Conditions**: The arrow is removed and reset if it travels off-screen (`x < 0`, `x > WIDTH`, or `y > HEIGHT`).

### 2.3 Aiming Assist (Trajectory Prediction)
When an arrow is knocked but not yet fired, a dashed trajectory line predicts the flight path.
- **Calculation**: It runs a fast-forward simulation loop for 40 steps.
- **Step Logic**: Applies the exact same velocity and gravity formulas used in actual flight (`simVy += gravity * 0.1`, `simX += simVx`) to draw a precise parabolic curve.

## 3. Enemy Targets & Collision Detection
- **Spawning**:
  - Enemies spawn randomly within a safe zone to ensure playability.
  - X Range: `minDistanceFromArcher = 300` to `WIDTH - enemyRadius`.
  - Y Range: `50` to `HEIGHT - 100`.
- **Collision Logic**: 
  - Uses geometric distance formulas to check for intersections between the **tip** of the arrow and the circular enemy body.
  - **Arrow Tip Calculation**: `arrowTipX = arrow.x + ARROW_LENGTH * Math.cos(arrow.angle)`.
  - **Hit Condition**: `Math.sqrt((enemy.x - arrowTipX)^2 + (enemy.y - arrowTipY)^2) < enemy.radius`.

## 4. Visual Rendering
All visuals are drawn via raw `CanvasRenderingContext2D` paths.
- **Archer**: Constructed using thick stroked lines (`lineCap = 'round'`) and circles. Features dynamic joint rotation where the left arm and bow pivot around the shoulder coordinate.
- **Bow & String**: The bow is drawn using a quadratic Bezier curve (`ctx.quadraticCurveTo`). The string dynamically flexes backward based on the exact `pullDist`.
- **Arrow**: A brown shaft (`#8B4513`) with three white feather fletchings and a dark metal arrowhead polygon.
- **Enemy**: A red circle with white/black overlapping circles for eyes and a stroked line for a mouth.
