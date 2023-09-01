// ------------------------------------------------------------------------ 
export class Mesh
{
    // mtx           // [Matrix4] 
    bufferPos
    bufferTexCoords
    bufferIndices
    numVert=0
    numTris=0
    indexed=false

// ------------------------------------------------------------------------ 
constructor()
{
    // this.mtx = new m3d.Matrix4()
} 
// ------------------------------------------------------------------------ 
// each triangle has 3 verts (3 floats)
// verticesArr - Float32Array
// texCoordsArr - Float32Array
// updateMode - if false force recreate buffers (STATIC_DRAW) else try reuse buffers (DYNAMIC_DRAW)
initArrays( gl, verticesArr, texCoordsArr=null, updateMode=false )
{  
    if( !(verticesArr instanceof Float32Array) ) 
        throw Error("verticesArr not instanceof Float32Array")
    if( texCoordsArr && !(texCoordsArr instanceof Float32Array) ) 
        throw Error("texCoordsArr not instanceof Float32Array")

    if( verticesArr.length %9 != 0 )
        throw Error("Incorrect number of verts")

    this.indexed=false
    const drawMode = updateMode ?gl.DYNAMIC_DRAW :gl.STATIC_DRAW

    if( !updateMode || 
        this.numVert != verticesArr.length/3 )
    {
        updateMode=false

        if( this.numVert != 0 ) 
            this.dispose( gl )

        this.numVert = verticesArr.length/3
        this.numTris =  this.numVert/3

        // console.log("mesh init buffers")
    }
    // else
    //     console.log("mesh reuse buffers")
 
    // POSITIONS
    if( !updateMode || !this.bufferPos )
        this.bufferPos = gl.createBuffer() 
 
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferPos) 
    gl.bufferData( gl.ARRAY_BUFFER, verticesArr, drawMode )

