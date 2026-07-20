// Reusable 2D signed-distance primitives shared by facade surface layers.

// Signed distance to an axis-aligned box centered at the origin.
float sdBox(vec2 p, vec2 halfSize)
{
    vec2 d = abs(p) - halfSize;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Signed distance to a circle (disc) centered at the origin.
float sdCircle(vec2 p, float r)
{
    return length(p) - r;
}
