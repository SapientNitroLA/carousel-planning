!function( x ) {

    var componentName = x.define( 'componentName', {
        
        // Required
        setup: function( options, test ) {
            
            console.log('new componentName created');
            // console.log('plugins available', this.plugins);
            // console.log('arguments', arguments);
            
            this.options = options;
            
            this.setupPlugins();
            this.updateState();
            
            var self = this;
            
            this.x.subscribe( 'componentName/init', this.custom.bind( this ) );
            
            this.options.element.addEventListener( 'click', function() {
                self.x.publish( 'componentName/init', 'data' );
            });
        },
        
        updateState: function() {
            this.state.element = this.options.element;
        },
        
        custom: function( data ) {
            console.log('custom', data);
        }
    });
    
    // return Component;
    window.componentName = componentName;
    
}( window.x );

// !function( x ) {
// 
//     var componentName2 = x.define({
//         
//         // Required
//         setup: function( options, test ) {
//             
//             console.log('new componentName created', this);
//             console.log('plugins available', componentName.plugins);
//             console.log('arguments', arguments);
//             
//             this.options = options;
//             
//             this.setupPlugins();
//         }
//     });
//     
//     // return Component;
//     window.componentName2 = componentName2;
//     
// }( window.x );