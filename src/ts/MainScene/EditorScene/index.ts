import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { EasyRaycaster } from './EasyRaycaster';
import { Viewer } from './Viewer';

export class EditorScene extends THREE.Object3D {

	private wrapperElm: HTMLElement;

	private commonUniforms: ORE.Uniforms;
	public editorCamera: THREE.PerspectiveCamera;
	public renderCamera: THREE.PerspectiveCamera;
	public orbitControls: OrbitControls;
	public transformControls: TransformControls;

	private viewer: Viewer;
	public previewRenderTarget: THREE.WebGLRenderTarget;
	private eRay: EasyRaycaster;

	constructor( parentUniforms?: ORE.Uniforms ) {

		super();

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

		this.editorCamera = new THREE.PerspectiveCamera();
		this.editorCamera.position.set( - 3, 3, 10 );
		this.add( this.editorCamera );

		this.renderCamera = new THREE.PerspectiveCamera();
		this.renderCamera.far = 20;
		this.renderCamera.position.set( 1, 2, 6 );
		this.renderCamera.lookAt( 0, 0.5, 0 );
		this.add( this.renderCamera );

		let cameraHelper = new THREE.CameraHelper( this.renderCamera );
		this.add( cameraHelper );

		let glidHelper = new THREE.GridHelper( 10, 10, 0x00FF, 0x808080 );
		this.add( glidHelper );

		let light: THREE.Light;
		light = new THREE.DirectionalLight();
		light.intensity = 1.5;
		light.position.set( 1.0, 1.0, 1.0 );
		this.add( light );

		light = new THREE.AmbientLight();
		light.intensity = 0.5;
		this.add( light );

		this.previewRenderTarget = new THREE.WebGLRenderTarget( 1, 1 );
		this.commonUniforms.previewTex.value = this.previewRenderTarget.texture;

		this.viewer = new Viewer( this.commonUniforms );
		this.add( this.viewer );

		this.initControls();
		this.initEray();

	}

	private initControls() {

		this.wrapperElm = document.querySelector( '.canvas-wrapper' );

		this.orbitControls = new OrbitControls( this.editorCamera, this.wrapperElm );

		this.transformControls = new TransformControls( this.editorCamera, this.wrapperElm );
		this.add( this.transformControls );

		this.transformControls.attach( this.renderCamera );
		this.transformControls.addEventListener( 'dragging-changed', ( e ) =>{

			this.orbitControls.enabled = ! e.value;


		} );

		this.transformControls.addEventListener( 'change', ( e ) =>{

			this.renderCamera.lookAt( 0, 0.5, 0 );

			this.dispatchEvent( {
				type: 'sceneupdate'
			} );

		} );

	}

	private initEray() {

		this.eRay = new EasyRaycaster();

	}

	public update() {

		this.orbitControls.update();

	}

	public touchStart( cursor: ORE.Cursor ) {


		console.log( "aaa" );

		this.eRay.touchStart( this.getCursorPos( cursor.position ), this.editorCamera, [] );

	}

	public touchMove( cursor: ORE.Cursor ) {

	}

	public touchEnd( cursor: ORE.Cursor ) {

		this.eRay.touchEnd( this.getCursorPos( cursor.position ), this.editorCamera, [] );

	}

	private getCursorPos( p: THREE.Vector2 ) {

		let rect = this.wrapperElm.getBoundingClientRect();

		let nPos = p.clone();
		nPos.x += rect.x;
		nPos.y += rect.y;
		nPos.x /= rect.width;
		nPos.y /= rect.height;
		nPos.y = 1.0 - nPos.y;

		return nPos;

	}

	public resizeRenderSize( size: THREE.Vector2 ) {

		this.previewRenderTarget.setSize( size.x, size.y );
		this.commonUniforms.previewAspect.value = size.x / size.y;

		this.renderCamera.aspect = size.x / size.y;
		this.renderCamera.updateProjectionMatrix();

	}

	public resize( windowSize?: THREE.Vector2 ) {

		if ( ! windowSize ) {

			let elm = document.querySelector( '.canvas-wrapper' ) as HTMLElement;
			windowSize = new THREE.Vector2( elm.clientWidth, elm.clientHeight );

		}

		this.commonUniforms.editorAspect.value = windowSize.x / windowSize.y;

		this.editorCamera.aspect = windowSize.x / windowSize.y;
		this.editorCamera.updateProjectionMatrix();

	}

}
