// ========
// = X.js =
// ========

function X() {};

X.prototype = {};

// return X;




// ================
// = Component.js =
// ================

var componentName = x.define({
    // componentName is now a constructor with a prototype
    // xjs will provide mixins to allow plugins to be created and managed
});




// =============
// = Feature.js =
// =============

componentName.plugin( 'pluginName', {
    
    setup: function() {
        
        // Receive updates from componentName and any other plugins
        this.subscribe( 'all/channel', fn );
        
        // Publish updates to self, componentName and any other plugins
        this.publish( 'self/channel', data );
        
        // UNsubscribe from channel
        this.unsubscribe( token );
        
        // Trigger a command to execute on componentName
        this.trigger( 'nextFrame', data );
    },
    
    destroy: function() {}
});



// =============
// = Page.js =
// =============

