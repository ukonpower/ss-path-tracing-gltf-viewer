import * as ORE from '@ore-three-ts';
import * as THREE from 'three';
import * as OrayTracingRenderer from '@OrayTracingRenderer';
import { SimpleDropzone } from 'simple-dropzone';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EditorScene } from './EditorScene';

import { GlobalManager } from './GlobalManager';

export class MainScene extends ORE.BaseLayer {

	public gManager: GlobalManager;

	private orayRenderer: OrayTracingRenderer.Renderer;
	private preOrayRenderer: OrayTracingRenderer.Renderer;

	private editorScene: EditorScene;
	private currentGLTFScene: THREE.Group;

	private simpleDropZone: any;

	private dispatch: any;

	constructor( dispatch: any ) {

		super();

		this.dispatch = dispatch;

		this.commonUniforms = ORE.UniformsLib.CopyUniforms( this.commonUniforms, {

		} );

	}

	public onBind( info: ORE.LayerInfo ) {

		super.onBind( info );

		this.gManager = new GlobalManager( this.dispatch, {
			onMustAssetsLoaded: () => {
			}
		} );

		this.initRenderer();
		this.initScene();
		this.initDropZone();

		this.gManager.stateWatcher.addEventListener( 'resize', ( e ) => {

			this.resizeRenderer( e.state.width, e.state.height );

		} );

	}

	private initRenderer() {

		this.orayRenderer = new OrayTracingRenderer.Renderer( this.renderer, new THREE.Vector2( 1, 1 ) );
		this.preOrayRenderer = new OrayTracingRenderer.Renderer( this.renderer, new THREE.Vector2( 1, 1 ) );

		this.preOrayRenderer.focalDistance = 5.0;

		this.gManager.stateWatcher.addEventListener( 'dofIntensity', ( e ) => {

			this.orayRenderer.dofBlurRadius = e.state;
			this.preOrayRenderer.dofBlurRadius = e.state;

		} );

		this.gManager.stateWatcher.addEventListener( 'focalDistance', ( e ) => {

			this.orayRenderer.focalDistance = e.state;
			this.preOrayRenderer.focalDistance = e.state;

		} );

		this.gManager.stateWatcher.addEventListener( 'maxBounce', ( e ) => {

			this.orayRenderer.maxBounce = e.state;
			this.preOrayRenderer.maxBounce = e.state;

		} );

		this.gManager.stateWatcher.addEventListener( 'maxStep', ( e ) => {

			this.orayRenderer.maxStep = e.state;
			this.preOrayRenderer.maxStep = e.state;

		} );

		this.gManager.stateWatcher.addEventListener( 'rayDistance', ( e ) => {

			this.orayRenderer.rayDistance = e.state;
			this.preOrayRenderer.rayDistance = e.state;

		} );

	}

	private initScene() {

		this.editorScene = new EditorScene( this.info.wrapperElement, this.commonUniforms );
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

	public resizeRenderer( width: number, height: number ) {

		let size = new THREE.Vector2( width, height );
		let previewSize = size.clone().multiplyScalar( 0.3 );

		this.orayRenderer.resize( size );
		this.preOrayRenderer.resize( previewSize );
		this.preOrayRenderer.resetFrame();

		this.editorScene.resizeRenderSize( previewSize );

	}

	public onResize() {

		super.onResize();

		let wrapper = this.info.wrapperElement;
		let size = new THREE.Vector2( wrapper.clientWidth, wrapper.clientHeight );

		this.renderer.setSize( size.x, size.y );

		this.editorScene.resize( size );

	}

	public onTouchStart( touchEventArgs: ORE.TouchEventArgs ) {

		this.editorScene.touchStart( touchEventArgs.normalizedPosition );

	}

	public onTouchMove( touchEventArgs: ORE.TouchEventArgs ) {

		this.editorScene.touchMove( touchEventArgs.normalizedPosition );

	}

	public onTouchEnd( touchEventArgs: ORE.TouchEventArgs ) {

		this.editorScene.touchEnd( touchEventArgs.normalizedPosition );

	}

	private initDropZone() {

		// this.simpleDropZone = new SimpleDropzone(
		// 	document.querySelector( '.dropzone' ),
		// 	document.querySelector( '.file-input' )
		// );

		document.body.setAttribute( 'data-loaded', 'true' );
		this.load( './assets/webgl-path-tracing.glb' );

		// this.simpleDropZone.on( 'drop', ( { files } ) => {

		// 	files.forEach( ( value, key ) => {

		// 		let url = URL.createObjectURL( value );

		// 		this.load( url );

		// 	} );

		// } );

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
