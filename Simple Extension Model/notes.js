// ========
// = X.js =
// ========

function X() {};

X.prototype = {};

// return X;




// ================
// = Component.js =
// ================

var Component = X.define({
    // Turns into prototype
});




// =============
// = Feature.js =
// =============

component.plugin( 'namespace', {
    setup: function() {
        this.subscribe( 'any/channel', fn );
        this.unsubscribe( token );
        this.publish( 'own/channel', data );
        this.trigger( 'someMethod', data );
    },
    destroy: function() {}
});



// =============
// = Public.js =
// =============

