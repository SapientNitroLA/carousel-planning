# Responsive Carousel - Business Logic

## Terminology

Tile: Single item container (standard animating carousel)

Frame: Displaying multiple tiles in one container (multiple item animating carousel)

---

## Features

The core carousel plugin will contain only these features:

- Single tile transition
- Frame transition
- Responsive addition and subtraction of frame tiles
- Adaptive addition and subtraction of frame tiles set by breakpoints in options
- Tile/Frame looping- Previous/Next buttons
- Tiles are specified by class so carousel is element agnostic.
- Carousel calculates widths of elements and adjusts tiles to fit frame by percentages


## Options (user-defined)

- Loop (boolean)
- Frame (integer): num of tiles
- Breakpoints (array):
	- Object
		- breakpoint (integer)
		- number of tiles (integer)



---

## Use cases

#### Case 1:

Page has a 4-tile carousel when fullscreen.  The carousel has to responsively change number of tiles as the browser window changes size.  This means the 4-tile frame will change to a 3-tile frame when the total width becomes too large or too small to  hold the current amount of tiles based on a default max-size.  Each frame would be wrapped in a container.  This means the DOM structure would have to dynamically change to wrap a different amount of elements. ([See issues](#issues))

#### Case 2:

Page has 4-tile carousel when fullscreen but is required to change number of tiles per frame at specific breakpoints.  The frame will be scalable in each breakpoint size and adjusting it's contents and height dynamically when breakpoints change.  This will be specified in the options.

#### Case 3:

Carousel in responsive frame state transitions a single tile at a time.  Single container would need to hold all tiles, be able to responsively change number of tiles based on breakpoints and/or max-tile width. ([See issues](#issues))

---

## Thoughts:

- With the extensiveness of the feature I think the responsive frame feature should be an extension

---

## [Issues:](id:issues)

1. What is the best way to attach the carousel plugin to the DOM element?  Global class name or pass ID/Class as option?
2. What is the solution to an odd number of total tiles when using frames?
3. Case 1/3: How would a max-size be specified for a basic responsive change of tiles in the frames?  CSS breakpoint using percentages?