import { Texture }  from './texture.js' 
// ------------------------------------------------------------------------ 
// RENDER TARGET - texture you can render to
//  ! no depth buffer
//  ! no mipmaps
// ------------------------------------------------------------------------ 
export class RenderTarget extends Texture
{
    width
    height
    fb               // Framebuffer
 
// ------------------------------------------------------------------------ 
// internalFormat is always RGBA
// hdr - use FLOAT
create( gl, width, height, hdr=false )
{
    this.texId = gl.createTexture()
    gl.bindTexture( gl.TEXTURE_2D, this.texId )

    // console.log("target texture="+ this.texId)

    this.width = width
    this.height = height
 
    const internalFormat = hdr? gl.RGBA16F: gl.RGBA 
    const format = gl.RGBA
    const type = hdr? gl.FLOAT : gl.UNSIGNED_BYTE 

    gl.texImage2D( 
        gl.TEXTURE_2D, 0, 
        internalFormat,
        width, height, 0,
        format, type, null )
 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  
    // Create and bind the framebuffer
    this.fb = gl.createFramebuffer()
    gl.bindFramebuffer( gl.FRAMEBUFFER, this.fb )
         
    gl.framebufferTexture2D( 
        gl.FRAMEBUFFER, 
        gl.COLOR_ATTACHMENT0, 
        gl.TEXTURE_2D, 
        this.texId, 
        0 )

    const status = gl.checkFramebufferStatus( gl.FRAMEBUFFER )
    if( status !== gl.FRAMEBUFFER_COMPLETE )
    {
        console.error("FB error")
        switch(status){
            case gl.FRAMEBUFFER_UNSUPPORTED:
              throw new Error('gl-fbo: Framebuffer unsupported')
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
              throw new Error('gl-fbo: Framebuffer incomplete attachment')
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
              throw new Error('gl-fbo: Framebuffer incomplete dimensions')
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
              throw new Error('gl-fbo: Framebuffer incomplete missing attachment')
            default:
              throw new Error('gl-fbo: Framebuffer failed for unspecified reason')
          }
    }
    gl.bindFramebuffer( gl.FRAMEBUFFER, null )
}
// ------------------------------------------------------------------------ 
renderBegin( gl, clearColor=[0.0, 0.0, 0.0, 0.0] )
{
    if( !this.fb )
        throw Error("No FB!")

    // render to our targetTexture by binding the framebuffer
    gl.bindFramebuffer( gl.FRAMEBUFFER, this.fb )
    
       // Tell WebGL how to convert from clip space to pixels
    gl.viewport( 0, 0, this.width, this.height )  

    gl.clearColor( ...clearColor )   
    gl.clear( gl.COLOR_BUFFER_BIT )
}
// ------------------------------------------------------------------------ 
// ! rember to restore viewport by calling gl.viewport()
renderEnd( gl, restoreViewportCallback )
{
    // render to the canvas
    gl.bindFramebuffer( gl.FRAMEBUFFER, null ) 

    // Tell WebGL how to convert from clip space to pixels
    restoreViewportCallback()
}
// ------------------------------------------------------------------------ 
dispose(gl)
{
    super.dispose(gl)
    gl.deleteFramebuffer(this.fb)
    this.fb=undefined
    this.width=undefined
    this.height=undefined
}
// ------------------------------------------------------------------------ 
// useful for lazy-init
// returns true if creted new RT (it means previous content of RT is invlid)
prepare( gl, width, height, forceRecreate=false, hdr=false )
{ 
    if( forceRecreate || 
        this.width != width || 
        this.height != height )
    {
        if( this.fb )
            this.dispose( gl )

        this.create( gl, width, height, hdr )
        return true
    }

    return false
}  
// ------------------------------------------------------------------------ 
// Read pixels from framebuffer
// pixels- Uint8Array
readPixels( gl, pixels, w, h, format = gl.RGBA, type = gl.UNSIGNED_BYTE  )
{
    gl.bindFramebuffer( gl.FRAMEBUFFER, this.fb )
    gl.readPixels( 0, 0, w, h, format, type, pixels )
    gl.bindFramebuffer( gl.FRAMEBUFFER, null ) 
}
// ------------------------------------------------------------------------ 
}