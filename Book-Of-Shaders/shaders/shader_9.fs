// Last we use a contrast factor that is itself being generated by Perlin-Noise. Its scale is even lower than that of all previous noise. It dynamically hides and shows spots of the pattern.

varying vec2 vUv;
varying lowp vec4 vColor;
varying vec2 vTexCoord;
varying float vTime;
varying vec3 vNormal;

float interpolate(float a0, float a1, float x){
    if (x < 0.0) return a0;
    if (x > 1.0) return a1;
    return (a1 - a0) * ((x * (x * 6.0 - 15.0) + 10.0) * x * x * x) + a0;
}


vec2 randomGradient(int ix, int iy, float offset){
    vec2 coord = vec2(ix, iy);
    coord = mod(coord, 10000.0);
    float a = fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453+offset);
    float random = a * 3.14159265 * 2.0;
    vec2 v;
    v.x = sin(random);
    v.y = cos(random);
    return v;
    
}


float dotGridGradient(int ix, int iy, vec2 uv, float offset){
    vec2 gradient = randomGradient(ix, iy, offset);
    vec2 delta = uv - vec2(ix, iy);
    return dot(delta, gradient);
}


float perlin(vec2 fragCoord, float offset, float scale)
{
    vec2 uv = fragCoord;
    uv /= scale;
    vec2 ipos = floor(uv);
    vec2 fpos = fract(uv);
    
    int x0 = int(ipos.x);
    int x1 = int(ipos.x) + 1;
    int y0 = int(ipos.y);
    int y1 = int(ipos.y) + 1;
    
    float sx = fpos.x;
    float sy = fpos.y;
    
    float n0, n1, o0, o1, ix0, ix1, value;
    n0 = dotGridGradient(x0, y0, uv, offset);
    n1 = dotGridGradient(x1, y0, uv, offset);
    ix0 = interpolate(n0, n1, sx);
    o0 = dotGridGradient(x0, y1, uv, offset);
    o1 = dotGridGradient(x1, y1, uv, offset);
    ix1 = interpolate(o0, o1, sx);
    return interpolate(ix0, ix1, sy);
    
}

void main()
{
    vec2 fragCoord = vTexCoord/(0.001, 0.001);
    float iTime = vTime;
    float v = 1.;
    
    vec3 col = vec3(0.0, 0.0, 0.0);
    float brightness = -0.3;
    float contrast = perlin(fragCoord, (iTime)/10., 900.)*10.;
    
    float p1 = perlin(fragCoord, (iTime*v)/10., 100.)*contrast;
    float p2 = perlin(fragCoord, (iTime*v)/10., 210.)*contrast;
    float p3 = perlin(fragCoord, (iTime*v)/3., 50.)*contrast;
    float p4 = perlin(fragCoord, (iTime*v)/20., 200.)*contrast;
    float color = p1*p2*p3+p4;
    col.r = color+brightness;
    
    p1 = perlin(fragCoord, (iTime*v)/10., 100.)*contrast;
    p2 = perlin(fragCoord, (iTime*v)/10., 210.)*contrast;
    p3 = perlin(fragCoord, (iTime*v)/3., 50.)*contrast;
    p4 = perlin(fragCoord, (iTime*v)/20., 200.)*contrast;
    color = p1*p2*p3+p4;
    col.g = (color+brightness)*0.4;
    
    p1 = perlin(fragCoord, (iTime*v)/10., 100.3)*contrast;
    p2 = perlin(fragCoord, (iTime*v)/10., 210.9)*contrast;
    p3 = perlin(fragCoord, (iTime*v)/3., 50.)*contrast;
    p4 = perlin(fragCoord, (iTime*v)/20., 200.1)*contrast;
    color = p1*p2*p3+p4;
    col.b = (color+brightness)*2.;
    
    gl_FragColor = vec4(col, 1.0);
}
