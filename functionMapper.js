const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const scaleInput = document.getElementById("scale");
const tMax = document.getElementById("tMax");
const piBox = document.getElementById("piBox");
const impResInput = document.getElementById("impResInput");

const functionInput = document.getElementById("f");
    functionInput.addEventListener("input", stop);
const startButton = document.getElementById("startButton"); 
    startButton.addEventListener("click", startStop);
    let running = false;

const w = canvas.width;
const h = canvas.height;

const axes = {
    left: -w / 2 + 10,
    right: w / 2 - 10,
    bottom: -h /2 + 10,
    top: h /2 - 10,

    width: w - 20,
    height: h - 20,
}

let scale = 2*scaleInput.value;
let curx = -scale/2;
const numSteps = 1000 * scale;
let input = 0;
let impRes = Math.floor(impResInput.value);

let t = 0;
let tstep = 1/60;


window.onload = (event) => {
    context.translate(w/2, h/2);
    context.scale(1, -1);
    startStop();
}

function draw() {
    context.clearRect(-w/2, -h/2, w, h);
    input = clean(functionInput.value);
    scale = 2*scaleInput.value;
    impRes = Math.floor(impResInput.value);
    drawAxes();

    if (input.includes("y")) {
        drawImplicitFunction(Function("x", "y", "return " + input));
    }
    else {
        drawFunction(Function("x", "return " + input));
    }
    
    t += tstep;
    if ((t > tMax.value && !piBox.checked)) t = 0;
    else if (t > tMax.value * pi) t = 0;
    if (running) window.requestAnimationFrame(draw);
}

//draws function y=f(x)
function drawFunction(f) {
    context.save()
    context.lineWidth = 3;


    curx = -scale/2;
    for (let i = 0; i < numSteps; i++) {
        context.beginPath();
        context.strokeStyle = "rgb(" 
                                + (50+125*(curx/scale+0.5)).toString()
                                + " 50 "
                                + (50+125*(f(curx)/scale+0.5)).toString()
                                + ")";

        context.moveTo(curx*axes.width/scale, f(curx)*axes.height/scale);
        curx += scale / numSteps;
        context.lineTo(curx*axes.width/scale, f(curx)*axes.height/scale);
        
        context.stroke();
        context.stroke();
        context.closePath();
    }
    context.restore();
}

//draws implicit function f(x,y) < 0
function drawImplicitFunction(f) {
    context.save();
    //checks each square of pixels w/ side length impRes
    for (let i=axes.bottom; i<=axes.top; i += impRes) {
        for (let j=axes.left; j<=axes.right; j += impRes) {

            if (f(i*scale/axes.width, j*scale/axes.height) < 0) {   //fills square if equation is true

                context.beginPath();
                context.fillStyle = "rgb(" + (50+205*(j-axes.left)/axes.width).toString()
                                           + " 50 "
                                           + (50+205*(i-axes.bottom)/axes.height).toString()
                                           + ")";
                context.rect(j, i, impRes, impRes);
                context.fill();
                context.closePath();
            }

        }
    }
    context.restore();
}

function drawAxes() {
    context.save();

    //grid lines
    context.lineWidth = 1;
    context.beginPath();
    context.strokeStyle = "gray"
    for (let i = 0; i <= scale; i++) {
        context.moveTo(axes.left+i*axes.width/scale, axes.bottom);
        context.lineTo(axes.left+i*axes.width/scale, axes.top);
        context.moveTo(axes.left, axes.bottom+i*axes.height/scale);
        context.lineTo(axes.right, axes.bottom+i*axes.height/scale);
    }
    context.stroke();
    context.closePath();
    
    //axes
    context.strokeStyle = "black"
    context.beginPath();
    context.moveTo(axes.left, 0);
    context.lineTo(axes.right, 0);
    context.moveTo(0, axes.bottom);
    context.lineTo(0, axes.top);
    context.stroke();
    context.stroke();
    context.closePath();

    context.restore();
}

function clean(input) {
    input.replaceAll("X", "x");
    input.replaceAll("Y", "y");
    input.replaceAll("T", "t");
    return input;
}

function startStop() {
    if (running) startButton.value = "Start";
    else {
        t = 0;
        startButton.value = "Stop";
    }
    running = !running;
    if (running) window.requestAnimationFrame(draw);
}

function stop() { if (running) startStop(); }

function sin(x) { return Math.sin(x % (2*pi)); }
function cos(x) { return Math.cos(x % (2*pi)); }
function tan(x) { return Math.tan(x % (2*pi)); }
const pi = Math.PI;
const e = Math.E;