/* classes */ 

// Color constructor
class Color {
    
        // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
    
        // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; this.g += c.g; this.b += c.b; this.a += c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color add
    
        // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; this.g -= c.g; this.b -= c.b; this.a -= c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color subgtract
    
        // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; this.g *= s; this.b *= s; this.a *= s; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color scale method
    
        // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; this.g = c.g; this.b = c.b; this.a = c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end Color copy method
    
        // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    } // end Color clone method
    
        // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }  // end Color toConsole
    
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    

// draw a color-interpolated rectangle given its corner positions and colors
function drawRectangle(imagedata,ulx,uly,lrx,lry,ulc,urc,llc,lrc) {

    // set up the vertical interpolation
    var lc = ulc.clone();  // left color
    var rc = urc.clone();  // right color
    var vDelta = 1 / (lry-uly); // norm'd vertical delta
    var lcDelta = llc.clone().subtract(ulc).scale(vDelta); // left vert color delta
    var rcDelta = lrc.clone().subtract(urc).scale(vDelta); // right vert color delta

    // set up the horizontal interpolation
    var hc = new Color(); // horizontal color
    var hDelta = 1 / (lrx-ulx); // norm'd horizontal delta
    var hcDelta = new Color(); // horizontal color delta

    // do the interpolation
    for (var y=uly; y<=lry; y++) {
        hc.copy(lc); // begin with the left color
        hcDelta.copy(rc).subtract(lc).scale(hDelta); // reset horiz color delta
        for (var x=ulx; x<=lrx; x++) {
            drawPixel(imagedata,x,y,hc);
            hc.add(hcDelta);
        } // end horizontal
        lc.add(lcDelta);
        rc.add(rcDelta);
    } // end vertical
} // end drawRectangle

// draw a color-interpolated triangle, one color per vertex
// each vertex is {x: <number>, y: <number>, c: <Color>}
function drawTriangle(imagedata,v0,v1,v2) {

    // twice the signed area of the triangle: the barycentric normalizer
    var area = (v1.x-v0.x)*(v2.y-v0.y) - (v2.x-v0.x)*(v1.y-v0.y);
    if (area === 0) // degenerate triangle, nothing to fill
        return;

    // only visit the pixels inside the triangle's bounding box
    var minX = Math.max(0,Math.floor(Math.min(v0.x,v1.x,v2.x)));
    var maxX = Math.min(imagedata.width-1,Math.ceil(Math.max(v0.x,v1.x,v2.x)));
    var minY = Math.max(0,Math.floor(Math.min(v0.y,v1.y,v2.y)));
    var maxY = Math.min(imagedata.height-1,Math.ceil(Math.max(v0.y,v1.y,v2.y)));

    var c = new Color(); // the interpolated pixel color
    for (var y=minY; y<=maxY; y++) {
        for (var x=minX; x<=maxX; x++) {

            // barycentric weights of this pixel wrt the three vertices
            var b0 = ((v1.x-x)*(v2.y-y) - (v2.x-x)*(v1.y-y)) / area;
            var b1 = ((v2.x-x)*(v0.y-y) - (v0.x-x)*(v2.y-y)) / area;
            var b2 = 1 - b0 - b1;

            // inside the triangle only when no weight is negative
            if ((b0 >= 0) && (b1 >= 0) && (b2 >= 0)) {
                c.copy(v0.c).scale(b0);
                c.add(v1.c.clone().scale(b1));
                c.add(v2.c.clone().scale(b2));
                drawPixel(imagedata,x,y,c);
            } // end if inside
        } // end horizontal
    } // end vertical
} // end drawTriangle


/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html
    var imagedata = context.createImageData(w,h);

    // the four requested corner colors
    var cyan = new Color(0,255,255,255);
    var magenta = new Color(255,0,255,255);
    var yellow = new Color(255,255,0,255);
    var pink = new Color(255,105,180,255);

    // a rectangle with cyan, magenta, yellow and pink corners
    drawRectangle(imagedata,40,40,250,190,cyan,magenta,yellow,pink);

    // a triangle with cyan, magenta and yellow corners
    drawTriangle(imagedata,
        {x:130, y:270, c:cyan},     // apex
        {x:440, y:300, c:magenta},  // right
        {x:250, y:480, c:yellow});  // bottom

    context.putImageData(imagedata, 0, 0); // display the image in the context
}
