import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { appActions } from './actions';

export interface AppState {
	pathTracingParam: {
		dofIntensity: number,
		focalDistance: number,
		rayDistance: number,
		maxStep: number,
		maxBounce: number,
	}
}

const initialState: AppState = {
	pathTracingParam: {
		dofIntensity: 0.1,
		focalDistance: 0.0,
		rayDistance: 1.0,
		maxStep: 50,
		maxBounce: 5
	}
};

export const appReducer = reducerWithInitialState( initialState )
	.case( appActions.updatePathTracingState, ( state, param ) => {

		let newState = Object.assign( {}, state );
		newState.pathTracingParam = Object.assign( {}, newState.pathTracingParam );
		newState.pathTracingParam[ param.selector ] = param.value;

		return newState;

	} );
