import * as ORE from '@ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '@store';

import { MainScene } from './MainScene';

import styles from './style.scss';

export function Graphics() {

	const canvasRef = useRef( null );
	const canvasWrapperRef = useRef( null );

	const [ controller, setController ] = useState<ORE.Controller>( null );
	const [ mainScene, setMainScene ] = useState<MainScene>( null );

	const pathTracingParam = useSelector( ( state: State ) => state.app.pathTracingParam );
	const cameraParam = useSelector( ( state: State ) => state.app.cameraParam );

	const dispatch = useDispatch();

	useEffect( () => {

		if( !( canvasWrapperRef.current && canvasRef.current ) ) return;
		
		let controller = new ORE.Controller();
		let mainScene = new MainScene( dispatch );

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

			let keys = Object.keys( pathTracingParam );
		
			for (let i = 0; i < keys.length; i++) {

				mainScene.gManager.stateWatcher.updateState( keys[i], pathTracingParam[keys[i]] );
				
			}

		}
		
	}, [ mainScene, pathTracingParam ] );

	
	useEffect( () => {

		if( mainScene ) {

			let keys = Object.keys( cameraParam );
		
			for (let i = 0; i < keys.length; i++) {

				mainScene.gManager.stateWatcher.updateState( keys[i], cameraParam[keys[i]] );
				
			}

		}
		
	}, [ mainScene, cameraParam ] );

	return (
		<div className={ styles["canvas-wrapper"] } ref={canvasWrapperRef}>
			<canvas className={ styles["canvas"] } ref={ canvasRef }></canvas>
		</div>
	);

}
