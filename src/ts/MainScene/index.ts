import * as ORE from 'ore-three-ts';
import * as THREE from 'three';
import * as OrayTracingRenderer from '@OrayTracingRenderer';
import { SimpleDropzone } from 'simple-dropzone';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class MainScene extends ORE.BaseScene {

	private commonUniforms: ORE.Uniforms;

	private simpleDropZone: any;

	private orayRenderer: OrayTracingRenderer.Renderer;
	private controls: OrbitControls;
	private isSceneCreated: boolean = false;

	private currentGLTFScene: THREE.Group;

	constructor() {

		super();

		this.name = "MainScene";

		this.commonUniforms = {
			time: {
				value: 0
			}
		};

	}

	onBind( gProps: ORE.GlobalProperties ) {

		super.onBind( gProps );

		this.renderer = this.gProps.renderer;

		this.orayRenderer = new OrayTracingRenderer.Renderer( this.renderer, this.gProps.resizeArgs.windowPixelSize.multiplyScalar( 0.8 ) );

		this.controls = new OrbitControls( this.camera, document.querySelector( '.dropzone' ) );
		this.controls.addEventListener( 'change', () => {

			this.orayRenderer.resetFrame();

		} );

		this.initDropZone();

	}

	private initDropZone() {

		this.simpleDropZone = new SimpleDropzone(
			document.querySelector( '.dropzone' ),
			document.querySelector( '.file-input' )
		);

		this.simpleDropZone.on( 'drop', ( { files } ) => {

			files.forEach( ( value, key ) => {

				let url = URL.createObjectURL( value );

				this.load( url );

			} );

		} );

	}

	private load( url: string ) {

		let loader = new GLTFLoader();

		loader.load( url, ( gltf ) => {

			if ( this.currentGLTFScene ) this.scene.remove( this.currentGLTFScene );

			this.currentGLTFScene = gltf.scene;

			this.scene.add( gltf.scene );

			this.initScene();

			document.body.setAttribute( 'data-loaded', 'true' );

		} );

		let cubeTexLoader = new THREE.CubeTextureLoader();
		cubeTexLoader.load( [
			'./assets/img/cubemap/Bridge2/posx.jpg',
			'./assets/img/cubemap/Bridge2/negx.jpg',
			'./assets/img/cubemap/Bridge2/posy.jpg',
			'./assets/img/cubemap/Bridge2/negy.jpg',
			'./assets/img/cubemap/Bridge2/posz.jpg',
			'./assets/img/cubemap/Bridge2/negz.jpg',
		], ( tex ) => {

			this.scene.background = tex;

		} );

	}

	private initScene() {

		this.orayRenderer.resetFrame();

		this.camera.position.set( 3, 3, 10 );
		this.controls.target = new THREE.Vector3( 0, 0, 0 );

		this.scene.traverse( ( obj: THREE.Mesh ) => {

			if ( obj.isMesh ) {

				obj.material = new OrayTracingRenderer.Material( {
					baseMaterial: obj.material
				} );

				if ( obj.name.indexOf( 'Light' ) > - 1 ) {

					( obj.material as OrayTracingRenderer.Material ).emission = new THREE.Vector3( 10, 10, 10 );

				}

			}

		} );

		this.isSceneCreated = true;

	}

	public animate( deltaTime: number ) {

		if ( this.isSceneCreated ) {

			this.controls.update();

			this.orayRenderer.render( this.scene, this.camera );

		}

	}

	public onResize( args: ORE.ResizeArgs ) {

		super.onResize( args );

	}

}
