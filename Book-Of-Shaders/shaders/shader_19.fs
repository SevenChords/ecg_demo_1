varying vec2 vTexCoord;
varying float vTime;


void main()
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = vTexCoord * 2.0 - 1.0;

    // Time varying pixel color
    vec3 col = vec3(0.5 + 0.5 * tan(0.7 * vTime + uv.x + 1.1),
                    0.5 + 0.5 * tan(0.3 * vTime + uv.y + 2.2),
                    0.5 + 0.5 * tan(0.75 * vTime + uv.x + uv.y));

    // Output to screen
    gl_FragColor = vec4(col, 1.0);
}