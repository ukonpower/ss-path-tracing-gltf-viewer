
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
	step?: number;
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
	
	let inputElm: JSX.Element;
	
	if( props.type == 'slider') {
		inputElm = 
		<div className={style['inputItem-value-wrapper']}>
			<input ref={inputElmRef} className={style['inputItem-value']} type="range" min={props.min} max={props.max} defaultValue={props.value} step={props.step || 0.00001}></input>
			<div className={style['inputItem-value-viewer']} >{props.value}</div>
		</div>
	} else {
		inputElm= 
		<div className={style['inputItem-value-wrapper']}>
			<input ref={inputElmRef} className={style['inputItem-value']} type="range" min={props.min} max={props.max} defaultValue={props.value}></input>
		</div>
	}

	dispatch( props.action( props.value ) );

	return (
		<div className={style['inputItem']}>
			<div className={style['inputItem-label']}>{props.name}</div>
			{inputElm}
		</div>
	);

}
