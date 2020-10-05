import * as THREE from 'three';
export declare interface TouchObjects{
	objs: THREE.Intersection[];
	elms: HTMLElement;
}

declare interface ClickEventInfo {
	objName: string;
	event: Function;
}
declare interface HoverEventInfo {
	objName: string;
	event: ( hover: boolean, obj: THREE.Object3D | HTMLElement ) => void;
}

declare interface ElementInfo {
	element: HTMLElement;
	mouseOverHandler: any;
	mouseOutHandler: any;
}

export class EasyRaycaster {

	public enableMeshRaycaster: boolean = true;
	public enableElementRaycaster: boolean = true;

	private raycaster: THREE.Raycaster;
	private hoverElm: HTMLElement;

	private touchStartPos: THREE.Vector2 = new THREE.Vector2();
	private touchStartTime: Date;

	private elementInfos: ElementInfo[] = [];

	private hoverMemObj: THREE.Object3D;
	private holdObj: THREE.Object3D;

	private clickEvents: ClickEventInfo[] = [];
	private hoverEvents: HoverEventInfo[] = [];

	public onChangeHitObject: ( object: THREE.Object3D | HTMLElement ) => void;
	public onTouchObject: ( object: THREE.Object3D ) => void;

	constructor() {

		this.raycaster = new THREE.Raycaster();

	}

	public getHitObject( cursorPos: THREE.Vector2, camera: THREE.Camera, objects: THREE.Object3D[] ) {

		if ( ! objects ) return null;

		let objs = [];

		for ( let i = 0; i < objects.length; i ++ ) {

			const element = objects[ i ];
			objs.push( element );

		}

		let m = new THREE.Vector2( cursorPos.x, cursorPos.y );

		this.raycaster.setFromCamera( m, camera );

		let intersection = this.raycaster.intersectObjects( objs );

		for ( let i = 0; i < intersection.length; i ++ ) {

			if ( intersection[ i ].object.visible ) return intersection[ i ].object;

		}

		return null;

	}

	public checkHitObject( cursorPos: THREE.Vector2, camera: THREE.Camera, objects: THREE.Object3D[] ) {

		if ( ! this.enableMeshRaycaster ) return null;

		let hitObj = this.getHitObject( cursorPos, camera, objects );

		if ( hitObj ) {

			if ( this.hoverMemObj != hitObj ) {

				for ( let i = 0; i < this.hoverEvents.length; i ++ ) {

					let e = this.hoverEvents[ i ];

					if ( hitObj.name == e.objName ) {

						e.event( true, hitObj );

					}

				}

				if ( this.onChangeHitObject ) {

					this.onChangeHitObject( hitObj );

				}

			}

			this.hoverMemObj = hitObj;

			return hitObj;

		} else {

			if ( this.hoverMemObj ) {

				for ( let i = 0; i < this.hoverEvents.length; i ++ ) {

					let e = this.hoverEvents[ i ];

					if ( this.hoverMemObj.name == e.objName ) {

						e.event( false, this.hoverMemObj );

					}

				}

				if ( this.onChangeHitObject ) {

					this.onChangeHitObject( null );

				}

			}

			this.hoverMemObj = null;

		}

		return [];

	}

	public addElements( elements: NodeListOf<Element> )

	public addElements( elements: HTMLElement[] )

	public addElements( elements: HTMLElement )

	public addElements( elements: any ) {

		if ( ! elements ) return;

		if ( elements.length === undefined ) {

			elements = [ elements ];

		}

		for ( let i = 0; i < elements.length; i ++ ) {

			let elementInfo: ElementInfo = {
				mouseOverHandler: this.onMouseOver.bind( this, elements[ i ] ),
				mouseOutHandler: this.onMouseOut.bind( this, elements[ i ] ),
				element: elements[ i ]
			};

			elements[ i ].addEventListener( 'mouseenter', elementInfo.mouseOverHandler, false );

			elements[ i ].addEventListener( 'mouseleave', elementInfo.mouseOutHandler, false );

			elements[ i ].addEventListener( 'click', ( event: Event ) => {

				for ( let j = 0; j < this.clickEvents.length; j ++ ) {

					let e = this.clickEvents[ j ];

					if ( ( event.target as HTMLElement ).classList.contains( e.objName ) ) {

						e.event();

					}

				}

			} );

			this.elementInfos.push( elementInfo );

		}

	}

	public removeAllElements() {

		for ( let i = 0; i < this.elementInfos.length; i ++ ) {

			this.elementInfos[ i ].element.removeEventListener( 'mouseover', this.elementInfos[ i ].mouseOverHandler );

			this.elementInfos[ i ].element.removeEventListener( 'mouseout', this.elementInfos[ i ].mouseOverHandler );

		}

	}

	public addClickEvent( objName: string, event: Function ) {

		this.clickEvents.push( {
			objName: objName,
			event: event
		} );

	}

	public addHoverEvent( objName: string, event: ( hover: boolean, obj: THREE.Object3D | HTMLElement ) => void ) {

		this.hoverEvents.push( {
			objName: objName,
			event: event
		} );

	}

	public touchStart( normalizePos: THREE.Vector2, camera: THREE.Camera, objects: THREE.Object3D[] ) {

		if ( ! this.enableMeshRaycaster ) return null;

		this.holdObj = this.getHitObject( normalizePos, camera, objects );

		this.touchStartPos.copy( normalizePos );
		this.touchStartTime = new Date();

	}

	public touchEnd( normalizePos: THREE.Vector2, camera: THREE.Camera, objects: THREE.Object3D[] ) {

		if ( ! this.enableMeshRaycaster ) return null;

		if ( this.holdObj ) {

			let object = this.getHitObject( normalizePos, camera, objects );

			if ( object && object.name == this.holdObj.name ) {

				if ( new Date().getTime() - this.touchStartTime.getTime() > 200 ) return;

				if ( normalizePos.clone().sub( this.touchStartPos ).length() > 0.1 ) return;

				if ( this.onTouchObject ) {

					this.onTouchObject( this.holdObj );

				}

				for ( let i = 0; i < this.clickEvents.length; i ++ ) {

					let e = this.clickEvents[ i ];

					if ( this.holdObj.name == e.objName ) {

						e.event();

					}

				}

			}

			this.holdObj = null;

		}

	}

	private onMouseOver( elm: HTMLElement, e: MouseEvent ) {

		if ( e.target != elm || this.enableElementRaycaster ) return;

		this.hoverElm = e.target as HTMLElement;

		for ( let j = 0; j < this.hoverEvents.length; j ++ ) {

			let e = this.hoverEvents[ j ];

			if ( this.hoverElm.classList.contains( e.objName ) ) {

				e.event( true, this.hoverElm );

			}

		}

		if ( this.onChangeHitObject ) {

			this.onChangeHitObject( this.hoverElm );

		}

	}

	private onMouseOut( elm: HTMLElement, e: MouseEvent ) {

		if ( e.target != elm ) return;

		for ( let j = 0; j < this.hoverEvents.length; j ++ ) {

			let e = this.hoverEvents[ j ];

			if ( elm.classList.contains( e.objName ) ) {

				e.event( false, this.hoverElm );

			}

		}


		if ( this.onChangeHitObject ) {

			this.onChangeHitObject( null );

		}

		this.hoverElm = null;

	}

}
