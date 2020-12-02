import { createStore, combineReducers } from 'redux';
import { AppState, appReducer, appActions } from './modules/app';

export type State = {
	app: AppState
};

export const Actions = {
	app: appActions,
};

export const store = createStore(
	combineReducers<State>( {
		app: appReducer
	} )
);
