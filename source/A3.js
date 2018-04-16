"use strict";

var canvas;
var gl;
var points = [];
var numTimesToSubdivide = 6;
var tX = 0.0;
var tY = 0.0;
var tZ = 0.0;
var index = 0;
var thetaLoc;
var theta = 0;
var pointsArray = [];
var normalsArray = [];
var normals = [];
var translate = 0.4;
var near = -10;
var far = 10;
var radius = 1.5;

var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;
var I = 0
var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;
var v = [
    vec4(0.0, 0.0, -1.0,1),
    vec4(0.0, 0.942809, 0.333333, 1),
    vec4(-0.816497, -0.471405, 0.333333, 1),
    vec4(0.816497, -0.471405, 0.333333,1)
];

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;
var Theta = [0.0,0.0,0.0];
var Theta2 = [0.0,0.0,0.0];
var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var nMatrix, nMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
/*
  function rotateZ(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];
				
            m[0] = c*m[0]-s*m[1];
            m[4] = c*m[4]-s*m[5];
            m[8] = c*m[8]-s*m[9];

            m[1]=c*m[1]+s*mv0;
            m[5]=c*m[5]+s*mv4;
            m[9]=c*m[9]+s*mv8;
         }

         function rotateX(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv1 = m[1], mv5 = m[5], mv9 = m[9];
				
            m[1] = m[1]*c-m[2]*s;
            m[5] = m[5]*c-m[6]*s;
            m[9] = m[9]*c-m[10]*s;

            m[2] = m[2]*c+mv1*s;
            m[6] = m[6]*c+mv5*s;
            m[10] = m[10]*c+mv9*s;
         }

         function rotateY(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];
				
            m[0] = c*m[0]+s*m[2];
            m[4] = c*m[4]+s*m[6];
            m[8] = c*m[8]+s*m[10];

            m[2] = c*m[2]-s*mv0;
            m[6] = c*m[6]-s*mv4;
            m[10] = c*m[10]-s*mv8;
         }
*/
function colorCube()
{
    index += 36;
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
    
    var size = .5;
    var vertices = [
        vec4( -size, -size,  size, 1.0 ),
        vec4( -size,  size,  size, 1.0 ),
        vec4(  size,  size,  size, 1.0 ),
        vec4(  size, -size,  size, 1.0 ),
        vec4( -size, -size, -size, 1.0 ),
        vec4( -size,  size, -size, 1.0 ),
        vec4(  size,  size, -size, 1.0 ),
        vec4(  size, -size, -size, 1.0 )
    ];

    var vertexColors = [
      vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
      vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
      vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
      vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
      vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
      vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
      vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
      vec4( 1.0, 1.0, 1.0, 1.0 )   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, d, c ];

    for ( var i = 0; i < indices.length; ++i ) {
        pointsArray.push( vertices[indices[i]] );
        colors.push( vertexColors[indices[i]] );
        // for solid colored faces use
        //colors.push(vertexColors[a]);
    }

}

function triangle1(a, b, c) {

     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t2, t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     normals.push(normal);
     normals.push(normal);
     normals.push(normal);

     points.push(a);
     points.push(b);
     points.push(c);

     Index += 3;
}
function triangle(a, b, c) {

     var t1 = subtract(b, a);
     var t2 = subtract(c, a);
     var normal = normalize(cross(t2, t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     normalsArray.push(normal);
     normalsArray.push(normal);
     normalsArray.push(normal);

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}

function divideTriangle1(a, b, c, count) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}
function tetrahedron1(a, b, c, d, n) {
    divideTriangle1(a, b, c, n);
    divideTriangle1(d, c, b, n);
    divideTriangle1(a, d, b, n);
    divideTriangle1(a, c, d, n);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    var program2 = initShaders(gl, "vertex-shader1", "fragment-shader1");

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);


    tetrahedron(v[0], v[1], v[2], v[3], numTimesToSubdivide);
    
    //colorCube();
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    var translation = gl.getUniformLocation(program, 'translation');
     gl.uniform4f(translation, tX, tY,tZ, 0.0);
    thetaLoc = gl.getUniformLocation(program, "Theta");
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    nMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    render();
//    gl.useProgram(program2);
  //  tetrahedron1(v[0], v[1], v[2], v[3], numTimesToSubdivide);
    //gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    //render();
    document.getElementById("Button0").onclick = function(){radius *= 2.0;};
    document.getElementById("Button1").onclick = function(){radius *= 0.5;};
    document.getElementById("Button2").onclick = function(){I=0;};
    document.getElementById("Button3").onclick = function(){I=1;};
    document.getElementById("Button4").onclick = function(){I=2;};
    document.getElementById("Button5").onclick = function(){phi -= dr;};
    document.addEventListener('keydown',function(e){
	e.preventDefault();
	if(e.keyCode == 38){
	    tY += .1;
	    translation = gl.getUniformLocation(program, 'translation');
	    gl.uniform4f(translation, tX, tY,tZ, 0.0);
	    thetaLoc = gl.getUniformLocation(program, "Theta");

	}
	else if (e.keyCode == 40){
	    tY -= .1;
	    translation = gl.getUniformLocation(program, 'translation');
	    gl.uniform4f(translation, tX, tY,tZ, 0.0);
	    thetaLoc = gl.getUniformLocation(program, "Theta");

	}
	else if(e.keyCode == 37){
	    tX -=.1;
	    translation = gl.getUniformLocation(program, 'translation');
	    gl.uniform4f(translation, tX, tY,tZ, 0.0);
	    thetaLoc = gl.getUniformLocation(program, "Theta");
	    
	}
	else if (e.keyCode == 39){
	    tX +=.1;
	    translation = gl.getUniformLocation(program, 'translation');
	    gl.uniform4f(translation, tX, tY,tZ, 0.0);
	    thetaLoc = gl.getUniformLocation(program, "Theta");

	}
    });

  


    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"), ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"), diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"), specularProduct );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"), lightPosition );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );

//    render();
}


function render() {


    
    Theta[I] += 3;
    gl.uniform3fv(thetaLoc, Theta);
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    nMatrix = normalMatrix(modelViewMatrix);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix );
    gl.uniformMatrix3fv(nMatrixLoc, false, nMatrix );
    
    
    for( var i=0; i<index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    window.requestAnimFrame(render);
}
function render2() {


    
    Theta2[I] += 3;
    gl.uniform3fv(thetaLoc, Theta2);
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    nMatrix = normalMatrix(modelViewMatrix);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix );
    gl.uniformMatrix3fv(nMatrixLoc, false, nMatrix );
    
    
    for( var i=0; i<Index; i+=3)
        gl.drawArrays( gl.TRIANGLES, i, 3 );

    window.requestAnimFrame(render);
}
