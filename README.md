# Objective #

Design a light-weight, flexible carousel module that enables reusable across projects:

- Deeply customizable options
- Deeply extensible architecture
- Library/framework agnostic with minimal code redundancy


  
## Core Features ##

- Accessible

- Basic prev/next navigation controls

- Minimal (and replaceable) animation
    - Basic css animation (js fallback as extension?)
    - Pluggable framework to replace default animation engine
    - expose needed elements/object/properties

- Deep linking



## Options ##


### Properties ###

**Layout**

- Fixed or Responsive
    - fixed or relative units?
    - should content be ignored and left up to the developer?

- Horizontal or Vertical


**Controls**

- Prev/Next
    - Markup:
        - `ul` with `button` tags
        - `nav` with `button` tags
        - custom markup with template `{token}` tags
    - Placement:
        - inside/outside the mask
        - before/after mask

- Frames
    - Markup:
      - `ul` with `button` tags
      - `nav` with `button` tags
      - custom markup with template `{token}` tags
    - Placement:
      - inside the navigation controls
      - inside/outside the mask
      - before/after the mask


### Event Hooks ###

Should these should instead be events that are emitted rather than added to the options.

- Ready
- Before Destroy
- After Destroy
- Before Animation
- After Animation
- Before Resize
- After Resize
- Tiles Added
- Tiles Removed
- Tile Input
    - extensible, default input type would be click



## API ##


### Properties ###

- State `Object`
    - Length `Number`
    - Tiles `Array`
    - Frames `Array`
    - Current Tile Index `Number`
    - Current Frame Index `Number`
    - Options `Object`


### Methods ###

- Previous
- Next
- Config
- Destroy
- Add Tiles
- Remove Tiles
- Subscribe to Event
    - should a subscribe method be used instead of event hooks on the options object?



## Extension Ideas ##

The extensible architecture should support the ability to add features that integrate at the core level.

- Support for Touch/Pointer Events

- Modes
    - Auto Advance
    - Looping

- Content Type Support
    - Video
      - what API would be useful?

- Animation Engine
    - enable the animation to be replaced

- CSS Layout Themes



## Dependencies ##

- GruntJS for builds

- [UMD](https://github.com/umdjs/umd) pattern for source modularity and extension configuration. Need to research on how other libs handle this.
    - RequireJS

- DOM libs
    - Vanilla JS for DOM manipulation?
        - Support for passing in a jQuery/Zepto collection and convert it to an array.
    - What about animation? Is there a small lib that can handle basic css animations with js fallback? Can we use only the animation aspect of jQuery?
    - Modernizr, or can we get away with minimal feature tests and require extensions to roll their own? How do other libs handle this?
