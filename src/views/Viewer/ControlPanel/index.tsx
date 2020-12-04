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
				<InputItem name="DoF" type="slider" min={0} max={1} value={0.2} action={appActions.changeDofIntensity} ></InputItem>
			</div>
		</div>
	);

}
