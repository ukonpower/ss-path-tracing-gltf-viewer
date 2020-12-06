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

	const dofIntensity = useSelector( ( state: State ) => state.app.dofIntensity );
	const focalDistance = useSelector( ( state: State ) => state.app.focalDistance );
	const maxBounce = useSelector( ( state: State ) => state.app.maxBounce );
	const maxStep = useSelector( ( state: State ) => state.app.maxStep );
	const rayDistance = useSelector( ( state: State ) => state.app.rayDistance );

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

			mainScene.gManager.stateWatcher.updateState( 'dofIntensity', dofIntensity );
			mainScene.gManager.stateWatcher.updateState( 'focalDistance', focalDistance );
			mainScene.gManager.stateWatcher.updateState( 'maxBounce', maxBounce );
			mainScene.gManager.stateWatcher.updateState( 'maxStep', maxStep );
			mainScene.gManager.stateWatcher.updateState( 'rayDistance', rayDistance );

		}
		
	}, [ mainScene, dofIntensity, focalDistance, maxBounce, maxStep, rayDistance ] );

	return (
		<div className={ styles["canvas-wrapper"] } ref={canvasWrapperRef}>
			<canvas className={ styles["canvas"] } ref={ canvasRef }></canvas>
		</div>
	);

}
