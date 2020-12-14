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
	},
	renderingParam: {
		width: number,
		height: number
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
	},
	renderingParam: {
		width: 1920,
		height: 1080
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

	} )
	.case( appActions.updateRenderingState, ( state, param ) => {

		let newState = Object.assign( {}, state );
		newState.renderingParam = Object.assign( {}, newState.renderingParam );
		newState.renderingParam[ param.selector ] = param.value;

		return newState;

	} );
