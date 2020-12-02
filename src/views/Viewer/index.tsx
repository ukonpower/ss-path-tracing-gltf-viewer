import * as ORE from '@ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Actions } from '@store';

import style from './style.scss';

import { ControlPanel } from './ControlPanel';
import { Graphics } from './Graphics';

export function Viewer() {

	return (
		<div className={style["viewer"]}>
			<Graphics/>
			<ControlPanel/>
		</div>
	);

}
