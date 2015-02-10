**Quick Links**

- [Features](#features)
- [Usage](#usage)
- [Plugins](#plugins)

# Sapient LA Carousel #

This repo is for a vanilla, but flexible, all-purpose carousel which can be used across all of our projects since every client still seems to want a carousel.  It is written in AMD format, so it can be used as-is with a dependency manager like RequireJS.  It is agnostic which means it does not rely on any library to function (i.e. jQuery) and doesn't inlcude any project-specific logic.  However, it does rely on the included x.js script for setup and internal plugin communication.

It is compatible with Chrome, Firefox, Safari, and down to IE9.

## Features ##


## Usage ##

Assuming that carousel.js is injected into your script as `carousel`, the following code is all that's needed to initialize carousel:

```html
<div id="wrapper">
    <ul class="example-carousel">
      <li><img src="library/images/test-image-1.jpg" alt="" /></li>
      <li><img src="library/images/test-image-2.jpg" alt="" /></li>
      <li><img src="library/images/test-image-3.jpg" alt="" /></li>
      <li><img src="library/images/test-image-4.jpg" alt="" /></li>
      <li><img src="library/images/test-image-5.jpg" alt="" /></li>
     </ul>
</div>

var options = {
    element: document.querySelector( '.example-carousel' )
}
var thisCarousel = carousel.create( options );
```

### Options ###

<table width="100%">
<!-- <thead>
    <tr>
        <th align="left">options</th>
    </tr>
</thead> -->
<tbody>
    <tr>
        <td>
            <strong>element</strong> <em>(Required)</em><br>
            Type: HTML element<br>
            DOM element to be converted into carousel (i.e. ul in markup above).
        </td>
    </tr>
    <tr>
        <td>
            <strong>tilesPerFrame</strong><br>
            Type: number<br>
            Number of visible tiles in carousel.
        </td>
    </tr>
    <tr>
        <td>
            <strong>tileClass</strong><br>
            Type: string<br>
            Class name of individual tiles (i.e. li's in markup above).
        </td>
    </tr>
    <tr>
        <td>
            <strong>wrapperClass</strong><br>
            Type: string<br>
            Class name of outer wrapper (i.e. div with id "wrapper" above).
        </td>
    </tr>
    <tr>
        <td>
            <strong>incrementMode</strong><br>
            Type: string<br>
            Sets whether carousel advances by tile or frame.
        </td>
    </tr>
    <tr>
        <td>
            <strong>prevText</strong><br>
            Type: string<br>
            Previous button text.
        </td>
    </tr>
    <tr>
        <td>
            <strong>nextText</strong><br>
            Type: string<br>
            Next button text.
        </td>
    </tr>
    <tr>
        <td>
            <strong>preventNavDisable</strong><br>
            Type: boolean<br>
            Prevents carousel from disabling previous/next controls.
        </td>
    </tr>
    <tr>
        <td>
            <strong>wrapControls</strong><br>
            Type: number<br>
            Wrap previous/next controls with separate wrapper element.
        </td>
    </tr>
    <tr>
        <td>
            <strong>ready</strong><br>
            Type: function<br>
            Callback run after init of carousel.
        </td>
    </tr>
    <tr>
        <td>
            <strong>preFrameChange</strong><br>
            Type: function<br>
            Callback run prior to animation.
        </td>
    </tr>
    <tr>
        <td>
            <strong>postFrameChange</strong><br>
            Type: function<br>
            Callback run after animation.
        </td>
    </tr>
</tbody>
</table>


### State ###

<table width="100%">
<!-- <thead>
    <tr>
        <th align="left">state</th>
    </tr>
</thead> -->
<tbody>
    <tr>
        <td>
            <strong>index</strong><br>
            Type: number<br>
            Current index (0-based) of left-most visible tile.
        </td>
    </tr>
    <tr>
        <td>
            <strong>prevIndex</strong><br>
            Type: number<br>
            Index of previously active tile.  Init'ed as `false` (i.e. boolean)
        </td>
    </tr>
    <tr>
        <td>
            <strong>origTileLength</strong><br>
            Type: number<br>
            Number of total carousel tiles prior to init.
        </td>
    </tr>
    <tr>
        <td>
            <strong>curTileLength</strong><br>
            Type: number<br>
            Number of total carousel tiles after init.
        </td>
    </tr>
    <tr>
        <td>
            <strong>curTile</strong><br>
            Type: HTML element<br>
            Left-most visible tile object.
        </td>
    </tr>
    <tr>
        <td>
            <strong>origFrameLength</strong><br>
            Type: number<br>
            Number of frames (i.e. total tiles / visible tiles) prior to init.
        </td>
    </tr>
    <tr>
        <td>
            <strong>curFrameLength</strong><br>
            Type: number<br>
            Number of frames (i.e. total tiles / visible tiles) after init.
        </td>
    </tr>
    <tr>
        <td>
            <strong>curFrame</strong><br>
            Type: array<br>
            Array of currently visible tiles.
        </td>
    </tr>
    <tr>
        <td>
            <strong>prevFrame</strong><br>
            Type: array<br>
            Previously visible frame.
        </td>
    </tr>
    <tr>
        <td>
            <strong>frameIndex</strong><br>
            Type: number<br>
            Index of currently visible frame.
        </td>
    </tr>
    <tr>
        <td>
            <strong>frameNumber</strong><br>
            Type: number<br>
            Non-zero based index of currenlty visible frame (i.e. frameIndex + 1).
        </td>
    </tr>
    <tr>
        <td>
            <strong>prevFrameIndex</strong><br>
            Type: number<br>
            Index of previously visible frame.
        </td>
    </tr>
    <tr>
        <td>
            <strong>prevFrameNumber</strong><br>
            Type: number<br>
            Non-zero based index of previously visible frame.
        </td>
    </tr>
    <tr>
        <td>
            <strong>dom</strong><br>
            Type: object<br>
            Object containing all constituent DOM elements.

            <table width="100%">
            <tr>
                <td>
                    <strong>wrapper</strong><br>
                    Type: HTML element<br>
                    Outer wrapper for entire widget.
                </td>
            </tr>
            <tr>
                <td>
                    <strong>viewport</strong><br>
                    Type: HTML element<br>
                    Wrapper for carousel element.
                </td>
            </tr>
            <tr>
                <td>
                    <strong>carousel</strong><br>
                    Type: HTML element<br>
                    Carousel element.
                </td>
            </tr>
            <tr>
                <td>
                    <strong>controls</strong><br>
                    Type: HTML element<br>
                    Container for previous/next buttons and any pagination.
                </td>
            </tr>
            <tr>
                <td>
                    <strong>controlsWrapper</strong><br>
                    Type: HTML element<br>
                    Outer wrapper for previous/next buttons and any pagination.
                </td>
            </tr>
            <tr>
                <td>
                    <strong>prevBtn</strong><br>
                    Type: HTML element<br>
                    Previous button object.
                </td>
            </tr>
            <tr>
                <td class="last">
                    <strong>nextBtn</strong><br>
                    Type: HTML element<br>
                    Next button object.
                </td>
            </tr>
            </table>
        </td>
    </tr>
</tbody>
</table>

### Methods ###

<table width="100%">
<thead>
    <tr>
        <th align="left">create( options )</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>
            Initializes the carousel.

            <table width="100%">
            <tr>
                <td class="last">
                    <strong>options</strong><br>
                    Type: object<br>
                    Configuration object for initialization of carousel.
                </td>
            </tr>
            </table>
        </td>
    </tr>
</tbody>
</table>

<table width="100%">
<thead>
    <tr>
        <th align="left">getOption( key )</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>
            Returns the requested value from the options object.

            <table width="100%">
            <tr>
                <td class="last">
                    <strong>key</strong><br>
                    Type: string<br>
                    Corresponds to options object key.
                </td>
            </tr>
            </table>
        </td>
    </tr>
</tbody>
</table>

<table width="100%">
<thead>
    <tr>
        <th align="left">getState( key )</th>
    </tr>
</thead>
<tbody>
    <tr>
        <td>
            Returns the requested value from the state object.

            <table width="100%">
            <tr>
                <td class="last">
                    <strong>key</strong><br>
                    Type: string<br>
                    Corresponds to state object key.
                </td>
            </tr>
            </table>
        </td>
    </tr>
</tbody>
</table>


## Plugins ##

Since this is supposed to be a carousel for all seasons, it's core only comes with a bare set of features.  All additional functionality is accomplished through plugins.  

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

In order to invoke a plugin's functionality, you would then add that plugin's namespace as a node to the options object used to init carousel.

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