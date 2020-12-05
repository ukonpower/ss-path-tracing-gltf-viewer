
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { StaticReadUsage } from 'three';
import { ActionCreator } from 'typescript-fsa';
import { appActions } from '../../../views/modules/app';

import style from './style.scss';

declare interface inputItemProps {
	name: string;
	type: 'slider'|'toggle'
	action: ActionCreator<number>;
	min?: number;
	max?: number;
	value?: number;
	onInput?: ((e:Event)=>void)
}

export function InputItem( props: inputItemProps ) {

	const dispatch = useDispatch();
	const inputElmRef = useRef<HTMLInputElement>();

	useEffect(() => {

		if( inputElmRef.current ){

			inputElmRef.current.addEventListener( 'input', (e) =>{

				let target = e.target as HTMLInputElement;
					
				dispatch( props.action( Number( target.value ) ) );

			} );
			
		}
		
	},[inputElmRef])
	
	let inputElm;
	
	if( props.type == 'slider') {
		inputElm = <input ref={inputElmRef} className={style['inputItem-value']} type="range" min={props.min} max={props.max} defaultValue={props.value} step="0.001"></input>
	} else {
		inputElm = <input ref={inputElmRef} className={style['inputItem-value']} type="toggle"></input>
	}

	dispatch( props.action( props.value ) );

	return (
		<div className={style['inputItem']}>
			<div className={style['inputItem-label']}>{props.name}</div>
			{inputElm}
		</div>
	);

}
