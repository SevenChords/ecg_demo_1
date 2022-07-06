
varying vec2 vTexCoord;
varying float vTime;

void main(  )
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = vTexCoord * 2.0 - 1.0;
    #define PI     3.14159265
    #define INF    2147483647.0

    // Time varying pixel color
    vec3 col = vec3(0.5 + tan(0.5 * vTime + uv.x * 5.0 + PI / 3.0)
                        * tan(0.5 * vTime + uv.y * 5.0 + PI / 3.0) * INF,
                    0.5 + tan(0.5 * vTime + uv.x * 5.0 - PI / 3.0)
                        * tan(0.5 * vTime + uv.y * 5.0 - PI / 3.0) * INF,
                    0.5 + tan(0.5 * vTime + uv.x * 5.0)
                        * tan(0.5 * vTime + uv.y * 5.0) * INF);

    // Output to screen
    gl_FragColor = vec4(col, 1.0);
}