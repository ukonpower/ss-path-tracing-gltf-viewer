uniform float time;

uniform float editorAspect;
uniform float previewAspect;
varying vec2 vUv;

void main( void ) {

	vec3 pos = position;
	pos.y += 0.5;
	pos.x -= 0.5;
	
	pos.y *= editorAspect;
	
	pos.y /= max( previewAspect, 1.0 );
	pos.x *= min( previewAspect, 1.0 );

	pos *= 0.6;

	pos.x += 0.9;
	pos.y -= 0.9;


	gl_Position = vec4( pos, 1.0 );

	vUv = uv;

}