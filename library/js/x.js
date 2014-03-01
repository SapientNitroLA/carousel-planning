function X() {
    
    this.data = {};
    this.state = {};
    this.extensions = {};
    this.subscribers = {};
}

X.prototype = {
    
    proxy: function( context, func ) {
        
        return function() {
            return func.apply( context, arguments );
        }
    },
    
    extend: function( extension ) {
        
        this.data[ extension.id ] = {};
        this.extensions[ extension.id ] = extension;
    
        extension.setup.call( extension, this.api( this, extension.id ) );
    },
    
    publish: function( hook ) {
        
        var sub
            , subs = this.subscribers[ hook ]
            ;

        if ( !subs ) return this.log.msg( 'publish', hook );
    
        this.log.msg( 'publish begin', hook );
    
        for ( var i = 0; i < subs.length; i++ ) {
        
            sub = subs[i];
        
            if ( sub.id ) sub.call( this.extensions[ sub.id ], this.api( this, sub.id ) );
        
            else sub.call( this );
        }
    
        this.log.msg( 'publish end', hook );
    },
    
    subscribe: function( hook, method ) {
        this.log.msg( 'subscriber added to', hook );
    
        this.subscribers[ hook ] = this.subscribers[ hook ] || [];
    
        this.subscribers[ hook ].push( method );
    },
    
    api: function( context, id ) {
        
        return {
        
            data: context.data[ id ],
        
            publish: this.proxy( context, this.publish ),
        
            subscribe: function( hook, method ) {
            
                method.id = id;
            
                this.subscribe.call( context, hook, method );
            },
        
            state: function( key ) {
                return context.state[ key ];
            }
        };
    },
    
    log: {
		enabled: true,
		msg: function( msg ) {
			if ( this.enabled ) {
				if ( arguments.length === 1 ) console.log( msg );
				else console.log( arguments );
			}
		}
	}
};