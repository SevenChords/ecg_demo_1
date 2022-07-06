varying vec2 vTexCoord;
varying float vTime;

void main()
{
    vec2 uv = vTexCoord;
    
    float amplitude = 0.03;
    float speed = 1.2;
    
    float curve_2 = amplitude * sin((3.0 * uv.x) + (speed * vTime)) + 0.17;
    
    float curve_3 = amplitude * sin((3.0 * uv.x) + (speed * vTime)) + 0.34;
    
    float curve_4 = amplitude * sin((3.0 * uv.x) + (speed * vTime)) + 0.51;
    
    float curve_5 = amplitude * sin((3.0 * uv.x) + (speed * vTime)) + 0.68;
    
    float curve_6 = amplitude * sin((3.0 * uv.x) + (speed * vTime)) + 0.85;

   
    //Default purple
    gl_FragColor = vec4(0.7, 0.2, .7,1.0);

    //assign different colors
    if(uv.y >= curve_2){
      gl_FragColor = vec4(0.2, 0.2, 1.0,1.0);
    }
    if(uv.y >= curve_3){
       
        gl_FragColor = vec4(0.3, 0.6, 0.2,1.0);
    }
    if(uv.y >= curve_4){
         gl_FragColor = vec4(1.0, 0.9, 0,1.0);
    }
    if(uv.y >= curve_5){
        
          gl_FragColor = vec4(1.0, 0.5, 0,1.0);
    }
    if(uv.y >= curve_6){
        gl_FragColor = vec4(1.0, 0, 0,1.0);
    } 
}