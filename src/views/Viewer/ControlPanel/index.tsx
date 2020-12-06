import * as ORE from '@ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Actions, State } from '@store';
import { InputItem } from '@components';

import style from './style.scss';
import { useSelector } from 'react-redux';
import { appActions } from '../../../views/modules/app';

import { ParamGroup } from './ParamGroup';

export function ControlPanel() {
	
	const dofIntensity = useSelector( ( state: State ) => state.app.dofIntensity );
	const focalDistance = useSelector( ( state: State ) => state.app.focalDistance );
	const maxBounce = useSelector( ( state: State ) => state.app.maxBounce );
	const maxStep = useSelector( ( state: State ) => state.app.maxStep );
	const rayDistance = useSelector( ( state: State ) => state.app.rayDistance );


	return (
		<div className={style["controlPanel"]}>
			<div className={style["controlPanel-inner"]}>
				<ParamGroup label="Path Tracing">
					<InputItem name="DoF" type="slider" min={0} max={1} value={dofIntensity} action={appActions.changeDofIntensity} ></InputItem>
					<InputItem name="Max Bounce" type="slider" min={0} max={15} value={maxBounce} step={1} action={appActions.changeMaxBounce} ></InputItem>
					<InputItem name="Max Step" type="slider" min={0} max={100} value={maxStep} step={1} action={appActions.changeMaxStep} ></InputItem>
					<InputItem name="Ray Distance" type="slider" min={0} max={3} value={rayDistance} action={appActions.changeRayDistance} ></InputItem>
				</ParamGroup>

			</div>
		</div>
	);

}
