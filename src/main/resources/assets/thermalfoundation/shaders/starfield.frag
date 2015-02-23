#version 120

#define M_PI 3.1415926535897932384626433832795

uniform sampler2D texture;
uniform float time;

uniform float yaw;
uniform float pitch;

varying vec3 position;

uniform float alpha;

mat4 rotationMatrix(vec3 axis, float angle)
{

    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main() {
    // background colour

    vec4 col = vec4(0.0568, 0.0458, 0.07475, 1);
    
    // get ray from camera to fragment
    vec4 dir = normalize(vec4( -position, 0));

	// rotate the ray to show the right bit of the sphere for the angle
	float sb = sin(pitch);
	float cb = cos(pitch);
	dir = normalize(vec4(dir.x, dir.y * cb - dir.z * sb, dir.y * sb + dir.z * cb, 0));
	
	float sa = sin(-yaw);
	float ca = cos(-yaw);
	dir = normalize(vec4(dir.z * sa + dir.x * ca, dir.y, dir.z * ca - dir.x * sa, 0));
	
	vec4 ray;

	// draw the layers
	for (int i=0; i<16; i++) {
		int mult = 16-i;

		// get semi-random stuff
		int j = i + 7;
		float rand1 = (j * j * 4321 + j * 8) * 2.0F;
		int k = j + 1;
		float rand2 = (k * k * k * 239 + k * 37) * 3.6F;
		float rand3 = rand1 * 347.4 + rand2 * 63.4;

		// random rotation matrix by random rotation around random axis
		vec3 axis = normalize(vec3(sin(mod(rand1, 2*M_PI)), sin(mod(rand2, 2*M_PI)) , cos(mod(rand3, 2*M_PI))));

		// apply
		ray = dir * rotationMatrix(axis, mod(rand3, 2*M_PI));

		// calcuate the UVs from the final ray
		float u = 0.5 + (atan(ray.z,ray.x)/(2*M_PI));
		float v = 0.5 + (asin(ray.y)/M_PI);

		// get UV scaled for layers and offset by time;
		float scale = mult*0.5 + 2.75;
		vec2 tex = vec2( u * scale, (v + time * 0.00006) * scale * 0.6 );

		// sample the texture
		vec4 tcol = texture2D(texture, tex);

		// set the alpha, blending out at the bunched ends
		float a = tcol.r * (0.05 + (1.0/mult) * 0.65) * (1-smoothstep(0.15, 0.48, abs(v-0.5)));

		// get end-portal-y colours
		float r = (mod(rand1, 29.0)/29.0) * 0.5 + 0.1;
    	float g = (mod(rand2, 35.0)/35.0) * 0.5 + 0.4;
    	float b = (mod(rand1, 17.0)/17.0) * 0.5 + 0.5;

		// mix the colours
		col = col*(1-a) + vec4(r,g,b,1)*a;
	}

	float br = clamp(2.5*gl_FragCoord.w + alpha,0,1);

    col = col * br + vec4(0.047, 0.035, 0.063, 1) * (1-br);

    // increase the brightness of flashing conduits
    col.rgb = clamp(col.rgb * (1+alpha*4),0,1);

    col.a = 1;
    
    gl_FragColor = col;
}