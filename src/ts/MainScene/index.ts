import * as ORE from '@ore-three-ts';
import * as THREE from 'three';
import * as OrayTracingRenderer from '@OrayTracingRenderer';
import { SimpleDropzone } from 'simple-dropzone';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EditorScene } from './EditorScene';

export class MainScene extends ORE.BaseScene {

	private orayRenderer: OrayTracingRenderer.Renderer;
	private preOrayRenderer: OrayTracingRenderer.Renderer;

	private commonUniforms: ORE.Uniforms;
	private editorScene: EditorScene;
	private currentGLTFScene: THREE.Group;

	private simpleDropZone: any;

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
		this.orayRenderer = new OrayTracingRenderer.Renderer( this.renderer, new THREE.Vector2( 1, 1 ) );
		this.preOrayRenderer = new OrayTracingRenderer.Renderer( this.renderer, new THREE.Vector2( 1, 1 ) );

		this.initScene();
		this.initDropZone();
		this.resizeRenderer();

	}

	private initScene() {

		this.editorScene = new EditorScene( this.commonUniforms );
		this.editorScene.addEventListener( 'sceneupdate', () => {

			this.preOrayRenderer.resetFrame();

		} );

		this.scene.add( this.editorScene );

	}

	public animate( deltaTime: number ) {

		this.commonUniforms.time.value = this.time;

		this.editorScene.update();

		this.editorScene.visible = false;
		this.switchMaterial( true );

		this.renderer.setRenderTarget( this.editorScene.previewRenderTarget );
		this.preOrayRenderer.render( this.scene, this.editorScene.renderCamera );
		this.renderer.setRenderTarget( null );

		this.editorScene.visible = true;
		this.switchMaterial( false );

		this.renderer.render( this.scene, this.editorScene.editorCamera );

	}

	private switchMaterial( isOray: boolean ) {

		this.currentGLTFScene && this.currentGLTFScene.traverse( obj => {

			if ( ( obj as THREE.Mesh ).isMesh ) {

				( obj as THREE.Mesh ).material = isOray ? obj.userData.orayMaterial : obj.userData.baseMaterial;

			}

		} );

	}

	public resizeRenderer() {

		let size = new THREE.Vector2( window.innerWidth, window.innerHeight );
		let previewSize = size.clone().multiplyScalar( 0.3 );

		this.orayRenderer.resize( size );
		this.preOrayRenderer.resize( previewSize );

		this.editorScene.resizeRenderSize( previewSize );

	}

	public onResize( args: ORE.ResizeArgs ) {

		super.onResize( args );

		let wrapper = document.querySelector( '.canvas-wrapper' ) as HTMLElement;
		let size = new THREE.Vector2( wrapper.clientWidth, wrapper.clientHeight );

		this.renderer.setSize( size.x, size.y );

		this.editorScene.resize( size );

	}

	public onTouchStart( cursor: ORE.Cursor, e: MouseEvent ) {



		this.editorScene.touchStart( cursor );

	}

	public onTouchMove( cursor: ORE.Cursor, e: MouseEvent ) {

		this.editorScene.touchMove( cursor );

	}

	public onTouchEnd( cursor: ORE.Cursor, e: MouseEvent ) {

		this.editorScene.touchEnd( cursor );

	}

	private initDropZone() {

		this.simpleDropZone = new SimpleDropzone(
			document.querySelector( '.dropzone' ),
			document.querySelector( '.file-input' )
		);

		document.body.setAttribute( 'data-loaded', 'true' );
		this.load( './assets/webgl-path-tracing.glb' );

		this.simpleDropZone.on( 'drop', ( { files } ) => {

			files.forEach( ( value, key ) => {

				let url = URL.createObjectURL( value );

				this.load( url );

			} );

		} );

	}

	private load( url: string ) {

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

		let loader = new GLTFLoader();

		loader.load( url, ( gltf ) => {

			if ( this.currentGLTFScene ) this.scene.remove( this.currentGLTFScene );

			this.currentGLTFScene = gltf.scene;

			this.scene.add( gltf.scene );

			document.body.setAttribute( 'data-loaded', 'true' );

			this.currentGLTFScene.traverse( ( obj: THREE.Mesh ) => {

				if ( obj.isMesh ) {

					let baseMat = obj.material;
					let orayMaterial = new OrayTracingRenderer.Material( {
						baseMaterial: baseMat
					} );

					obj.material = orayMaterial;

					if ( obj.name.indexOf( 'Light' ) > - 1 ) {

						( obj.material as OrayTracingRenderer.Material ).emission = new THREE.Vector3( 10, 10, 10 );

					}

					obj.userData.baseMaterial = baseMat;
					obj.userData.orayMaterial = orayMaterial;

				}

			} );

			this.preOrayRenderer.resetFrame();

		} );

	}

}
