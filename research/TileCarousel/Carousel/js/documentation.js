$(document).ready(function() {
	$('.desc, .options-desc li, .example-title, .example-desc').each(function() {
		var element 	= $(this);
		var elementText = element.html();
		var matches 	= elementText.match(/`.*?`/g);
		if(matches !== null) {
			$.each(matches, function(key, value) {
				var newValue 	= '<code>' + value.replace(/`/g, '') + '</code>';
				elementText 	= elementText.replace(value, newValue);
				element.html(elementText);
			});
		}
	});
});
try {
    // SyntaxHighlighter.config.clipboardSwf = '../doc-resources/syntaxhighlighter/scripts/clipboard.swf';
	SyntaxHighlighter.defaults['gutter'] = false;
	SyntaxHighlighter.all();
} catch(err) {}