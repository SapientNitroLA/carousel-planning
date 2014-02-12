# Responsive Carousel - Business Logic

## Terminology

Tile: Single carousel item

Frame: Visible tiles displayed in carousel

---

## Features

The core carousel plugin will contain only these features:

- Fluid by default (scaling)
- Responsive by extension
- Single tile transition
- Previous/Next buttons
- Tile container is specified by class so carousel is element agnostic (e.g. \<ul\>)
- Default animation: single tile at a time
- Frame tile count
- Frame - no empty tile spaces

---

## Options (user-defined)

- Carousel DOM element (object)
- Tiles per frame (integer)
- Animate by frame (boolean)

---

## Thoughts:

Initial extensions should include:

- Responsive frame feature should be an extension
- Loop extension
- Pagination extension
