import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const appActions = {
	changeDofIntensity: actionCreator<number>( 'ACTIONS_UPDATE_DOF_INTENSITY' ),
	changeFocalDistance: actionCreator<number>( 'ACTIONS_UPDATE_FOCAL_DISTANCE' ),
	changeRayDistance: actionCreator<number>( 'ACTIONS_UPDATE_RAY_DISTANCE' ),
	changeMaxStep: actionCreator<number>( 'ACTIONS_UPDATE_MAX_STEP' ),
	changeMaxBounce: actionCreator<number>( 'ACTIONS_UPDATE_MAX_BOUNCE' ),
};
