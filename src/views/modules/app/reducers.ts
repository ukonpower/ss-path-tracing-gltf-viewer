import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { appActions } from './actions';

export interface AppState {
	dofIntensity: number,
	focalDistance: number,
	rayDistance: number,
	maxStep: number,
	maxBounce: number,
}

const initialState: AppState = {
	dofIntensity: 1.0,
	focalDistance: 0.0,
	rayDistance: 1.0,
	maxStep: 50,
	maxBounce: 5
};

export const appReducer = reducerWithInitialState( initialState )
	.case( appActions.changeDofIntensity, ( state, dofIntensity ) => {

		return Object.assign( {}, state, { dofIntensity: dofIntensity } );

	} )
	.case( appActions.changeFocalDistance, ( state, focalDistance ) => {

		return Object.assign( {}, state, { focalDistance: focalDistance } );

	} )
	.case( appActions.changeRayDistance, ( state, rayDistance ) => {

		return Object.assign( {}, state, { rayDistance: rayDistance } );

	} )
	.case( appActions.changeMaxStep, ( state, maxStep ) => {

		return Object.assign( {}, state, { maxStep: maxStep } );

	} )
	.case( appActions.changeMaxBounce, ( state, maxBounce ) => {

		return Object.assign( {}, state, { maxBounce: maxBounce } );

	} );
