import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { appActions } from './actions';

export interface AppState {
	effectType: 1 | 2 | 2
}

const initialState: AppState = {
	effectType: 1
};

export const appReducer = reducerWithInitialState( initialState )
	.case( appActions.changeEffectType, ( state, effectType ) => {

		return Object.assign( {}, state, { effectType: effectType } );

	} );
