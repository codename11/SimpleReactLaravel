/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.smiley_images = [
		'lisa.gif', 'angel_smile.gif', 'angry_smile.gif', 'broken_heart.gif', 'confused_smile.gif', 'cry_smile.gif', 'devil_smile.gif', 'embaressed_smile.gif', 'embarrassed_smile.gif', 'envelope.gif', 'heart.gif', 'kiss.gif', 'lightbulb.gif', 'omg_smile.gif', 'regular_smile.gif', 'sad_smile.gif', 'shades_smile.gif', 'teeth_smile.gif', 'thumbs_down.gif', 'thumbs_up.gif', 'tongue_smile.gif', 'tounge_smile.gif', 'whatchutalkingabout_smile.gif', 'wink_smile.gif', 'lisa1.png'
	];
	config.height = '50px';
	config.width = 'auto';
	//config.removeButtons = 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
	config.toolbarCanCollapse = true;
	config.uiColor = 'whitesmoke';
	config.toolbarGroups = [
        //{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
        //{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
        { name: 'links' },
        { name: 'insert' },
        //{ name: 'forms' },
        //{ name: 'tools' },
        //{ name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
        //{ name: 'others' },
		// ,"/" da bi se slagale grupe u toolbar-u.
		{ name: 'mode' },
		{ name: 'basicstyles' },
		//{ name: 'cleanup'},
		{ name: 'list' },
		{ name: 'indent' },
		{ name: 'blocks' },
		{ name: 'align' },
		{ name: 'bidi' },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'paragraph' },
		{ name: 'about' }
        
        
	];
	
	CKEDITOR.config.autoParagraph = false;//Ukida pravljenje p taga oko posta.
};
