import * as ORE from '@ore-three-ts';

import React, { useState, useEffect, useRef, Children } from 'react';
import * as ReactDOM from 'react-dom';
import { Actions, State } from '@store';
import { InputItem } from '@components';

import style from './style.scss';
import { useSelector } from 'react-redux';
import { appActions } from '../../modules/app';

declare interface ParamGroupProps{
	children: JSX.Element[],
	label: string
}

export function ParamGroup( props: ParamGroupProps) {

	return (
	<div className={style['paramGroup']}>
		<div className={style['paramGroup-label']}>{props.label}</div>
		<div className={style['paramGroup-items']}>{props.children}</div>
	</div>
	);

}
