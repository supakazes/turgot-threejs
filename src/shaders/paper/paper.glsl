// Pseudo-random value in [0,1] from a 2D point. Same input always gives the
// same output, so the paper looks identical every frame.
float hash(vec2 p)
{
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

// Smooth value noise: hash the 4 grid corners around p and blend between them.
// Produces soft, cloud-like variation instead of the harsh per-pixel hash.
float noise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // smoothstep curve on the fractional part -> no visible grid seams
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(a, b, u.x),
        mix(c, d, u.x),
        u.y
    );
}

// All tunable knobs live as uniforms so they can be driven live from lil-gui.
uniform vec3  uPaperBaseColor;   // blank sheet tone
uniform float uStain1Scale;      // big blotches: frequency (lower = bigger)
uniform float uStain1Strength;   // big blotches: intensity
uniform float uStain2Scale;      // medium mottle: frequency
uniform float uStain2Strength;   // medium mottle: intensity
uniform float uGrainScale;       // fine fiber grain: frequency
uniform float uGrainStrength;    // fine fiber grain: intensity
uniform float uSpeckScale;       // foxing specks: frequency
uniform float uSpeckDensity;     // foxing specks: how many (0 = none, 1 = all)
uniform float uSpeckStrength;    // foxing specks: how dark

vec3 paperColor(vec2 uv)
{
    // 1. Base paper tone: warm aged cream. This is the "blank sheet" color.
    vec3 color = uPaperBaseColor;

    // 2. Large-scale mottling (aged patches). Low frequency = big soft blotches.
    //    (stain - 0.5) recenters noise to [-0.5, 0.5] so it darkens and lightens
    //    equally around the base tone.
    float stain1 = noise(uv * uStain1Scale);
    color += (stain1 - 0.5) * uStain1Strength;

    // 3. Second, finer octave of mottling. Breaks up the big blotches so they
    //    don't read as flat gradients; together they give richer, papery aging.
    float stain2 = noise(uv * uStain2Scale);
    color += (stain2 - 0.5) * uStain2Strength;

    // 4. Fine paper grain. Raw hash (not smoothed) at high frequency = crisp
    //    per-cell speckle, like the tooth of the paper fibers.
    float grain = hash(floor(uv * uGrainScale));
    color += (grain - 0.5) * uGrainStrength;

    // 5. Foxing specks. Keep only cells above the density threshold, so a sparse
    //    scattering of dots. Each one darkens the paper (ink/age flaw).
    float specks = step(1.0 - uSpeckDensity, hash(floor(uv * uSpeckScale)));
    color -= specks * uSpeckStrength;

    return color;
}
