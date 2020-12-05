import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { appActions } from './actions';

export interface AppState {
	dofIntensity: number,
	focalDistance: number,
}

const initialState: AppState = {
	dofIntensity: 1.0,
	focalDistance: 0.0,
};

export const appReducer = reducerWithInitialState( initialState )
	.case( appActions.changeDofIntensity, ( state, dofIntensity ) => {

		return Object.assign( {}, state, { dofIntensity: dofIntensity } );

	} )
	.case( appActions.changeFocalDistance, ( state, focalDistance ) => {

		return Object.assign( {}, state, { focalDistance: focalDistance } );

	} );
