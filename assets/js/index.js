import '../sass/main.sass';
import $ from 'jquery';
import canvas from './canvas';
import post from './post';

$(document).ready( () => {

	if ($('body').hasClass('home-template')) {
		console.log('home');
		canvas();
	}

	if($('body').hasClass('post-template'))
		post();
});