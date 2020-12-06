import * as THREE from 'three';
import * as ORE from '@ore-three-ts';

export class RenderCamera extends THREE.PerspectiveCamera {

	private commonUniforms: ORE.Uniforms;
	public clickTarget: THREE.Mesh;

	constructor( parentUniforms?: ORE.Uniforms ) {

		super();

		this.name = 'RenderCamera';

		this.commonUniforms = ORE.UniformsLib.CopyUniforms( parentUniforms, {
		} );

		this.init();

	}

	protected init() {

		this.clickTarget = new THREE.Mesh( new THREE.BoxBufferGeometry( 0.5, 0.5, 0.5 ), new THREE.MeshBasicMaterial( { visible: false } ) );
		this.clickTarget.userData.onClick = () => {

			return this;

		};

		this.add( this.clickTarget );

	}

}
