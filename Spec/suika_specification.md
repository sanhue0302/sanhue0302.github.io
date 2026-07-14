# Suika Game (Watermelon Merge) Specification

This document outlines the mechanics, physics, and visual design of the "Suika Game" implementation.

## 1. Core Mechanics
- **Genre**: Physics-based object merging puzzle game.
- **Engine**: `Matter.js` (2D rigid body physics).
- **Gravity Direction**: Standard top-down gravity (`y = 1`). Objects are dropped from the top and fall to the bottom.
- **Merge Logic**: When two objects of the same level (e.g., two Cherries) collide, they merge to form one object of the next level (e.g., one Strawberry) at the midpoint of their collision.

## 2. Items Configuration
There are 11 tiers of fruits, strictly defined by their radii and colors:
1. **Cherry**: Radius 15, Color `#F9114E`
2. **Strawberry**: Radius 22, Color `#F42E35`
3. **Grape**: Radius 30, Color `#A657A6`
4. **Dekopon**: Radius 40, Color `#FCA001`
5. **Orange**: Radius 52, Color `#FA8C00`
6. **Apple**: Radius 65, Color `#ED1826`
7. **Pear**: Radius 80, Color `#D9D25F`
8. **Peach**: Radius 95, Color `#F8B4C4`
9. **Pineapple**: Radius 110, Color `#FBEA18`
10. **Melon**: Radius 130, Color `#91CF42`
11. **Watermelon**: Radius 155, Color `#238914`

*Note: Mass is calculated automatically by the physics engine based on the area of the circle (radius), ensuring large fruits are naturally heavier and harder to push around than small fruits.*

## 3. Physics Tuning
- **Solver Iterations**: High precision required (`positionIterations: 20`, `velocityIterations: 20`) to prevent fruits from tunneling or overlapping when squeezed at the bottom of the container.
- **Item Body Properties**:
  - `restitution: 0.05` (Low bounce to prevent unpredictable scattering).
  - `friction: 0.9` (High surface friction so fruits don't slide past each other too easily).
  - `frictionStatic: 10` (High static friction to encourage stable stacking).

## 4. Visual Rendering
Unlike the "Juice Merge" variant, the Suika Game is rendered in a pure 2D orthogonal perspective.

### 4.1 Play Area (Container)
- **Dimensions**: Maximum `450px` width by `700px` height.
- **Outer Background**: A CSS linear gradient from `#FFDEE9` to `#B5FFFC`.
- **Game Container Box**: Features rounded corners (`border-radius: 20px`), a shadow (`box-shadow: 0 15px 35px rgba(0,0,0,0.2)`), and a warm inner gradient (`#FFF1DB` to `#FFD185`).
- **Walls**: Colored `#E2B881` (light wood/cardboard color).
- **Danger Line**: Colored `#FF5252`. Drawn near the top of the screen (`y = 100`).

### 4.2 Fruit Rendering
- Drawn natively on the HTML5 Canvas via the custom render loop.
- **Highlights**: Each fruit is rendered with a 3D-like glossy effect using `drawFruitHighlight()`:
  - **Inner Shadow**: A radial gradient applied to the bottom edge to give volume.
  - **Glossy Reflection**: A semi-transparent white ellipse (`rgba(255, 255, 255, 0.6)`) drawn near the top-left to simulate light reflecting off a shiny fruit surface.

### 4.3 UI Overlays
- **Next Item Queue**: A rounded rectangle panel at the top right showing the upcoming 2 fruits in the sequence. Fruits in the queue are drawn using the same glossy highlight logic as the main fruits.
