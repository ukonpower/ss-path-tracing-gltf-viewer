
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';

import style from './style.scss';

export function Header( props ) {

	const dispatch = useDispatch();

	return (
		<header className={style["header"]}>
			<div className={style["header-inner"]}>
				<div className={style["header-title"]}>SS-PathTracing Renderer</div>
			</div>
		</header>
	);

}
