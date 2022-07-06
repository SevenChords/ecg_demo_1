
uniform float timeMsec; // A-Frame time in milliseconds

varying vec2 vUv;
varying lowp vec4 vColor;
varying vec2 vTexCoord;
varying float vTime;
varying vec3 vNormal;

void main() {
    float time = timeMsec / 1000.0;
    vUv = uv;
    vColor = vec4(1.0);
    vTexCoord = uv;
    vTime = time;
    vNormal = normal;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}