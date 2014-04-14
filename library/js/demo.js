require(
    
	[
		'carousel',
        'carousel.pagination'
	],
    
    function( carousel ) {
		
        var myCarousel = carousel.create({
            element: document.getElementById( 'example-carousel' ),
            increment: 2,
            incrementMode: 'frame',
            nextText: 'next',
            prevText: 'previous',
            wrapControls: true,
            pagination: {
              center: true // TODO handle centering when wrapControls is false. Should it simply not be done? Should wrapControls be forced to true?
            }
        });
    
        var myCarousel2 = carousel.create({
            element: document.getElementById( 'example-carousel-2' ),
            increment: 2,
            incrementMode: 'frame',
            wrapControls: true,
            prevText: '<',
            nextText: '>',
        });
	}
);