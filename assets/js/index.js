import '../sass/main.sass';
import $ from 'jquery';
import canvas from './canvas';

$(document).ready( () => {

	if ($('body').hasClass('home-template')) {
		canvas();
	}
});