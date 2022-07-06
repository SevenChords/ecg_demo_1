
varying vec2 vTexCoord;
varying float vTime;
varying vec2 vUv;

void main()
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = vUv * 2.0 - 1.0;

    // Time varying pixel color
    vec3 col = vec3(0.5 + tan(0.5 * vTime + uv.x * 10.0)
                        * tan(0.5 * vTime + uv.y * 10.0),
                    0.5 + tan(0.5 * vTime + uv.x * 10.0)
                        * tan(0.5 * vTime + uv.y * 10.0),
                    0.5 + tan(0.5 * vTime + uv.x * 10.0)
                        * tan(0.5 * vTime + uv.y * 10.0));

    // Output to screen
    gl_FragColor = vec4(col, 1.0);
}