
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StaticReadUsage } from 'three';
import { ActionCreator } from 'typescript-fsa';
import { appActions } from '../../../views/modules/app';

import style from './style.scss';

import { InputItem } from '@components';
import { State } from '@store';

export function RenderingButton( props: { onClick: (e: React.MouseEvent ) => void }) {

	const dispatch = useDispatch();
	
	return (
		<div className={style['renderingButton-wrapper']}>
			<button className={style['renderingButton']} onClick={props.onClick} >Rendering</button>
		</div>

	);

}
