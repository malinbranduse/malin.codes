import '../sass/main.sass';
import $ from 'jquery';
import canvas from './canvas';

$(document).ready( () => {

	if ($('body').hasClass('home-template')) {
		console.log('home');
		canvas();
	}
});