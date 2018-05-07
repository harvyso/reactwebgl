// Liam Egan
// 2017

  uniform vec2 u_resolution;
  uniform float u_time;

  const int octaves = 10;
  const int octavesWarp = 3;
  const float seed = 43758.5453123;
  const float seed2 = 73156.8473192;

  const float PI = 3.14159265359;
  const float TAU = 6.28318530718;

  float random(float val) {
    return fract(sin(val) * seed);
  }

  vec2 random2(vec2 st, float seed){
      st = vec2( dot(st,vec2(127.1,311.7)),
                dot(st,vec2(269.5,183.3)) );
      return -1.0 + 2.0*fract(sin(st)*seed);
  }

  float random2d(vec2 uv) {
    return fract(
              sin(
                dot( uv.xy, vec2(12.9898, 78.233) )
              ) * seed);
  }

  // Value Noise by Inigo Quilez - iq/2013
  // https://www.shadertoy.com/view/lsf3WH
  float noise(vec2 st, float seed) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      vec2 u = f*f*(3.0-2.0*f);

      return mix( mix( dot( random2(i + vec2(0.0,0.0), seed ), f - vec2(0.0,0.0) ),
                       dot( random2(i + vec2(1.0,0.0), seed ), f - vec2(1.0,0.0) ), u.x),
                  mix( dot( random2(i + vec2(0.0,1.0), seed ), f - vec2(0.0,1.0) ),
                       dot( random2(i + vec2(1.0,1.0), seed ), f - vec2(1.0,1.0) ), u.x), u.y);
  }

  vec3 plotCircle(vec2 pos, vec2 uv, float size) {
    return vec3(smoothstep(size, size + 0.05, length(uv - pos)));
  }

  // FBM function courtesy of Patricio Vivo
  float fbm (in vec2 st, float seed) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    // Loop of octaves
    for (int i = octaves; i > 0; i--) {
        value += amplitude * noise(st, seed);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
  }

  // FBM function courtesy of Patricio Vivo
  float fbmWarp (in vec2 st, float seed) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    // Loop of octaves
    for (int i = octavesWarp; i > 0; i--) {
        value += amplitude * noise(st, seed);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
  }

float fbm2 ( in vec2 _st, float seed) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  // Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5),
                  -sin(0.5), cos(0.50));
  for (int i = 0; i < octaves; ++i) {
      v += a * noise(_st, seed);
      _st = rot * _st * 2.0 + shift;
      a *= 0.5;
  }
  return v;
}

  mat2 rotate2d(float _angle){
      return mat2(cos(_angle),sin(_angle),
                  -sin(_angle),cos(_angle));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    uv *= 5.;

    uv.x += cos(u_time / 5000.) * 1000.;
    uv.y -= sin(u_time / 3000.) * 500.;

    uv /= 5.;

    vec2 noiseuv = uv;

    noiseuv.x -= u_time/100.;

    float offsetVal = fbmWarp(noiseuv, seed);
    vec2 direction = normalize(vec2(1.));
    direction = rotate2d(offsetVal * TAU) * direction;
    vec2 uvN = uv * 2. + direction * sin(u_time / 10.) * 1.;
    vec2 uvN2 = uv * 2. + direction * sin(1. + u_time / 10.) * 1.;
    float noiseVal = fbm2(uvN, seed2);
    float noiseVal2 = fbm2(uvN2, seed);

    vec3 colour = vec3(noiseVal + noiseVal2);
    colour.rg += noiseVal2;
    colour.r += .1;
    colour.gb += noiseVal;
    // colour.b += mix(noiseVal, noiseVal2, sin(u_time / 20.)) * 5.;
    colour += 0.1;
    // colour *= noiseVal * noiseVal;
    // colour.gb += uvN / 5.;

    gl_FragColor = vec4(colour, 1.);
  }
