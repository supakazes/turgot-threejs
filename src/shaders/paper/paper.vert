varying vec3 vWorldPosition;

// Per-wall frame used by surface shaders (facade windows, ...).
// vWallUV / vWallSize come from the model when authored (see facade-windows-plan.md);
// vFacadeMetric is a world-space fallback that always works without model data.
varying vec2 vWallUV;
varying vec2 vWallSize;
varying vec2 vFacadeMetric;

// World-space surface normal, used by surface shaders for orientation-based
// (camera-independent) fake lighting.
varying vec3 vWorldNormal;

// Per-wall (lengthMeters, heightMeters). Reads (0,0) when the model omits it.
attribute vec2 aWallSize;

void main()
{
    vec4 world = modelMatrix * vec4(position, 1.0);

    vWorldPosition = world.xyz;

    // Fallback frame: horizontal run along the wall + world height, both in meters.
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 tangent = normalize(cross(worldNormal, up) + vec3(1e-5));

    vFacadeMetric = vec2(dot(world.xyz, tangent), world.y);

    vWorldNormal = worldNormal;

    vWallUV = uv;
    vWallSize = aWallSize;

    gl_Position =
        projectionMatrix *
        viewMatrix *
        world;
}
