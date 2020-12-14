
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StaticReadUsage } from 'three';
import { ActionCreator } from 'typescript-fsa';
import { appActions } from '../../../views/modules/app';

import style from './style.scss';

import { InputItem } from '@components';
import { State } from '@store';

export function ResolutionInput() {

	const dispatch = useDispatch();

	const width = useSelector((state: State) => state.app.renderingParam.width);
	const height = useSelector((state: State) => state.app.renderingParam.height);
	
	return (
		<InputItem name="Resolution" type='none'>
			<div className={style['resolution']}>
				<div className={style['resolution-item']}>
					<p className={style['resolution-item-label']}>X :</p>
					<input className={style['resolution-item-input']} type="number" value={width} onChange={(e) => {
						dispatch(appActions.updateRenderingState({selector: 'width', value:e.target.value }))
					}}/>
				</div>
				<div className={style['resolution-item']}>
					<p className={style['resolution-item-label']}>Y :</p>
					<input className={style['resolution-item-input']} type="number" value={height} onChange={(e) => {
						dispatch(appActions.updateRenderingState({selector: 'height', value:e.target.value }))
					}}/>
				</div>
			</div>
		</InputItem>
	);

}
