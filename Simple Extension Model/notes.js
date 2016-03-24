//////////////////////////
// Creating a Component //
//////////////////////////

var Component = x.create({
    // Default options
});

Component.prototype = {
    
    // Required methods
    setup: function() {}
};

window.component = Component.create

///////////////////////
// Creating a Plugin //
///////////////////////

var Extension = component.plugin({
    // Members added to Component's public API
    methodOne: function () {},
    methodTwo: function () {}
});

Extension.prototype = {
    // Required
    setup: function( options ) {
    
        api.subscribe( 'component/before/init', init );
    },
    // Required
    destroy: function() {},
}


component.plugin( 'name', function( api ) {

    function init( componentState ) {
        // Do initiation work
    }
    
    
    
    return {
    
        // Required methods
        setup: function( options ) {
        
            api.subscribe( 'component/before/init', init );
        }, 
        destroy: function() {},
        
        // All other members added
        // to Component's public API
        methodOne: function () {},
        methodTwo: function () {}
    }
});

/////////////////////////
// Using the Component //
/////////////////////////

var myComponent = component({
    // Options
});