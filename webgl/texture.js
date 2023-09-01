// ------------------------------------------------------------------------ 
// TEXTURE 
// ------------------------------------------------------------------------ 
export class Texture 
{
    texId

// ------------------------------------------------------------------------ 
// pixels - TypedArray (ie Uint8Array, Uint16Array, ...) or 
// ImageData, HTMLImageElement, HTMLCanvasElement 
// if pixels are not TypedArray -> internal format always is gl.RGBA

// internalFormat - requested internal format in GPU
// gl.RGB, gl.RGBA, gl.RGB16F, gl.RGBA16F, gl.RGB32F, gl.RGBA32F 
// for *16F/*32F pixel data must be in float32 -> webGL cant convert RGB16 to RGB16F/32F, see:
// https://registry.khronos.org/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE

create( gl, pixels, width, height, internalFormat = gl.RGBA )
{
    this.texId = gl.createTexture()
    gl.bindTexture( gl.TEXTURE_2D, this.texId )

    // type gl.FLOAT / gl.UNSIGNED_SHORT / gl.UNSIGNED_BYTE
    let type = gl.UNSIGNED_BYTE
    let pixelsFormat

    // pixelsFormat = gl.RGB
    if( typeof pixels == ImageData ||
        typeof pixels == HTMLImageElement ||
        typeof pixels == HTMLCanvasElement )
    {
        pixelsFormat = gl.RGBA
        internalFormat = gl.RGBA  
    }
    else

    // WEB GL 2
    if( gl.isWebGL2 )
    {
        // RGB FLOAT
        if( internalFormat == gl.RGB16F || internalFormat == gl.RGB32F ){
            pixelsFormat = gl.RGB 
            type = gl.FLOAT  
        }
        else
        // RGBA FLOAT
        if( internalFormat == gl.RGBA16F || internalFormat == gl.RGBA32F ){
            pixelsFormat = gl.RGBA 
            type = gl.FLOAT  
        }
        else
            pixelsFormat = internalFormat
    }
    else
        pixelsFormat = internalFormat 
 
    gl.texImage2D( gl.TEXTURE_2D, 0, internalFormat, width, height, 0, pixelsFormat, type, pixels )

    // half float ma linear, float32 nie ma chyba że ext
    let linear=true
    // if( type == gl.FLOAT && !gl.getExtension("OES_texture_float_linear") )
    //   linear=false

    // no mipmaps
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear? gl.LINEAR: gl.NEAREST )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear? gl.LINEAR: gl.NEAREST )
    // gl.generateMipmap( gl.TEXTURE_2D )
 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) 
} 
// ------------------------------------------------------------------------ 
use(gl)
{
    if( !this.texId )
        throw Error("Invalid tex" )

    gl.bindTexture( gl.TEXTURE_2D, this.texId )
}
// ------------------------------------------------------------------------ 
static unbind( gl )
{ 
    gl.bindTexture( gl.TEXTURE_2D, null )
}
// ------------------------------------------------------------------------ 
dispose(gl)
{
    gl.deleteTexture(this.texId)
    this.texId=undefined
}
// ------------------------------------------------------------------------ 
}  