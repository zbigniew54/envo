import * as CFG from '../cfg.js'
import { Texture }  from './texture.js'
// ------------------------------------------------------------------------ 
// SHADER - vertex/fragment program
// ------------------------------------------------------------------------ 
export class Shader
{
    progId
    uniforms=[]   // [array] of  { name: u.name, type: u.type, loc: loc, valArr }
    uniMap        // [Map] name => { type: u.type, loc: loc, valArr } 

// ------------------------------------------------------------------------ 
constructor()
{
    this.uniMap = new Map()
}
// ------------------------------------------------------------------------ 
dispose( gl )
{ 
    if( this.progId ){
        gl.deleteProgram( this.progId )
        this.progId=undefined
    }

    this.uniforms=[]
    this.uniMap.clear()
}
// ------------------------------------------------------------------------ 
createShader( gl, type, sourceStr ) 
{
    const shader = gl.createShader(type)
    if( !shader ){
        if( CFG.DEBUG_MODE )
            console.error( "could not create shader="+type ) 
        return undefined
    }
    gl.shaderSource(shader, sourceStr)
    gl.compileShader( shader )

    if( gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) 
        return shader 
    else{
        if( CFG.DEBUG_MODE ){
            console.error( gl.getShaderInfoLog(shader) )
            console.warn( sourceStr )
        }
        gl.deleteShader(shader)
    }
    return undefined
}
// ------------------------------------------------------------------------ 
// shaderObj = { vpSrc: glslCode, fpSrc: glslCode, uniforms: [{ name: (str), type: 2f/3f/4f, valArr: (array [2-4] of val) },..] }
createProgram( gl, shaderObj ) 
{ 
    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, shaderObj.vpSrc )
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, shaderObj.fpSrc )

    if( !vertexShader || !fragmentShader )
        return undefined

    this.progId = gl.createProgram()
    gl.attachShader( this.progId, vertexShader )
    gl.attachShader( this.progId, fragmentShader )

    gl.linkProgram( this.progId )
 
    if( !gl.getProgramParameter( this.progId, gl.LINK_STATUS ) ) 
    { 
        if( CFG.DEBUG_MODE )
            console.error( gl.getProgramInfoLog(this.progId) ) 
        gl.deleteProgram(this.progId)
        this.progId=undefined
        return false
    } 
    
    gl.useProgram( this.progId )
    
    // uniforms
    for( const u of shaderObj.uniforms )
    {
        // loc is null if uniform is not in the shader or is not used in calculation
        const loc = gl.getUniformLocation( this.progId, u.name ) 
        if( !loc ){
            // console.log('Skipping unused uniform: '+u.name) 
        }else
        {
            // console.log( 'creted uniform loction for ['+u.name+'] ') 
            const new_u = { name: ''+u.name, type: ''+u.type, loc: loc, valArr: u.valArr }
            this.uniforms.push( new_u ) 
            this.uniMap.set( u.name, new_u )
        }
    }
    // console.log( this.uniforms ) 
   
    return true
} 
// ------------------------------------------------------------------------ 
// Sets uniform value
// requires call: loadAllUniforms i instantLoad=false
setUniform( gl, name, valArr, instantLoad=false )
{
    const u = this.uniMap.get( name )
    if( !u ){
        if( CFG.DEBUG_MODE )
            console.warn('No such uniform in this shader: '+name+' (or is unused)' )
        return null
    }
    
    if( typeof valArr != typeof u.valArr || 
        valArr.length != u.valArr.length )
        throw Error("Incorrect valArr: "+valArr.length+' exepected: '+u.type )

    u.valArr = valArr

    if( instantLoad )
        this.loadUniform( gl, u )
    
    return u
}
// ------------------------------------------------------------------------ 
// Sets and loads to WEBGL. Use when it changes every frame
// setLoadUniform( gl, name, valArr )
// {
//     const u = this.setUniform( name, valArr )
//     if( u ) 
//         this.loadUniform( gl, u )
// }
// ------------------------------------------------------------------------ 
// uniformTexName: [str] ie uBaseTex
// requires call: loadAllUniforms i instantLoad=false
// tex [Texture]
bindTex( gl, uniformTexName, tex, instantLoad=false )
{ 
    const u = this.uniMap.get( uniformTexName ) 
    if( !u ){
        if( CFG.DEBUG_MODE )
            console.error('No such tex in this shader: '+uniformTexName+' (or is unused)' )
        return 
    } 

    const tu = parseInt( u.valArr[0], 10 ) 
    gl.activeTexture( gl.TEXTURE0 + tu ) 

    if( tex )
        tex.use( gl )  
    else
        Texture.unbind( gl )
    
    if( instantLoad )
        gl.uniform1i( u.loc, u.valArr[0] )
}
// ------------------------------------------------------------------------ 
getAttribLoc( gl, attribName )
{
    return gl.getAttribLocation( this.progId, attribName ) 
}
// ------------------------------------------------------------------------ 
use( gl )
{
    gl.useProgram( this.progId )
}
// ------------------------------------------------------------------------ 
unbind( gl )
{
    gl.useProgram( null )
}
// ------------------------------------------------------------------------ 
loadUniform( gl, u )
{  
    // console.log('loadUniform')
    // console.log(u)
    
    if( CFG.DEBUG_MODE )
    {
        const cp = gl.getParameter( gl.CURRENT_PROGRAM )
        if( cp != this.progId )
            console.error('Not cur prog bound: ['+cp+']')
    }
 
    if( u.type == '2f')
        gl.uniform2f( u.loc, u.valArr[0], u.valArr[1] ) 
    else
    if( u.type == '3f')
        gl.uniform3f( u.loc, u.valArr[0], u.valArr[1], u.valArr[2] ) 
    else
    if( u.type == '4f')
        gl.uniform4f( u.loc, u.valArr[0], u.valArr[1], u.valArr[2], u.valArr[3] )
    else
    if( u.type == 'mat4') 
        gl.uniformMatrix4fv( u.loc, false, u.valArr ) 
    else
    if( u.type == 'tex')  
        gl.uniform1i( u.loc, u.valArr[0] ) // ie. gl.uniform1i(u_image0Location, 0)  // TEXTURE0
}
// ------------------------------------------------------------------------ 
// call before render
loadAllUniforms( gl )
{
    // console.error('loadAllUniforms')
    
    for( const u of this.uniforms )
        this.loadUniform( gl, u )
} 
// ------------------------------------------------------------------------ 
extractUniforms( gl )
{
    const uniforms = []

    const totalUniforms = gl.getProgramParameter( this.progId, gl.ACTIVE_UNIFORMS )

    for( let i = 0; i < totalUniforms; i++ )
    {
        const data = gl.getActiveUniform( this.progId, i)

        data.loction = gl.getUniformLocation( this.progId, data.name ) 

        uniforms.push( data ) 
    }

    return uniforms
}
// ------------------------------------------------------------------------ 
extractAttributes( gl )
{
    const attributes = []

    const totalAttributes = gl.getProgramParameter( this.progId, gl.ACTIVE_ATTRIBUTES)

    for( let i = 0; i < totalAttributes; i++ )
    {
        const attribData = gl.getActiveAttrib(this.progId, i)

        data.loction = gl.getAttribLocation( this.progId, data.name ) 

        attributes.push( attribData ) 
    }

    return attributes
}
// ------------------------------------------------------------------------ 
}