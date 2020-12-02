import * as ORE from '@ore-three-ts';
import * as ReactDOM from 'react-dom';
import React from 'react';
import { store } from './store';
import { Provider } from 'react-redux';

import { Header } from './components/Header';
import { Viewer } from './Viewer';

import './style/global.scss';

declare global {
	interface Window {
		isSP: boolean;
		isIE: boolean;
	}
}

function checkUA() {

	var ua = navigator.userAgent;
	window.isSP = ( ua.indexOf( 'iPhone' ) > 0 || ua.indexOf( 'iPod' ) > 0 || ua.indexOf( 'Android' ) > 0 && ua.indexOf( 'Mobile' ) > 0 || ua.indexOf( 'iPad' ) > 0 || ua.indexOf( 'Android' ) > 0 || ua.indexOf( 'macintosh' ) > 0 );
	window.isSP = window.isSP || navigator.platform == "iPad" || ( navigator.platform == "MacIntel" && navigator.userAgent.indexOf( "Safari" ) != - 1 && navigator.userAgent.indexOf( "Chrome" ) == - 1 && ( navigator as any ).standalone !== undefined );

}

window.addEventListener( 'load', () => {

	checkUA();

	ReactDOM.render(
		<Provider store={store}>
			<Header/>
			<Viewer/>
		</Provider>,
		document.querySelector( '#app' ),
	);

} );
