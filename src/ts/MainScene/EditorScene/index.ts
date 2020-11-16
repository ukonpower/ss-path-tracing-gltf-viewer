import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as ORE from 'ore-three-ts';

import { Viewer } from './Viewer';

export class EditorScene extends THREE.Object3D {

	private commonUniforms: ORE.Uniforms;
	public editorCamera: THREE.PerspectiveCamera;
	public renderCamera: THREE.PerspectiveCamera;
	public controls: OrbitControls;

	private viewer: Viewer;
	public previewRenderTarget: THREE.WebGLRenderTarget;

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

		this.controls = new OrbitControls( this.editorCamera, document.querySelector( '.canvas-wrapper' ) );
		this.controls.addEventListener( 'change', () => {

			this.dispatchEvent( {
				type: 'cameramove'
			} );

		} );

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

		this.previewRenderTarget = new THREE.WebGLRenderTarget( 500, 500 );
		this.commonUniforms.previewTex.value = this.previewRenderTarget.texture;

		this.viewer = new Viewer( this.commonUniforms );
		this.add( this.viewer );

	}

	public update() {

		this.controls.update();

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
