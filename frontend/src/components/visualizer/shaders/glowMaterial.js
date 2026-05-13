export const glowVertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;
  varying float vPulse;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 5.0 + uTime * 1.7) + cos(pos.y * 4.0 - uTime * 1.2);
    pos.z += wave * 0.08 * uEnergy;
    vPulse = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const glowFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vPulse;

  void main() {
    float d = max(0.05, length(vUv - 0.5));
    float glow = 0.18 / d;
    float flicker = 0.86 + sin(uTime * 10.0 + vPulse) * 0.08;
    vec3 color = uColor * (glow * flicker + uEnergy * 0.74);
    gl_FragColor = vec4(color, clamp(0.42 + uEnergy * 0.55, 0.0, 0.92));
  }
`;

export const fieldVertexShader = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin((pos.x + pos.y) * 2.0 + uTime) * 0.045 * uEnergy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fieldFragmentShader = `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - 0.5;
    float radius = length(center);
    float rings = sin(radius * 46.0 - uTime * 2.4);
    float scan = sin((vUv.y + uTime * 0.05) * 520.0) * 0.5 + 0.5;
    float alpha = smoothstep(0.72, 0.0, radius) * (0.08 + uEnergy * 0.18);
    vec3 color = uColor * (0.4 + rings * 0.12 + scan * 0.07);
    gl_FragColor = vec4(color, alpha);
  }
`;
