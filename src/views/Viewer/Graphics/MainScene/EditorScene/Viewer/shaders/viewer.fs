uniform sampler2D previewTex;
varying vec2 vUv;

void main( void ) {

	vec4 col = texture2D( previewTex, vUv );
	gl_FragColor = col;

}