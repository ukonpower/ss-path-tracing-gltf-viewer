import * as ORE from '@ore-three-ts';

export class StateWatcher extends ORE.EventDispatcher {

	constructor() {

		super();

		window.stateWatcher = this;

	}

	public updateState( stateType: string, state: any ) {

		this.dispatchEvent( {
			type: stateType,
			state: state
		} );

	}

}
