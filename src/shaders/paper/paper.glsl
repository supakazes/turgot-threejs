// Pseudo-random value in [0,1] from a 2D point (Dave Hoskins' hash). It scales
// the input DOWN first (*0.1031), so it stays precise even at the large
// coordinates our world-projected paper UVs reach at high frequencies. The old
// scale-up hash lost all precision past ~uv*100, which is why grain/specks
// looked dead.
float hash(vec2 p)
{
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
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

// Fractal noise (fbm): sum several octaves of value noise, each one at double
// the frequency and half the weight. Rotating every octave by an irrational
// angle stops the per-octave grids from ever lining up, which kills the
// axis-aligned "lattice" look of a single noise() call.
float fbm(vec2 p)
{
    // ~34 degree rotation, reused each octave so orientations never repeat.
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);

    float value = 0.0;
    float amp = 0.5;

    for (int i = 0; i < 5; i++)
    {
        value += amp * noise(p);
        p = rot * p * 2.0;
        amp *= 0.5;
    }

    return value;
}

// 2-vector hash, used to jitter speck positions inside their cell.
vec2 hash2(vec2 p)
{
    return vec2(hash(p), hash(p + 17.13));
}

// All tunable knobs live as uniforms so they can be driven live from lil-gui.
uniform vec3  uPaperBaseColor;   // blank sheet tone
uniform float uStain1Scale;      // big blotches: frequency (lower = bigger)
uniform float uStain1Strength;   // big blotches: intensity
uniform float uStain2Scale;      // medium mottle: frequency
uniform float uStain2Strength;   // medium mottle: intensity
uniform float uWarpStrength;     // domain warp: how much to distort the stains

// Big foxing specks
uniform float uSpeck1Scale;      // frequency (higher = smaller/denser)
uniform float uSpeck1Density;    // fraction of cells that get a dot
uniform float uSpeck1Size;       // dot radius within its cell
uniform float uSpeck1Strength;   // how dark

// Small foxing specks
uniform float uSpeck2Scale;
uniform float uSpeck2Density;
uniform float uSpeck2Size;
uniform float uSpeck2Strength;

// Sparse round foxing dots. Space is a grid; each cell may hold one dot at a
// jittered position. A dot only appears if the cell passes the density test,
// then a radial falloff makes it round (not a square) and per-dot randomness
// varies its darkness. Higher scale => smaller, denser dots. The seed offsets
// the hashes so two speck layers don't land on the exact same positions.
float specks(vec2 uv, float scale, float density, float size, float seed)
{
    vec2 cell = floor(uv * scale) + seed;
    vec2 f = fract(uv * scale);

    // Does this cell contain a dot at all?
    if (hash(cell + 3.7) > density) return 0.0;

    // Jittered dot centre inside the cell, then round radial falloff.
    vec2 center = 0.2 + 0.6 * hash2(cell);
    float d = distance(f, center);
    float dot = 1.0 - smoothstep(0.0, size, d);

    // Vary darkness per dot so they don't all read as identical.
    float darkness = 0.5 + 0.5 * hash(cell + 9.1);

    return dot * darkness;
}

vec3 paperColor(vec2 uv)
{
    // 1. Base paper tone: warm aged cream. This is the "blank sheet" color.
    vec3 color = uPaperBaseColor;

    // 2. Domain warp: offset the sample point by more noise before reading the
    //    stains. This bends the blotches into organic, non-grid shapes.
    vec2 warp = vec2(
        fbm(uv * uStain1Scale + 5.2),
        fbm(uv * uStain1Scale + 1.3)
    );
    vec2 wuv = uv + (warp - 0.5) * uWarpStrength;

    // 3. Large-scale mottling (aged patches), now fractal + warped so it reads
    //    as natural paper aging rather than a soft grid.
    float stain1 = fbm(wuv * uStain1Scale);
    color += (stain1 - 0.5) * uStain1Strength;

    // 4. Second, finer octave of mottling for mid-scale unevenness.
    float stain2 = fbm(wuv * uStain2Scale);
    color += (stain2 - 0.5) * uStain2Strength;

    // 5. Foxing specks: two layers of round dark dots, big and small.
    color -= specks(uv, uSpeck1Scale, uSpeck1Density, uSpeck1Size, 0.0) * uSpeck1Strength;
    color -= specks(uv, uSpeck2Scale, uSpeck2Density, uSpeck2Size, 41.0) * uSpeck2Strength;

    return color;
}
