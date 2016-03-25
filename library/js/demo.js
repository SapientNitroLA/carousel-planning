require(

	[
		'carousel',
        'carousel.pagination',
        'carousel.autorotate',
        'carousel.loop',
        'carousel.animate'
	],

    function( carousel ) {

        var myCarousel = carousel.create({
            element: document.getElementById( 'example-carousel' ),
            wrapperClass: 'test-3 test-4',
            tilesPerFrame: 2,
            incrementMode: 'tile',
            // incrementMode: 'frame',
            wrapControls: true,
            // loop: true, // broken
            prevText: '<',
            nextText: '>',
            pagination: {
                center: true,
                statusOnly: true,
                frameText: '{pageNumber} of {total}'
            },
            animate: true,
            // autorotate: {
            //     stopEvent: 'click'
            // }
        });

        // var myCarousel2 = carousel.create({
        //     element: document.getElementById( 'example-carousel-2' ),
        //     wrapperClass: 'test-1 test-2',
        //     tilesPerFrame: 2,
        //     // incrementMode: 'tile',
        //     nextText: 'next',
        //     prevText: 'previous',
        //     wrapControls: true,
        //     pagination: {
        //         frameText: '{pageNumber} of {total}',
        //         center: true // TODO handle centering when wrapControls is false. Should it simply not be done? Should wrapControls be forced to true?
        //     },
        //     animate: true
        //     // loop: true
        //     //responsive: true
        // });

	}
);