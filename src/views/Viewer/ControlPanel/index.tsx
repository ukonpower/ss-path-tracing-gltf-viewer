import * as ORE from '@ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Actions } from '@store';

import style from './style.scss';

export function ControlPanel() {

	return (
		<div className={style["controlPanel"]}>
			<div className={style["controlPanel-inner"]}>
				<div className={style["controlPanel-item"]}>
				</div>
			</div>
		</div>
	);

}
