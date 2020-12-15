import * as THREE from 'three';
import * as ORE from '@ore-three-ts';

import cameraTargetVert from './shaders/cameraTarget.vs';
import cameraTargetFrag from './shaders/cameraTarget.fs';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export class CameraTarget extends THREE.Mesh {

	private commonUniforms: ORE.Uniforms;

	constructor( transformControls: TransformControls, parentUniforms?: ORE.Uniforms ) {

		let geo = new THREE.SphereBufferGeometry( 0.2, 1.0, 1.0 );

		let uni = ORE.UniformsLib.mergeUniforms( parentUniforms, {
		} );

		let mat = new THREE.ShaderMaterial( {
			vertexShader: cameraTargetVert,
			fragmentShader: cameraTargetFrag,
			depthWrite: false,
			depthTest: false,
			transparent: true,
			uniforms: uni,
			wireframe: true
		} );

		super( geo, mat );

		this.name = 'CameraTarget';
		this.renderOrder = 999;

		setTimeout( () => {

			this.dispatchEvent( {
				type: 'move',
			} );

		}, 0 );

		transformControls.addEventListener( 'change', ( e ) =>{

			if ( transformControls.object && transformControls.object.name == 'CameraTarget' ) {

				this.dispatchEvent( {
					type: 'move'
				} );

			}

		} );

	}

}
