float hash(vec2 p)
{
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

float noise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(a, b, u.x),
        mix(c, d, u.x),
        u.y
    );
}

vec3 paperColor(vec2 uv)
{
    vec3 color = vec3(0.94, 0.925, 0.87);

    float stain = noise(uv * 2.0);
    // color += (stain - 0.5) * 0.03;
    color += (stain - 0.5) * 0.3;

    float medium = noise(uv * 10.0);
    color += (medium - 0.5) * 0.015;

    float grain = hash(floor(uv * 500.0));
    color += (grain - 0.5) * 0.01;

    float specks = step(0.9975, hash(floor(uv * 350.0)));
    color -= specks * 0.15;

    return color;
}
