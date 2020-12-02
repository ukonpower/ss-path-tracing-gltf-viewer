import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const appActions = {
	changeEffectType: actionCreator<1 | 2 | 3>( 'ACTIONS_UPDATE_STATE' ),
};
