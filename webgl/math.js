// ------------------------------------------------------------------------ 
// MATH: Vector 3d, Matrix 4x4  
// ------------------------------------------------------------------------ 
export function vec(x,y,z){
  return {x: x, y: y, z: z }
}
// ------------------------------------------------------------------------ 
// Returns true if almost equal
export function fuzzyEqual( a, b, eps=1e-6 )
{
    return ( Math.abs(a-b) < eps )
}
// ------------------------------------------------------------------------ 
// Returns true if almost equal
export function fuzzyEqualVec2( v1, v2, eps=1e-6 )
{
    return ( Math.abs(v1.x-v2.x) < eps &&
             Math.abs(v1.y-v2.y) < eps )
}
// ------------------------------------------------------------------------ 
// Returns true if almost equal
export function fuzzyEqualVec3( v1, v2, eps=1e-6 )
{
    return ( Math.abs(v1.x-v2.x) < eps &&
             Math.abs(v1.y-v2.y) < eps &&
             Math.abs(v1.z-v2.z) < eps )
}
// ------------------------------------------------------------------------ 
export function cross( a, b ) 
{ 
    const ret = vec(0,0,0)
    ret.x = a.y * b.z - a.z * b.y
    ret.y = a.z * b.x - a.x * b.z
    ret.z = a.x * b.y - a.y * b.x 
    return ret
}
// ------------------------------------------------------------------------ 
export function dot(a, b) { 
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z)
}
// ------------------------------------------------------------------------ 
export function length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
}
// ------------------------------------------------------------------------ 
export function normalize(v) 
{
    const ret = vec(0,0,0)

    const l = length(v) 
    if( l < 0.00001 ) 
    throw Error('Zero length!')

    ret.x = v.x / l
    ret.y = v.y / l
    ret.z = v.z / l

    return ret
}
// ------------------------------------------------------------------------ 
export function scaleVector(v, s ) 
{
    const ret = vec(0,0,0)
    ret.x = v.x * s
    ret.y = v.y * s
    ret.z = v.z * s
    return ret
}
// ------------------------------------------------------------------------ 
export function subtractVectors(a, b) 
{
    const ret = vec(0,0,0)
    ret.x = a.x - b.x
    ret.y = a.y - b.y
    ret.z = a.z - b.z
    return ret
}
// ------------------------------------------------------------------------ 
export function addVectors(a, b) 
{
    const ret = vec(0,0,0)
    ret.x = a.x + b.x
    ret.y = a.y + b.y
    ret.z = a.z + b.z
    return ret
}
// ------------------------------------------------------------------------  
export function applyMatrix3( vec, mtx ) 
{  
    const x = vec.x, y = vec.y, z = vec.z;
    const e = mtx.m;

    vec.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
    vec.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
    vec.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

    return vec; 
}
// ------------------------------------------------------------------------  
export function applyMatrix4( vec, mtx ) 
{ 
    const x = vec.x, y = vec.y, z = vec.z;
    const e = mtx.m;

    const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

    vec.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
    vec.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
    vec.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

    return vec; 
}
// ------------------------------------------------------------------------  
// MATRIX 4x4 
// ------------------------------------------------------------------------ 
export class Matrix4
{
    m // Float32Array(16)
 
// ------------------------------------------------------------------------ 
constructor()
{
    this.m = new Float32Array(16)
    this.identity()
}
// ------------------------------------------------------------------------ 
clone()
{
    const a = new Matrix4()
    a.copy( this )
    return a
}
// ------------------------------------------------------------------------ 
copy( b ){
    this.m[ 0] = b.m[ 0] 
    this.m[ 1] = b.m[ 1] 
    this.m[ 2] = b.m[ 2] 
    this.m[ 3] = b.m[ 3] 
    this.m[ 4] = b.m[ 4] 
    this.m[ 5] = b.m[ 5] 
    this.m[ 6] = b.m[ 6] 
    this.m[ 7] = b.m[ 7] 
    this.m[ 8] = b.m[ 8] 
    this.m[ 9] = b.m[ 9] 
    this.m[10] = b.m[10] 
    this.m[11] = b.m[11] 
    this.m[12] = b.m[12] 
    this.m[13] = b.m[13] 
    this.m[15] = b.m[14] 
    this.m[15] = b.m[15] 
}
// ------------------------------------------------------------------------ 
identity()
{ 
    this.m[ 0] = 1
    this.m[ 1] = 0
    this.m[ 2] = 0
    this.m[ 3] = 0
    this.m[ 4] = 0
    this.m[ 5] = 1
    this.m[ 6] = 0
    this.m[ 7] = 0
    this.m[ 8] = 0
    this.m[ 9] = 0
    this.m[10] = 1
    this.m[11] = 0
    this.m[12] = 0
    this.m[13] = 0
    this.m[14] = 0
    this.m[15] = 1 
}
// ------------------------------------------------------------------------ 
ortho( left, right, bottom, top, near, far )
{ 
    this.m[ 0] = 2.0 / (right - left)
    this.m[ 1] = 0.0
    this.m[ 2] = 0.0
    this.m[ 3] = 0.0
    this.m[ 4] = 0.0
    this.m[ 5] = 2.0 / (top - bottom)
    this.m[ 6] = 0.0
    this.m[ 7] = 0.0
    this.m[ 8] = 0.0
    this.m[ 9] = 0.0
    this.m[10] = 2.0 / (near - far)
    this.m[11] = 0.0
    this.m[12] = (left + right) / (left - right)
    this.m[13] = (bottom + top) / (bottom - top)
    this.m[14] = (near + far) / (near - far)
    this.m[15] = 1.0 
} 
// ------------------------------------------------------------------------ 
perspective( fovRad, aspect, near, far) 
{ 
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad)
    const rangeInv = 1.0 / (near - far)

