# Bietschicheer – Project Context for Claude

## Color Schema

Always use these CSS variables (defined in `style.css`) when adding colors:

| Variable                | Hex       | Role              |
|-------------------------|-----------|-------------------|
| `--primär-hell`         | `#996f91` | Primary light     |
| `--primär-dunkel`       | `#663f5e` | Primary dark      |
| `--hintergrund-dunkel`  | `#404040` | Background dark   |
| `--hintergrund-hell`    | `#a5a5a5` | Background light  |
| `--hintergrund-neutral` | `#e1e1e1` | Background neutral|
| `--sekundär-hell`       | `#4384a2` | Secondary light   |
| `--sekundär-dunkel`     | `#364954`  | Secondary dark    |

Never hardcode these hex values — always reference the CSS variable.

## Stack

- Vanilla HTML / CSS / JS (no framework)
- Google Maps JavaScript API (`script.js`)
- Material Design Components Web (MDC) for dialogs and icons
- Font: Montserrat (Google Fonts)

## Pages

- `index.html` — interactive Google Maps page with markers for bars, food, stage, parking, etc.
- `bietschimeile.html` — standalone "Bietschimeile" page, accessible via the path-icon bubble (top-right of map)

## UI Conventions

- Floating action buttons (top-right): 48×48px white circles, `box-shadow: 0 2px 6px rgba(0,0,0,0.3)`, `border-radius: 50%`
- Icons: Material Icons (`<span class="material-icons">`) or SVGs from `icons/`
- Shared styles live in `style.css`; page-specific styles go in a `<style>` block in that page's `<head>`