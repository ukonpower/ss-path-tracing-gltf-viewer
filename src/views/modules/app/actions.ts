import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();

export const appActions = {
	updatePathTracingState: actionCreator<{selector:string, value: any}>( 'ACTIONS_UPDATE_PATH_TRACING' ),
	updateCameraState: actionCreator<{selector:string, value: any}>( 'ACTIONS_UPDATE_CAMERA' ),
};