    this.m[ 0] = f / aspect
    this.m[ 1] = 0.0
    this.m[ 2] = 0.0
    this.m[ 3] = 0.0
    this.m[ 4] = 0.0
    this.m[ 5] = f
    this.m[ 6] = 0.0
    this.m[ 7] = 0.0
    this.m[ 8] = 0.0
    this.m[ 9] = 0.0
    this.m[10] = (near + far) * rangeInv
    this.m[11] = -1.0
    this.m[12] = 0.0
    this.m[13] = 0.0
    this.m[14] = near * far * rangeInv * 2.0
    this.m[15] = 0.0 
}
// ------------------------------------------------------------------------ 
// INVERT! for camera.viewMtx
// camPos {x,y,z}
// target {x,y,z}
// up {x,y,z}
lookAt( camPos, target, up ) 
{ 
    const zAxis = normalize( subtractVectors(camPos, target) ) 
    const xAxis = normalize( cross(up, zAxis) ) 
    const yAxis = normalize( cross(zAxis, xAxis) )

    this.m[ 0] = xAxis.x
    this.m[ 1] = xAxis.y
    this.m[ 2] = xAxis.z
    this.m[ 3] = 0.0
    this.m[ 4] = yAxis.x
    this.m[ 5] = yAxis.y
    this.m[ 6] = yAxis.z
    this.m[ 7] = 0.0
    this.m[ 8] = zAxis.x
    this.m[ 9] = zAxis.y
    this.m[10] = zAxis.z
    this.m[11] = 0.0
    this.m[12] = camPos[0]
    this.m[13] = camPos[1]
    this.m[14] = camPos[2]
    this.m[15] = 1.0 
}
// ------------------------------------------------------------------------ 
// a and b may be this
multiply( a, b ) 
{ 
    const b00 = b.m[0 * 4 + 0]
    const b01 = b.m[0 * 4 + 1]
    const b02 = b.m[0 * 4 + 2]
    const b03 = b.m[0 * 4 + 3]
    const b10 = b.m[1 * 4 + 0]
    const b11 = b.m[1 * 4 + 1]
    const b12 = b.m[1 * 4 + 2]
    const b13 = b.m[1 * 4 + 3]
    const b20 = b.m[2 * 4 + 0]
    const b21 = b.m[2 * 4 + 1]
    const b22 = b.m[2 * 4 + 2]
    const b23 = b.m[2 * 4 + 3]
    const b30 = b.m[3 * 4 + 0]
    const b31 = b.m[3 * 4 + 1]
    const b32 = b.m[3 * 4 + 2]
    const b33 = b.m[3 * 4 + 3]
    const a00 = a.m[0 * 4 + 0]
    const a01 = a.m[0 * 4 + 1]
    const a02 = a.m[0 * 4 + 2]
    const a03 = a.m[0 * 4 + 3]
    const a10 = a.m[1 * 4 + 0]
    const a11 = a.m[1 * 4 + 1]
    const a12 = a.m[1 * 4 + 2]
    const a13 = a.m[1 * 4 + 3]
    const a20 = a.m[2 * 4 + 0]
    const a21 = a.m[2 * 4 + 1]
    const a22 = a.m[2 * 4 + 2]
    const a23 = a.m[2 * 4 + 3]
    const a30 = a.m[3 * 4 + 0]
    const a31 = a.m[3 * 4 + 1]
    const a32 = a.m[3 * 4 + 2]
    const a33 = a.m[3 * 4 + 3]

    this.m[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
    this.m[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
    this.m[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
    this.m[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
    this.m[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
    this.m[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
    this.m[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
    this.m[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
    this.m[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
    this.m[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
    this.m[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
    this.m[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
    this.m[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
    this.m[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
    this.m[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
    this.m[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33 
} 
// ------------------------------------------------------------------------ 
makeTranslation(tx, ty, tz) 
{ 
    this.m[ 0] = 1
    this.m[ 1] = 0
    this.m[ 2] = 0
    this.m[ 3] = 0
    this.m[ 4] = 0
    this.m[ 5] = 1
    this.m[ 6] = 0
    this.m[ 7] = 0
    this.m[ 8] = 0
    this.m[ 9] = 0
    this.m[10] = 1
    this.m[11] = 0
    this.m[12] = tx
    this.m[13] = ty
    this.m[14] = tz
    this.m[15] = 1 
} 
// ------------------------------------------------------------------------ 
makeRotateX( angleRad ) 
{ 
    const c = Math.cos(angleRad)
    const s = Math.sin(angleRad)

    this.m[ 0] = 1
    this.m[ 1] = 0
    this.m[ 2] = 0
    this.m[ 3] = 0
    this.m[ 4] = 0
    this.m[ 5] = c
    this.m[ 6] = s
    this.m[ 7] = 0
    this.m[ 8] = 0
    this.m[ 9] = -s
    this.m[10] = c
    this.m[11] = 0
    this.m[12] = 0
    this.m[13] = 0
    this.m[14] = 0
    this.m[15] = 1 
}
// ------------------------------------------------------------------------ 
makeRotateY( angleRad ) 
{ 
    const c = Math.cos(angleRad)
    const s = Math.sin(angleRad)

    this.m[ 0] = c
    this.m[ 1] = 0
    this.m[ 2] = -s
    this.m[ 3] = 0
    this.m[ 4] = 0
    this.m[ 5] = 1
    this.m[ 6] = 0
    this.m[ 7] = 0
    this.m[ 8] = s
    this.m[ 9] = 0
    this.m[10] = c
    this.m[11] = 0
    this.m[12] = 0
    this.m[13] = 0
    this.m[14] = 0
    this.m[15] = 1 
}
// ------------------------------------------------------------------------ 
makeRotateZ( angleRad ) 
{ 
    const c = Math.cos(angleRad)
    const s = Math.sin(angleRad)

    this.m[ 0] = c
    this.m[ 1] = s
    this.m[ 2] = 0
    this.m[ 3] = 0
    this.m[ 4] = -s
    this.m[ 5] = c
    this.m[ 6] = 0
    this.m[ 7] = 0
    this.m[ 8] = 0
    this.m[ 9] = 0
    this.m[10] = 1
    this.m[11] = 0
    this.m[12] = 0
    this.m[13] = 0
    this.m[14] = 0
    this.m[15] = 1 
}
// ------------------------------------------------------------------------ 
makeScale(sx, sy=undefined, sz=undefined) 
{ 
    if(sy==undefined) sy=sx
    if(sz==undefined) sz=sx
    
    this.m[ 0] = sx
    this.m[ 1] = 0
    this.m[ 2] = 0
    this.m[ 3] = 0
    this.m[ 4] = 0
    this.m[ 5] = sy
    this.m[ 6] = 0
    this.m[ 7] = 0
    this.m[ 8] = 0
    this.m[ 9] = 0
    this.m[10] = sz
    this.m[11] = 0
    this.m[12] = 0
    this.m[13] = 0
    this.m[14] = 0
    this.m[15] = 1 
} 
// ------------------------------------------------------------------------ 
invert() 
{ 
    const m00 = this.m[0 * 4 + 0]
    const m01 = this.m[0 * 4 + 1]
    const m02 = this.m[0 * 4 + 2]
    const m03 = this.m[0 * 4 + 3]
    const m10 = this.m[1 * 4 + 0]
    const m11 = this.m[1 * 4 + 1]
    const m12 = this.m[1 * 4 + 2]
    const m13 = this.m[1 * 4 + 3]
    const m20 = this.m[2 * 4 + 0]
    const m21 = this.m[2 * 4 + 1]
    const m22 = this.m[2 * 4 + 2]
    const m23 = this.m[2 * 4 + 3]
    const m30 = this.m[3 * 4 + 0]
    const m31 = this.m[3 * 4 + 1]
    const m32 = this.m[3 * 4 + 2]
    const m33 = this.m[3 * 4 + 3]

    const tmp_0  = m22 * m33
    const tmp_1  = m32 * m23
    const tmp_2  = m12 * m33
    const tmp_3  = m32 * m13
    const tmp_4  = m12 * m23
    const tmp_5  = m22 * m13
    const tmp_6  = m02 * m33
    const tmp_7  = m32 * m03
    const tmp_8  = m02 * m23
    const tmp_9  = m22 * m03
    const tmp_10 = m02 * m13
    const tmp_11 = m12 * m03
    const tmp_12 = m20 * m31
    const tmp_13 = m30 * m21
    const tmp_14 = m10 * m31
    const tmp_15 = m30 * m11
    const tmp_16 = m10 * m21
    const tmp_17 = m20 * m11
    const tmp_18 = m00 * m31
    const tmp_19 = m30 * m01
    const tmp_20 = m00 * m21
    const tmp_21 = m20 * m01
    const tmp_22 = m00 * m11
    const tmp_23 = m10 * m01

    const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
    const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
    const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
    const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

    this.m[0] = d * t0
    this.m[1] = d * t1
    this.m[2] = d * t2
    this.m[3] = d * t3
    this.m[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30))
    this.m[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30))
    this.m[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30))
    this.m[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20))
    this.m[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33))
    this.m[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33))
    this.m[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33))
    this.m[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23))
    this.m[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22))
    this.m[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02))
    this.m[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12))
    this.m[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
}
// ------------------------------------------------------------------------ 
}

export const identityMtx = (new Matrix4()).m;