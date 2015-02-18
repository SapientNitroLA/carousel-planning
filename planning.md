# Sapient LA Carousel #

This repo is for a bare-bone carousel which can be employed in a variety of contexts by means of a [plugin-based feature set](#plugins).  It is written in AMD format, so it can be used as-is with a dependency manager like RequireJS.  It has no dependencies on a 3rd party framework, like jQuery; however, it does rely on the included x.js script for setup and [internal communication](#internal-communication-methods).

It is compatible with Chrome, Firefox, Safari, and down to IE9.

## Getting Started ##

These are the files you will need to implement a basic carousel:

    |-- index.html
    +-- library
        |-- css
        |   +-- core.css
        +-- js
            |-- carousel.js
            |-- demo.js
            +-- vendor
                |-- require.js
                +-- x.js

`index.html` carousel markup

`core.css` basic CSS needed for core carousel functionality

`carousel.js` core carousel code

`demo.js` mediator script used to initiate carousel functionality

`require.js` 3rd party dependency manager

`x.js` 3rd party script for carousel setup and internal communication

## Usage ##

Assuming that carousel.js is injected into your mediator script as `carousel`, the following code is all that is needed to initialize the most basic carousel:

```html
<!-- Code found in index.html for demo -->
<div id="wrapper">
    <ul class="example-carousel">
      <li><img src="library/images/test-image-1.jpg" alt="" /></li>
      <li><img src="library/images/test-image-2.jpg" alt="" /></li>
      <li><img src="library/images/test-image-3.jpg" alt="" /></li>
      <li><img src="library/images/test-image-4.jpg" alt="" /></li>
      <li><img src="library/images/test-image-5.jpg" alt="" /></li>
     </ul>
</div>
```
```javascript
// Code found in demo.js for demo
var options = {
    element: document.querySelector( '.example-carousel' )
}
var thisCarousel = carousel.create( options );
```

### Options ###

**element**  
Type: `HTML Element`  
Required: Yes  
Default: `null`  
DOM element to be converted into carousel (i.e. ul in markup above).

**incrementMode**  
Type: `String`  
Required: No  
Default: `'frame'`  
Sets whether carousel advances by tile or frame.

**nextText**  
Type: `String`  
Required: No  
Default: `'Next'`  
Next button text.

**postFrameChange**  
Type: `Function`  
Required: No  
Default: `null`  
Callback run after animation.

**preFrameChange**  
Type: `Function`  
Required: No  
Default: `null`  
Callback run prior to animation.

**prevText**  
Type: `String`  
Required: No  
Default: `'Previous'`  
Previous button text.

**preventNavDisable**  
Type: `Boolean`  
Required: No  
Default: `false`  
Prevents carousel from disabling previous/next controls.

**ready**  
Type: `Function`  
Required: No  
Default: `null`  
Callback run after init of carousel.

**tileClass**  
Type: `String`  
Required: No  
Default: `'carousel-tile'`  
Class name of individual tiles (i.e. li's in markup above).

**tilesPerFrame**  
Type: `Number`  
Required: No  
Default: `1`  
Number of visible tiles in carousel.

**wrapperClass**  
Type: `String`  
Required: No  
Default: `''`  
Class name of outer wrapper (i.e. div with id "wrapper" above).

**wrapControls**  
Type: `Number`  
Required: No  
Default: `false`  
Wrap previous/next controls with separate wrapper element.


## Plugins ##

In order to be light and flexible, the carousel core only comes with a bare set of features.  Any additional functionality is accomplished through plugins.

The naming convention for plugin files is `carousel.[pluginname].js`.  `pluginname` is the namespace for the plugin and is used as a key in the [options object](#options) to enable and configure that plugin's functionality ([click here for implementation](#implementation)).

Below is an example of a simple plugin script:

```javascript
define( 
    [
        'carousel'
    ],
    
    function( carousel ) {
        
        'use strict';
        
        /**
         * Global Plugin Vars
         */
        var subToken;
        var defaults = {
            option1: 735,
            option2: 'string'
        };
        var pluginNS = 'pluginname'; //plugin namespace
        var pluginOn = false;

        /**
         * Constructor
         */
        function Pluginname( api, options ) {
    
            this.api = api;
            this.options = this.api.extend( {}, defaults, options );
    
            this.setup();
        }

        Pluginname.prototype = {
        
            // Init plugin (must be named 'setup'!)
            setup: function() {

                var self = this; //alias 'this' for callbacks below
                
                // Subscribe to carousel events (i.e. init/after)
                self.api.subscribe(

                    this.api.ns + '/init/after',
                    function() {
                        
                        // Determine whether this plugin feature has been turned on
                        var pluginAttr = self.api.getOption( pluginNS );
                        pluginOn = ( typeof pluginAttr === 'boolean' && pluginAttr === true ) || 
                            typeof pluginAttr === 'object' ? 
                            true : false;
                        
                        // Plugin is enabled
                        if ( pluginOn ) {
                            
                            // Create local object of carousel config
                            self.carousel = {
                                dom: self.api.getState( 'dom' ),
                                tilesPerFrame: self.api.getOption( 'tilesPerFrame' ),
                                curTileLength: self.api.getState( 'curTileLength' )
                            };
                            
                            // Call internal method (bound call)
                            self.pluginMethod1.call( self );
                        }
                    }
                );
                
                // Simple event subscriber (i.e. single named function listener)
                self.api.subscribe(
                    self.api.ns + '/cache/after',
                    self.pluginMethod2.bind( self ) //bound to this object
                );
            },
        
            pluginMethod1: function() {

                // Plugin behavior goes here
                ...
            },
        
            pluginMethod2: function() {

                // Plugin behavior goes here
                ...
            }
        };
        
        // Create plugin by calling 'plugin' method of x.js
        carousel.plugin( pluginNS, function( options, api ) {

            new Pluginname( options, api );
        });
    }
);
```

### Implementation ###

In order to invoke a plugin's functionality, you would then add that plugin's namespace as a node to the options object used to initiate the carousel.

```javascript
// Example 1
carousel.create({
    element: document.querySelector( '.example-carousel' ),
    pluginname: true
});

// Example 2
carousel.create({
    element: document.querySelector( '.example-carousel' ),
    pluginname: {
        property1: 'value',
        property2: [ 1, 2, 3 ]
    }
});
```

### Internal Communication Methods ###

The included x.js script facilitates communication between the carousel and its plugins.  It also enables internal communication among the plugins themselves.

#### create( options ) ####
Initializes the carousel.

**options**  
Type: `Object`  
Configuration object for initialization of carousel (see Options documentation above).

#### getOption( key ) ####
Returns the requested value from the options object.

**key**  
Type: `String`  
Corresponds to options object key.

#### trigger( method ) ####
Provides means to run core carousel methods in the right context.

**method**  
Type: `Function`  
Core method of carousel to invoke.

#### getState( key ) ####
Returns the requested value from the state object.

**key**  
Type: `String`  
Corresponds to state object key.

#### subscribe( channel, method ) ####
Assign an event listener to named event.

**channel**  
Type: `String`  
Name of an event to subscribe to.  Typical format is * namespace/method/event *, i.e. * carousel/init/after *  

**method**  
Type: `Function`  
Event listener to invoke when subscribed to event is published.

#### unsubscribe( token ) ####
Remove event listener.

**token**  
Type: `Number`  
Index of method in subscribers array.  This token is returned from the subscribe method above.

#### publish( channel, data ) ####
Publish event (and data) to subscribers of this channel.

**channel**  
Type: `String`  
Name of an event channel to publish to.  Typical format is * namespace/method/event *, i.e. * carousel/init/after *  

**data**  
Type: any  
Data to be passed to subscribed listeners.
