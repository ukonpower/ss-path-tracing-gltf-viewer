import * as ORE from '@ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Actions, State } from '@store';
import { InputItem } from '@components';
import { ResolutionInput } from '@components';

import style from './style.scss';
import { useSelector } from 'react-redux';
import { appActions } from '../../../views/modules/app';

import { ParamGroup } from './ParamGroup';

export function ControlPanel() {
	
	const pathTracingParam = useSelector( ( state: State ) => state.app.pathTracingParam );
	const cameraParam = useSelector( ( state: State ) => state.app.cameraParam );

	return (
		<div className={style["controlPanel"]}>
			<div className={style["controlPanel-inner"]}>
				<ParamGroup label="Path Tracing">
					<InputItem name="Max Bounce" type="slider" min={0} max={15} value={pathTracingParam.maxBounce} step={1} actions={ {action: appActions.updatePathTracingState, selector: 'maxBounce' } } ></InputItem>
					<InputItem name="Max Step" type="slider" min={0} max={100} value={pathTracingParam.maxStep} step={1} actions={ {action: appActions.updatePathTracingState, selector: 'maxStep' } } ></InputItem>
					<InputItem name="Ray Distance" type="slider" min={0} max={3} value={pathTracingParam.rayDistance} actions={ {action: appActions.updatePathTracingState, selector: 'rayDistance' } } ></InputItem>
				</ParamGroup>
				<ParamGroup label="Camera">
					<InputItem name="FOV" type="slider" min={0} max={180} value={cameraParam.fov} actions={ {action: appActions.updateCameraState, selector: 'fov' }} ></InputItem>
					<InputItem name="DoF" type="slider" min={0} max={1} value={cameraParam.dofIntensity} actions={ {action: appActions.updateCameraState, selector: 'dofIntensity' }} ></InputItem>
				</ParamGroup>
				<ParamGroup label="Rendering">
					<ResolutionInput/>
				</ParamGroup>

			</div>
		</div>
	);

}
