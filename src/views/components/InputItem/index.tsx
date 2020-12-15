
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { StaticReadUsage } from 'three';
import { ActionCreator } from 'typescript-fsa';
import { appActions } from '../../../views/modules/app';

import style from './style.scss';

declare interface inputItemProps {
	name: string;
	type: 'none' | 'slider'|'number'
	actions?: { selector: string, action: ActionCreator<any> };
	min?: number;
	max?: number;
	value?: number;
	step?: number;
	children?: React.ReactNode,
	flex?: boolean;
	onInput?: ((e:Event)=>void)
}

export function InputItem( props: inputItemProps ) {

	const dispatch = useDispatch();
	const inputElmRef = useRef<HTMLInputElement>();

	let inputElm: JSX.Element;
	
	if( props.type == 'slider') {
		inputElm = 
		<div className={style['inputItem-value-wrapper']}>
			<input ref={inputElmRef} className={style['inputItem-value']} type="range" min={props.min} max={props.max} defaultValue={props.value} step={props.step || 0.00001} onInput={(e)=>{
				dispatch( props.actions.action({ selector: props.actions.selector, value: (e.target as HTMLInputElement).value }) );
			}} ></input>
			<div className={style['inputItem-value-viewer']} >{props.value}</div>
		</div>
	} else if ( props.type == 'number' ) {
		inputElm= 
		<div className={style['inputItem-value-wrapper']}>
			<input ref={inputElmRef} className={style['inputItem-value']} type="number" min={props.min} max={props.max} defaultValue={props.value} onChange={(e) => {
				dispatch( props.actions.action({ selector: props.actions.selector, value: (e.target as HTMLInputElement).value }) );
			}}></input>
		</div>
	} else if( props.type == 'none' ) {
		inputElm =
		<div>
			{props.children}
		</div>
	}

	return (
		<div className={style['inputItem']} data-flex={props.flex}>
			<div className={style['inputItem-label']}>{props.name}</div>
			{inputElm}
		</div>
	);	

}