    // TEX COORDS
    if( texCoordsArr )
    { 
        if( !updateMode || !this.bufferTexCoords )
            this.bufferTexCoords = gl.createBuffer()
      
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferTexCoords) 
        gl.bufferData( gl.ARRAY_BUFFER, texCoordsArr, drawMode ) 
    }
    
    gl.bindBuffer( gl.ARRAY_BUFFER, null ) 
}
// ------------------------------------------------------------------------ 
initIndices( gl, trisArr, verticesArr, texCoordsArr=null, updateMode=false )
{
    if( !(trisArr instanceof Uint32Array) ) 
        throw Error("trisArr not instanceof Uint32Array")
    if( !(verticesArr instanceof Float32Array) ) 
        throw Error("verticesArr not instanceof Float32Array")
    if( texCoordsArr && !(texCoordsArr instanceof Float32Array) ) 
        throw Error("texCoordsArr not instanceof Float32Array")

    // one vert = 3 floats
    if( verticesArr.length %3 != 0 )
        throw Error("Incorrect number of verts")
    // one tri = 3 indices for each vert
    if( trisArr.length %3 != 0 )
        throw Error("Incorrect number of tris")

    this.indexed=true 
    const drawMode = updateMode ?gl.DYNAMIC_DRAW :gl.STATIC_DRAW

    if( !updateMode || 
        this.numVert != verticesArr.length/3 )
    {
        updateMode=false

        if( this.numVert != 0 ) 
            this.dispose( gl )

        this.numVert = verticesArr.length/3
        this.numTris = trisArr.length/3

        // console.log("mesh init buffers")
    }
    // else
    //     console.log("mesh reuse buffers")
 
    if( !updateMode || !this.bufferIndices )
        this.bufferIndices = gl.createBuffer() 
 
    // bufferIndices
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices ) 
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, trisArr, drawMode )
    
    if( !updateMode || !this.bufferPos )
        this.bufferPos = gl.createBuffer() 

    // bufferPos
    gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferPos) 
    gl.bufferData( gl.ARRAY_BUFFER, verticesArr, drawMode )

    // bufferTexCoords
    if( texCoordsArr )
    { 
        if( !updateMode || !this.bufferTexCoords )
            this.bufferTexCoords = gl.createBuffer() 

        gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferTexCoords) 
        gl.bufferData( gl.ARRAY_BUFFER, texCoordsArr, drawMode )
    }
  
    gl.bindBuffer( gl.ARRAY_BUFFER, null ) 
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null ) 
}
// ------------------------------------------------------------------------ 
// min - {x,y,z} left, bottom 
// max - {x,y,z} top, right
initQuad( gl, min, max, z=0, updateMode=false )
{
    // throw Error('Jakis blad tu jest bo nie działa jak nalezy')
    
    if( this.numVert != 0 ) 
        this.dispose( gl )
 
    this.numVert=6
    this.numTris=2

    // CCW ma być

    const verts = [
        // -1,-1, 0,   // LD 
        min.x, min.y, z,
        //  1,-1, 0,   // PD
        max.x, min.y, z,
        // -1, 1, 0,   // LG
        min.x, max.y, z,

        //  1, 1, 0,   // PG
        max.x, max.y, z,
        // -1, 1, 0,   // LG
        min.x, max.y, z,
        //  1,-1, 0    // PD
        max.x, min.y, z,
    ] 
    const coords = [
         0, 0, 0,   // LD 
         1, 0, 0,   // PD
         0, 1, 0,   // LG

         1, 1, 0,   // PG
         0, 1, 0,   // LG
         1, 0, 0    // PD
    ] 
 
    this.initArrays( gl, 
        new Float32Array( verts ), 
        new Float32Array( coords ), 
        updateMode )
  
    // this.bufferPos = gl.createBuffer() 
    // this.bufferTexCoords = gl.createBuffer()  

    // if( !this.bufferPos || !this.bufferTexCoords )
    //     throw Error("No buffer!")

    // // bufferPos
    // gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferPos) 
    // gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( verts ), gl.STATIC_DRAW )

    // // bufferTexCoords
    // gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferTexCoords) 
    // gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( coords ), gl.STATIC_DRAW ) 

    // gl.bindBuffer( gl.ARRAY_BUFFER, null )     
}
// ------------------------------------------------------------------------ 
// init( gl, cfg ){
//     sizeW, sizeH, segW, segH, ofsX=0, ofsY=0, flipY=false
// }
// ------------------------------------------------------------------------ 
// Creates rect grid in XY plane. Coords are in [0:1] range
// sizeW - width of mesh
// sizeH - height of mesh 
// segW, segH - num segments 
// ofsX, ofsY - offset or positon of the center of mesh
// flipY - invert coords vertically
initGrid( gl, sizeW, sizeH, segW, segH, ofsX=0, ofsY=0, flipY=false, updateMode=false )
{ 
    // console.log( 'mesh.initGrid: ' ) 
    // console.log( sizeW, sizeH, segW, segH, ofsX , ofsY )
    // this.mtx.identity()

    if( this.numVert != 0 ) 
        this.dispose( gl )

    this.numVert = (segW+1)*(segH+1)
    this.numTris = segW*segH*2
    this.indexed=true 

    const verts = []    // numVert * 3 
    const coords = []   // numVert * 2 
    const tris = []     // numTris * 3 

    const segSizX = sizeW / segW
    const segSizY = sizeH / segH
 
    function getVerIdx( x, y ){
        return y * (segW+1) + x
    }

    for( let y=0; y <= segH; y++ )
        for( let x=0; x <= segW; x++ )
        { 
            // console.log( x*segSizX, y*segSizY )

            // pos relative to left bottom corner of image
            const posX = ofsX + x*segSizX 
            const posY = ofsY + y*segSizY 

            // add vertex (relative to mesh center)
            verts.push( 
                posX - sizeW/2.0, 
                posY - sizeH/2.0, 
                0.0 )
 
            const coordY = y/segH
            coords.push( x/segW, flipY? 1.0-coordY : coordY)

            if( x > 0 && y>0 )
            {
                // create tri1
                tris.push( 
                    getVerIdx( x-1, y-1 ),  // LD
                    getVerIdx( x  , y-1 ),  // PD
                    getVerIdx( x-1, y   ) ) // LG
                
                // create tri2
                tris.push( 
                    getVerIdx( x-1, y  ),   // LG
                    getVerIdx( x  , y-1 ),  // PD
                    getVerIdx( x  , y   ) ) // PG
            }
        }
  
    this.initIndices( gl, 
        new Uint32Array( tris ),
        new Float32Array( verts ), 
        new Float32Array( coords ), 
        updateMode ) 
}
// ------------------------------------------------------------------------ 
render( gl, shader )
{  
    // console.log( "mesh.render" )  

    if( !this.numVert ) {
        console.warn("no vert="+this.numVert)  
        return
    }
 
    // // Load model matrix
    // shader.setUniform( gl, 'uModelMatrix', this.mtx.m, true ) 
  
    // Load attributes
    const posLoc = shader.getAttribLoc( gl, 'aPosition' )
    if( posLoc < 0 )
        throw Error('no posLoc');

    // Turn on the position attribute
    gl.enableVertexAttribArray( posLoc ) 
    gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferPos )
    gl.vertexAttribPointer( posLoc, 3, gl.FLOAT, false, 0, 0 )
    
    // Turn on the position attribute
    if( this.bufferTexCoords ){
       const texCoordsLoc = shader.getAttribLoc( gl, 'aTexCoord' )
        gl.enableVertexAttribArray( texCoordsLoc ) 
        gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferTexCoords )
        gl.vertexAttribPointer( texCoordsLoc, 2, gl.FLOAT, false, 0, 0 )
    }
 
    // console.log( shader.extractUniforms( gl ))
    // console.log( shader.extractAttributes( gl )) 
 
    // Draw
    if( this.indexed )
    { 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices ) 
        gl.drawElements( gl.TRIANGLES, this.numTris*3, gl.UNSIGNED_INT, 0 )
    }
    else
        gl.drawArrays( gl.TRIANGLES, 0, this.numVert ) 
}
// ------------------------------------------------------------------------ 
dispose( gl )
{ 
    if( this.bufferPos ){
        gl.deleteBuffer( this.bufferPos )
        this.bufferPos=undefined
    }
    if( this.bufferTexCoords ){
        gl.deleteBuffer( this.bufferTexCoords )
        this.bufferTexCoords=undefined
    }
    if( this.bufferIndices ){
        gl.deleteBuffer( this.bufferIndices )
        this.bufferIndices=undefined
    }

    this.numVert=0
    this.numTris=0
}
// ------------------------------------------------------------------------ 
}

