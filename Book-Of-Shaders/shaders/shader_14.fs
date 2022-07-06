// Next we draw many circles with increasing size in a for loop.

varying vec2 vUv;
varying lowp vec4 vColor;
varying vec2 vTexCoord;
varying float vTime;
varying vec3 vNormal;

float circle(vec2 pos, vec2 uv, float screenRatio, float size, vec3 color){
    vec2 vectorFromCenter = pos - uv;
    vectorFromCenter.y *= screenRatio;
    float distFromCenter = length(vectorFromCenter);
    float circle = smoothstep(size, size, distFromCenter);
    return circle;
}

float castleRim(float x, float a, float phi){
    float t = 1.;
    float result = a * fract(x/t + phi);
    return result;
}

float normSin(float x){
    return sin(x)*0.5 + 0.5;
}

float normCos(float x){
    return cos(x)*0.5 + 0.5;
}

void main()
{
    vec2 uv = vUv;
    float screenRatio = 1.0/1.4142;
    vec3 aColor = vec3(0.025, 0.05, 0.1);
    float circleSize = 0.05;
    vec2 pos = vec2(0.5, 0.5);
    
    vec3 col = vec3(0.0, 0.0, 0.0);
    
    for(float i = 1.; i < 15.; i++){
        col += aColor * circle(pos, uv, screenRatio, circleSize, aColor);
        circleSize *= 1.3;
    }

    gl_FragColor = vec4(col,1.0);
}