import * as THREE from 'three';
import * as ORE from '@ore-three-ts';

import viewerVert from './shaders/viewer.vs';
import viewerFrag from './shaders/viewer.fs';

export class Viewer extends THREE.Mesh {

	private commonUniforms: ORE.Uniforms;

	constructor( parentUniforms?: ORE.Uniforms ) {

		let uni = ORE.UniformsLib.mergeUniforms( {
		}, parentUniforms );

		let geo = new THREE.PlaneBufferGeometry( 1.0, 1.0 );
		let mat = new THREE.ShaderMaterial( {
			vertexShader: viewerVert,
			fragmentShader: viewerFrag,
			uniforms: uni
		} );

		super( geo, mat );

		this.frustumCulled = false;

	}

}
