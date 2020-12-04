import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { appActions } from './actions';

export interface AppState {
	dofIntensity: number,
}

const initialState: AppState = {
	dofIntensity: 1.0
};

export const appReducer = reducerWithInitialState( initialState )
	.case( appActions.changeDofIntensity, ( state, dofIntensity ) => {

		return Object.assign( {}, state, { dofIntensity: dofIntensity } );

	} );
