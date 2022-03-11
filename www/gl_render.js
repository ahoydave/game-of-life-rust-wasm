"use strict";

var vertexShaderSource = `#version 300 es

uniform int u_width;
in float a_alive;
out vec4 v_colour;

void main() {
    int world_x = gl_VertexID % u_width;
    int world_y = gl_VertexID / u_width;
    float clip_x = float(world_x) / float(u_width) * 2.0 - 1.0;
    float clip_y = float(world_y) / float(u_width) * 2.0 - 1.0;

    gl_Position = vec4(clip_x, clip_y, 0, 1);
    gl_PointSize = 4.0;
    if (a_alive > 0.0) {
        v_colour = vec4(0, 0, 0, 1);
    } else {
        v_colour = vec4(1, 1, 1, 1);
    }
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

in vec4 v_colour;
out vec4 outColor;

void main() {
  outColor = v_colour;
}
`;

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    gl.deleteShader(shader);
    return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
}

export class Renderer {
    constructor(gl, world_height, world_width) {
        if (!gl) {
            console.log("There is no webgl2 context");
            return;
        }
        this.gl = gl;
        this.world_height = world_height;
        this.world_width = world_width;

        // create GLSL shaders, upload the GLSL source, compile the shaders
        var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        // Link the two shaders into a program
        this.program = createProgram(gl, vertexShader, fragmentShader);

        this.widthUniformLocation = gl.getUniformLocation(this.program, "u_width");
        this.positionAttributeLocation = gl.getAttribLocation(this.program, "a_alive");
    }

    render(cells) {
        var gl = this.gl;
        
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cells, gl.STATIC_DRAW);
    
        var vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(this.positionAttributeLocation);
    
        var size = 1;          // 2 components per iteration
        var type = gl.UNSIGNED_BYTE;
        var normalize = true; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            this.positionAttributeLocation, size, type, normalize, stride, offset);
    
        //webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        // Tell it to use our program (pair of shaders)
        gl.useProgram(this.program);
    
        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);
    
        gl.uniform1i(this.widthUniformLocation, this.world_width);
    
        // draw
        var primitiveType = gl.POINTS;
        var offset = 0;
        var count = this.world_height * this.world_width;
        gl.drawArrays(primitiveType, offset, count);
    };
}
