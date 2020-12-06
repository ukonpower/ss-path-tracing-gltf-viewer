import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { appActions } from './actions';

export interface AppState {
	pathTracingParam: {
		focalDistance: number,
		rayDistance: number,
		maxStep: number,
		maxBounce: number,
	}
	cameraParam: {
		dofIntensity: number,
		fov: number
	}
}

const initialState: AppState = {
	pathTracingParam: {
		focalDistance: 0.0,
		rayDistance: 1.0,
		maxStep: 50,
		maxBounce: 5
	},
	cameraParam: {
		dofIntensity: 0.1,
		fov: 45
	}
};

export const appReducer = reducerWithInitialState( initialState )
	.case( appActions.updatePathTracingState, ( state, param ) => {

		let newState = Object.assign( {}, state );
		newState.pathTracingParam = Object.assign( {}, newState.pathTracingParam );
		newState.pathTracingParam[ param.selector ] = param.value;

		return newState;

	} )
	.case( appActions.updateCameraState, ( state, param ) => {

		let newState = Object.assign( {}, state );
		newState.cameraParam = Object.assign( {}, newState.cameraParam );
		newState.cameraParam[ param.selector ] = param.value;

		return newState;

	} );
