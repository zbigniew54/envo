import { Component, createRef } from "react"
/* ------------------------------------------------------------------------ 
  
    CANVAS WEBGL
        Creates React Canvas and WebGL Context (or WebGL2 if supported)
        Context is created on component mount (creation in DOM) and is destroyed on unmount
        Supports Lose/Restore context

    PROPS: 
        alpha (bool, def false): create alpha channel -> allows to blend with canvas background (ie <body>)
        depth (bool, def false): create depth buffer 
        stencil (bool, def false): create stencil buffer 
        antiAlias (bool, def false): does not work with post-processing
        powerPreference (str, ie "high-performance")
        preserveDrawingBuffer (bool, def false): false is faster but saveAs for canvas doesn't work
        matchDevicePixelRatio (bool, def false): if true uses devicePixelRation (better quality) but less flexible canvas resizing
        log (bool, def: false): print to console info about WebGL context
        premultipliedAlpha (bool, def true): true is useful when treating canvas as alpha blended image, false is more OpenGL like
    
        onContextCreated -> Load Scene -> onCtxCreated(gl)
        onContextDestroyed -> Unload Scene -> onCtxDestroyed()

/ ------------------------------------------------------------------------ */
export default class CanvasWebGL extends Component
{
    gl         // Web GL Context
    canvasRef  // React Ref

// ------------------------------------------------------------------------
constructor( props ) {
    super(props)
    this.canvasRef = createRef()
}
// ------------------------------------------------------------------------
render() 
{
    return ( <canvas ref={ this.canvasRef } ></canvas> ) 
}
// ------------------------------------------------------------------------
// called after render(), when component and is already placed in the DOM
componentDidMount() 
{  
    const logMe = this.props.log==true
    if( logMe )
        console.log( "WebGL Canvas Mount" )

    // INIT GL
    this._initGL()

    // Load Scene
    if( this.props.onContextCreated )
        this.props.onContextCreated( this.gl )
 
    this._onContextRestored = () => 
    {
        if( logMe )
            console.warn("WebGL Context Restored")
        this._initGL() 

        // Load Scene
        if( this.props.onContextCreated )
            this.props.onContextCreated( this.gl )
    }
    const ctxRestore = this._onContextRestored = this._onContextRestored.bind(this)
     
    this._onContextLost = (e) => 
    {
        if( logMe )
            console.warn("WebGL Context Lost")
        e.preventDefault()

        // Unload Scene
        if( this.props.onContextDestroyed ) 
            this.props.onContextDestroyed()

        this.gl = undefined 

        // Try restoring context manually after n sec (if it was not restored by browser)
        // (Sometimes browser loses context and dont restore it automatically)
        // You cant instantly restore context (browser will create fremebuffer with width=0 height=0)  
        setTimeout( ()=>{  if( !this.gl ) ctxRestore() }, 5000 )
    }  
    this._onContextLost = this._onContextLost.bind(this)

    const canvasDOM = this.canvasRef.current

    canvasDOM.addEventListener( "webglcontextlost", this._onContextLost ) 
    canvasDOM.addEventListener( "webglcontextrestored", this._onContextRestored ) 
}
// ------------------------------------------------------------------------
// called before component is removed from the DOM
componentWillUnmount() 
{  
    if( this.props.log==true )
        console.log( "WebGL Canvas Unmount" )

    // Unload Scene
    if( this.props.onContextDestroyed ) 
        this.props.onContextDestroyed()

    this.gl = undefined 
    const canvasDOM = this.canvasRef.current

    canvasDOM.removeEventListener( "webglcontextlost", this._onContextLost ) 
    canvasDOM.removeEventListener( "webglcontextrestored", this._onContextRestored ) 

    this._onContextLost = undefined
    this._onContextRestored = undefined
}  
// ------------------------------------------------------------------------
_initGL()
{ 
    if( this.gl )
        throw Error('WebGL already initialized!')
    
    const canvasDOM = this.canvasRef.current

    if( !canvasDOM )
        throw Error('No canvas!')
 
    // devicePixelRatio
    if( this.props.matchDevicePixelRatio===true )
    {
        const width = canvasDOM.clientWidth
        const height = canvasDOM.clientHeight
        const pixelRatio = window.devicePixelRatio
        
        canvasDOM.width = width * pixelRatio 
        canvasDOM.height = height * pixelRatio 
    
        canvasDOM.style.width = ''+parseInt(width,10)+'px'
        canvasDOM.style.height = ''+parseInt(height,10)+'px' 
    }
 
    const ctxOpts={
        antialias: this.props.antiAlias === true,     // def false
        alpha: this.props.alpha === true,             // def false  
        depth: this.props.depth === true,             // def false  
        stencil: this.props.stencil === true,         // def false  
        powerPreference: ("powerPref" in this.props)? this.props.powerPref: "high-performance",
        preserveDrawingBuffer: this.props.preserveDrawingBuffer === true,       // def false   
        premultipliedAlpha: this.props.premultipliedAlpha !== false,
    }
 
    this.gl = canvasDOM.getContext("webgl2", ctxOpts)
    if( this.gl ) 
        this.gl.isWebGL2=true
    else
    {
        console.warn("No WebGL2")
        
        this.gl = canvasDOM.getContext("webgl")
        if( !this.gl ) 
            throw Error("No WebGL")
    }

    const gl = this.gl
    
    if( this.props.log===true ){    // is defined and is true
        console.warn("WebGL contex created")

        // console.log( 'Viewport: '+gl.canvas.width+'x'+gl.canvas.height ) 
        // console.log( 'Max texture units: '+ gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) ) 
        // console.log( 'Max texture size: '+ gl.getParameter(gl.MAX_TEXTURE_SIZE)/1024+'k' )  
        // console.log( gl.getSupportedExtensions() )
    }

    return gl
}
// ------------------------------------------------------------------------
}
/*
    USAGE EXAMPLE:

    <CanvasWebGL 
        matchDevicePixelRatio={ true }
        premultipliedAlpha={ false }
        antiAlias={ true }
        powerPreference={ "high-performance" }
        onContextCreated={ (gl)=>
        {   
            scene.init( gl ) 
        }}
        onContextDestroyed={ ()=>
        { 
            //...
        }}
    />
*/