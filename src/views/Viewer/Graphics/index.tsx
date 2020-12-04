import * as ORE from '@ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { State } from '@store';

import { MainScene } from './MainScene';

import styles from './style.scss';

export function Graphics() {

	const canvasRef = useRef( null );
	const canvasWrapperRef = useRef( null );
	const [ controller, setController ] = useState<ORE.Controller>( null );
	const [ mainScene, setMainScene ] = useState<MainScene>( null );

	const dofIntensity = useSelector( ( state: State ) => state.app.dofIntensity );

	useEffect( () => {

		if( !( canvasWrapperRef.current && canvasRef.current ) ) return;
		
		let controller = new ORE.Controller();
		let mainScene = new MainScene();

		controller.addLayer( mainScene, {
			name: 'Main',
			canvas: canvasRef.current,
			wrapperElement: canvasWrapperRef.current
	   	} );

	   setController( controller );
	   setMainScene( mainScene );

	}, [] );

	useEffect( () => {

		if( mainScene ) {

			mainScene.stateWatcher.updateState( 'dofIntensity', dofIntensity )

		}
		
	}, [ mainScene, dofIntensity ] );

	return (
		<div className={ styles["canvas-wrapper"] } ref={canvasWrapperRef}>
			<canvas className={ styles["canvas"] } ref={ canvasRef }></canvas>
		</div>
	);

}