// ------------------------------------------------------------------------ 
export class LineMesh
{ 
    bufferPos
    bufferTexCoords 
    numVert=0       // each line segment has 2 verts
 
// ------------------------------------------------------------------------ 
// each line segment has 2 verts
// verticesArr - Float32Array (3 floats)
// texCoordsArr - Float32Array (opt)  (1 float)
// updateMode - if false force recreate buffers (STATIC_DRAW) else try reuse buffers (DYNAMIC_DRAW)
initArrays( gl, verticesArr, texCoordsArr=null, updateMode=false )
{ 
    if( !(verticesArr instanceof Float32Array) ) 
        throw Error("verticesArr not instanceof Float32Array")
    if( texCoordsArr && !(texCoordsArr instanceof Float32Array) ) 
        throw Error("texCoordsArr not instanceof Float32Array")

    // each line segment has 2 verts (3 floats)
    if( verticesArr.length %6 != 0 )
        throw Error("Incorrect number of verts: "+verticesArr.length)

    const drawMode = updateMode ?gl.DYNAMIC_DRAW :gl.STATIC_DRAW

    if( !updateMode || 
        this.numVert != verticesArr.length/3 )
    {
        updateMode=false
 
        if( this.numVert != 0 ) 
            this.dispose( gl )

        this.numVert = verticesArr.length /3
        
        // console.log("line init buffers verticesArr.length:", verticesArr.length )
    }
    // else
    //     console.log("line reuse buffers")
 
    // POSITIONS
    if( !updateMode || !this.bufferPos )
        this.bufferPos = gl.createBuffer() 
          
    gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferPos ) 
    gl.bufferData( gl.ARRAY_BUFFER, verticesArr, drawMode )

