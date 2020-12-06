import * as ORE from '@ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Actions, State } from '@store';
import { InputItem } from '@components';

import style from './style.scss';
import { useSelector } from 'react-redux';
import { appActions } from '../../../views/modules/app';

export function ControlPanel() {

	return (
		<div className={style["controlPanel"]}>
			<div className={style["controlPanel-inner"]}>
				<InputItem name="DoF" type="slider" min={0} max={1} value={0.1} action={appActions.changeDofIntensity} ></InputItem>
				<InputItem name="Max Bounce" type="slider" min={0} max={15} value={4} step={1}  action={appActions.changeMaxBounce} ></InputItem>
				<InputItem name="Max Step" type="slider" min={0} max={100} value={50} step={1}  action={appActions.changeMaxStep} ></InputItem>
				<InputItem name="Ray Distance" type="slider" min={0} max={3} value={1.0} action={appActions.changeRayDistance} ></InputItem>
			</div>
		</div>
	);

}
