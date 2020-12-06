import * as THREE from 'three';
import * as ORE from '@ore-three-ts';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { EasyRaycaster } from './EasyRaycaster';
import { Viewer } from './Viewer';
import { RenderCamera } from './RenderCamera';
import { CameraTarget } from './CameraTarget';
import { appActions } from '@modules/app';

export class EditorScene extends THREE.Object3D {

	private wrapperElm: HTMLElement;
	private commonUniforms: ORE.Uniforms;

	/*------------------------
		Camera
	------------------------*/
	public editorCamera: THREE.PerspectiveCamera;
	public renderCamera: RenderCamera;
	private cameraTarget: CameraTarget;

	/*------------------------
		Controls
	------------------------*/
	public orbitControls: OrbitControls;
	public transformControls: TransformControls;
	private eRay: EasyRaycaster;
	private touchableObjects: THREE.Object3D[] = []

	/*------------------------
		Preview
	------------------------*/
	private viewer: Viewer;
	public previewRenderTarget: THREE.WebGLRenderTarget;

	constructor( elm: HTMLElement, parentUniforms?: ORE.Uniforms ) {

		super();

		this.wrapperElm = elm;

		this.commonUniforms = ORE.UniformsLib.CopyUniforms( {
			editorAspect: {
				value: 1.0
			},
			previewTex: {
				value: null
			},
			previewAspect: {
				value: 1.0
			}
		}, parentUniforms );

		this.init();
		this.resize();

	}

	protected init() {

		/*------------------------
			Lights
		------------------------*/
		let light: THREE.Light;
		light = new THREE.DirectionalLight();
		light.intensity = 1.5;
		light.position.set( 1.0, 1.0, 1.0 );
		this.add( light );

		light = new THREE.AmbientLight();
		light.intensity = 0.5;
		this.add( light );

		/*------------------------
			Editor Scene Camera
		------------------------*/
		this.editorCamera = new THREE.PerspectiveCamera();
		this.editorCamera.position.set( - 3, 3, 10 );
		this.add( this.editorCamera );

		this.orbitControls = new OrbitControls( this.editorCamera, this.wrapperElm );

		/*------------------------
			Render Camra
		------------------------*/
		this.renderCamera = new RenderCamera( this.commonUniforms );
		this.renderCamera.far = 20;
		this.renderCamera.position.set( 1, 2, 6 );
		this.add( this.renderCamera );
		this.touchableObjects.push( this.renderCamera.clickTarget );

		let cameraHelper = new THREE.CameraHelper( this.renderCamera );
		this.add( cameraHelper );

		/*------------------------
			TransformControls
		------------------------*/
		this.transformControls = new TransformControls( this.editorCamera, this.wrapperElm );
		this.add( this.transformControls );

		this.transformControls.attach( this.renderCamera );
		this.transformControls.addEventListener( 'dragging-changed', ( e ) =>{

			this.orbitControls.enabled = ! e.value;

		} );

		this.transformControls.addEventListener( 'change', ( e ) =>{

			this.dispatchEvent( {
				type: 'sceneupdate'
			} );

		} );

		/*------------------------
			Camer Target
		------------------------*/

		this.cameraTarget = new CameraTarget( this.transformControls, this.commonUniforms );
		this.cameraTarget.position.set( 0.3, 1, 2 );
		this.add( this.cameraTarget );
		this.touchableObjects.push( this.cameraTarget );

		this.transformControls.addEventListener( 'change', ( e ) =>{

			let objName = this.transformControls.object ? this.transformControls.object.name : '';

			if ( objName.match( /CameraTarget|RenderCamera/ ) ) {

				this.renderCamera.lookAt( this.cameraTarget.position );

				let forcalDistance = this.cameraTarget.position.distanceTo( this.renderCamera.position );
				window.gManager.dispatch( appActions.updatePathTracingState( { selector: 'focalDistance', value: forcalDistance } ) );

			}

		} );

		this.transformControls.dispatchEvent( {
			type: 'change'
		} );

		/*------------------------
			Helper
		------------------------*/

		let glidHelper = new THREE.GridHelper( 10, 10, 0x00FF, 0x808080 );
		this.add( glidHelper );

		/*------------------------
			Viewer
		------------------------*/
		this.viewer = new Viewer( this.commonUniforms );
		this.add( this.viewer );

		this.previewRenderTarget = new THREE.WebGLRenderTarget( 1, 1 );
		this.commonUniforms.previewTex.value = this.previewRenderTarget.texture;

		/*------------------------
			eRay
		------------------------*/
		this.eRay = new EasyRaycaster();

	}

	public update() {

		this.orbitControls.update();

	}

	public touchStart( p: THREE.Vector2 ) {

		let obj = this.eRay.touchStart( p, this.editorCamera, this.touchableObjects );

		if ( obj ) {

			if ( obj.userData.onClick ) {

				obj = obj.userData.onClick();

			}

			if ( obj != this.transformControls.object ) {

				this.transformControls.detach();
				this.transformControls.attach( obj );

			}

		}

	}

	public touchMove( p: THREE.Vector2 ) {

	}

	public touchEnd( p: THREE.Vector2 ) {

		this.eRay.touchEnd( p, this.editorCamera, [] );

	}

	public resizeRenderSize( size: THREE.Vector2 ) {

		this.previewRenderTarget.setSize( size.x, size.y );
		this.commonUniforms.previewAspect.value = size.x / size.y;

		this.renderCamera.aspect = size.x / size.y;
		this.renderCamera.updateProjectionMatrix();

	}

	public resize( windowSize?: THREE.Vector2 ) {

		if ( ! windowSize ) {

			windowSize = new THREE.Vector2( this.wrapperElm.clientWidth, this.wrapperElm.clientHeight );

		}

		this.commonUniforms.editorAspect.value = windowSize.x / windowSize.y;

		this.editorCamera.aspect = windowSize.x / windowSize.y;
		this.editorCamera.updateProjectionMatrix();

	}

}