    // TEX COORDS
    if( texCoordsArr )
    { 
        if( !updateMode || !this.bufferTexCoords )
            this.bufferTexCoords = gl.createBuffer()
        
        gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferTexCoords ) 
        gl.bufferData( gl.ARRAY_BUFFER, texCoordsArr, drawMode ) 
    }
    
    gl.bindBuffer( gl.ARRAY_BUFFER, null )  
}  
// ------------------------------------------------------------------------ 
// Creates rectangular frame in XY plane (4 line segments) with 1d texCooord
// sizeW - width of frame
// sizeH - height of frame 
// ofsX, ofsY - offset or positon of the center of the frame 
// updateMode - if false force recreate buffers
initFrame( gl, sizeW, sizeH, ofsX=0, ofsY=0, ofsZ=0, updateMode=false )
{ 
    // console.log( 'LineMesh.initFrame: ' ) 
    // console.log( sizeW, sizeH, ofsX, ofsY ) 

    if( this.numVert != 0 ) 
        this.dispose( gl )
 
    const verts = []    // numVert * 3 
    const coords = []   // numVert * 2  
  
    // top segment
    verts.push( ofsX - sizeW/2.0, ofsY + sizeH/2.0, ofsZ )   // TL
    verts.push( ofsX + sizeW/2.0, ofsY + sizeH/2.0, ofsZ )   // TR 
    coords.push( 0.00 )   // TL
    coords.push( 0.25 )   // TR
 
    // right segment
    verts.push( ofsX + sizeW/2.0, ofsY + sizeH/2.0, ofsZ )   // TR 
    verts.push( ofsX + sizeW/2.0, ofsY - sizeH/2.0, ofsZ )   // BR
    coords.push( 0.25 )   // TR
    coords.push( 0.50 )   // BR

    // bottom segment
    verts.push( ofsX + sizeW/2.0, ofsY - sizeH/2.0, ofsZ )   // BR
    verts.push( ofsX - sizeW/2.0, ofsY - sizeH/2.0, ofsZ )   // BL 
    coords.push( 0.50 )   // BR
    coords.push( 0.75 )   // BL

    // left segment
    verts.push( ofsX - sizeW/2.0, ofsY - sizeH/2.0, ofsZ )   // BL
    verts.push( ofsX - sizeW/2.0, ofsY + sizeH/2.0, ofsZ )   // TL 
    coords.push( 0.75 )   // BL
    coords.push( 1.00 )   // TL

    this.numVert = verts.length // each line segment has 2 verts

    this.initArrays( gl, 
        new Float32Array( verts ), 
        new Float32Array( coords ), 
        updateMode )
  
    // this.bufferPos = gl.createBuffer() 
    // this.bufferTexCoords = gl.createBuffer()  

    // if( !this.bufferPos || !this.bufferTexCoords  )
    //     throw Error("No buffer!")

    // // bufferPos
    // gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferPos) 
    // gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( verts ), gl.STATIC_DRAW )

    // // bufferTexCoords
    // gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferTexCoords) 
    // gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( coords ), gl.STATIC_DRAW )
   
    // gl.bindBuffer( gl.ARRAY_BUFFER, null )  
}
// ------------------------------------------------------------------------ 
render( gl, shader )
{  
    // console.log( "LineMesh.render" )  

    if( !this.numVert ) {
        console.warn("no vert="+this.numVert)  
        return
    }
  
    // Load attributes
    const posLoc = shader.getAttribLoc( gl, 'aPosition' )
    if( posLoc < 0 )
        throw Error('no posLoc');

    // Turn on the position attribute
    gl.enableVertexAttribArray( posLoc ) 
    gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferPos )
    gl.vertexAttribPointer( posLoc, 3, gl.FLOAT, false, 0, 0 )
    
    // Turn on the position attribute
    if( this.bufferTexCoords ){
        const texCoordsLoc = shader.getAttribLoc( gl, 'aTexCoord' )
        gl.enableVertexAttribArray( texCoordsLoc ) 
        gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferTexCoords )
        gl.vertexAttribPointer( texCoordsLoc, 1, gl.FLOAT, false, 0, 0 )
    }
  
    // console.log( 'drawArrays='+this.numVert ) 
    gl.drawArrays( gl.LINES, 0, this.numVert ) 
}
// ------------------------------------------------------------------------ 
dispose( gl )
{ 
    if( this.bufferPos ){
        gl.deleteBuffer( this.bufferPos )
        this.bufferPos=undefined
    }
    if( this.bufferTexCoords ){
        gl.deleteBuffer( this.bufferTexCoords )
        this.bufferTexCoords=undefined
    } 

    this.numVert=0 
}
// ------------------------------------------------------------------------ 
}