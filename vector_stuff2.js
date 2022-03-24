'use strict';

// Vector class for vector field
class Arrow {
    constructor (posx, posy, pointx, pointy) {
        this.posx = posx
        this.posy = posy
        this.pointx = pointx
        this.pointy = pointy
    }
}

// Test stuff

// Another change

class Vector {
    constructor (x, y) {
        this.x = x
        this.y = y
    }
}
// Class for a ball
class Ball {
    constructor (posx, posy, velx, vely, size) {
        this.posx = posx
        this.posy = posy
        this.velx = velx
        this.vely = vely
        this.held = false
        this.size = size
    }
}

// Creates balls.
let numBalls = 2;
let balls = [];
let paths = [];

// Height and width of the canvas.
let height = 1000
let width = 1000

// Density of vector grid.
let density = 0.02
let spacing = 1/(density)

// Vector grid.
let arrows = []
for (let i = 0; i < density * height + 1; i++) {
    for (let j = 0; j < density * width + 1; j++) {
        arrows.push(new Arrow(i * (spacing),j * (spacing),0,0,0,0))
    }
}

// Creates the canvas.
function setup() {
    createCanvas(1000, 1000);
    for (let i = 0; i < numBalls; i++) {
        balls.push(new Ball(random(0, 950), random(0, 950), random(-3, 3), random(-3, 3), 100))
        console.log(balls[0])
        paths.push([])
    }
    balls[0].posx = 500
    balls[0].posy = 750

    balls[0].velx = 3
    balls[0].vely = 0


    balls[1].posx = 500
    balls[1].posy = 250

    balls[1].velx = -3
    balls[1].vely = 0
    // balls[0].posx = cos(0) * 250 + 500
    // balls[0].posy = sin(0) * 250 + 500
    // balls[1].posx = cos(TWO_PI / 3) * 250 + 500
    // balls[1].posy = sin(TWO_PI / 3) * 250 + 500
    // balls[2].posx = cos(2 * TWO_PI / 3) * 250 + 500
    // balls[2].posy = sin(2 * TWO_PI / 3) * 250 + 500

    // balls[0].velx = cos(0 + PI / 2) * 5
    // balls[0].vely = sin(0 + PI / 2) * 5
    // balls[1].velx = cos(TWO_PI / 3 + PI / 2) * 5
    // balls[1].vely = sin(TWO_PI / 3 + PI / 2) * 5
    // balls[2].velx = cos(2 * TWO_PI / 3 + PI / 2) * 5
    // balls[2].vely = sin(2 * TWO_PI / 3 + PI / 2) * 5



}

// Finds the gravitatonal pull on one object from another.
function findGravVector(x1,y1,x2,y2) {
    let gravitatonalForce = 1000000/(dist(x1, y1, x2, y2) * dist(x1, y1, x2, y2))
    let x = cos(atan2(y2 - y1, x2 - x1)) * gravitatonalForce
    let y = sin(atan2(y2 - y1, x2 - x1)) * gravitatonalForce
    return new Vector(x, y)

}


function draw() {
    background(220);
    
    //loops through every vector.
    let gravVector, x, y;
    for (let i = 0; i < density * height + 1; i++) {
        for (let j = 0; j < density * width + 1; j++) {
            let index = [i * (density * height + 1) + j]
            
            let totalX = 0;
            let totalY = 0;
            for (let k = 0; k < numBalls; k++) {
                gravVector = findGravVector(arrows[index].posx, arrows[index].posy, balls[k].posx, balls[k].posy)
                x = gravVector.x
                y = gravVector.y

                if (dist(arrows[index].posx, arrows[index].posy, balls[k].posx, balls[k].posy) < 150) {
                    x = cos(atan2(balls[k].posy - arrows[index].posy, balls[k].posx - arrows[index].posx)) * 1000000/(150*150)
                    y = sin(atan2(balls[k].posy - arrows[index].posy, balls[k].posx - arrows[index].posx)) * 1000000/(150*150)
                }
            totalX += x
            totalY += y
            }
            arrow(arrows[index].posx, arrows[index].posy, arrows[index].posx + totalX, arrows[index].posy + totalY)

            // textSize(32);
            // text(`x: ${ball.posx}`, 10, 30);
            // text(`y: ${ball.posy}`, 10, 60);
            
            
            
            
        }  
    }
    fill(0)
    //noFill()
    stroke(0)
    let velocitySum = new Vector(0,0)
    for (let i = 0; i < numBalls; i++) {
        for (let j = 0; j < numBalls; j++) {
            if (i != j) {
                balls[i].velx += findGravVector(balls[i].posx, balls[i].posy, balls[j].posx, balls[j].posy).x/100
                balls[i].vely += findGravVector(balls[i].posx, balls[i].posy, balls[j].posx, balls[j].posy).y/100

                if (dist(balls[i].posx, balls[i].posy, balls[j].posx, balls[j].posy) < (balls[i].size + balls[j].size)/2) {
                    let v1 = new Vector(balls[i].velx, balls[i].vely)
                    let v2 = new Vector(balls[j].velx, balls[j].vely)
                    let pos1 = new Vector(balls[i].posx, balls[i].posy)
                    let pos2 = new Vector(balls[j].posx, balls[j].posy)
                    let v1f = vSub(v1, vMult(vDot(vSub(v1, v2), vSub(pos1, pos2))/vDot(vSub(pos1, pos2), vSub(pos1, pos2)), vSub(pos1, pos2)))
                    let v2f = vSub(v2, vMult(vDot(vSub(v2, v1), vSub(pos2, pos1))/vDot(vSub(pos2, pos1), vSub(pos2, pos1)), vSub(pos2, pos1)))
                    balls[i].velx = v1f.x
                    balls[i].vely = v1f.y
                    balls[j].velx = v2f.x
                    balls[j].vely = v2f.y
            
                }
            }
        }
        paths[i].push(new Vector(balls[i].posx, balls[i].posy))
        if (paths[i].length > 100) {
            paths[i].shift()
        }
        circle(balls[i].posx, balls[i].posy, balls[i].size)
        let arrowStartX = balls[i].posx + (cos(atan2(balls[i].vely, balls[i].velx)) * balls[i].size/2)
        let arrowStartY = balls[i].posy + (sin(atan2(balls[i].vely, balls[i].velx)) * balls[i].size/2)
        arrow(arrowStartX, arrowStartY, arrowStartX  + balls[i].velx * 10, arrowStartY + balls[i].vely * 10)
        velocitySum = vAdd(velocitySum, balls[i].velx, balls[i].vely)

        balls[i].posx += balls[i].velx
        balls[i].posy += balls[i].vely
        if (balls[i].posy > 1000 - balls[i].size/2) {
            balls[i].posy = 1000 - balls[i].size/2
            balls[i].vely = -1 * balls[i].vely
        }
        if (balls[i].posx > 1000 - balls[i].size/2) {
            balls[i].posx = 1000 - balls[i].size/2
            balls[i].velx = -1 * balls[i].velx
        }
        if (balls[i].posy < balls[i].size/2) {
            balls[i].posy = balls[i].size/2
            balls[i].vely = -1 * balls[i].vely
        }
        if (balls[i].posx < balls[i].size/2) {
            balls[i].posx = balls[i].size/2
            balls[i].velx = -1 * balls[i].velx
        }
        if (balls[i].held) {
            balls[i].posx = mouseX
            balls[i].posy = mouseY
            balls[i].velx = 0
            balls[i].vely = 0
        }
        // gravity
        // balls[i].vely += 0.9
        
        noFill()
        beginShape()
        stroke(0)
        for (let j = 0; j < paths[i].length; j++) {
            vertex(paths[i][j].x, paths[i][j].y)
        }
        endShape()
        fill(0)
    }
    // arrow(500, 500, 500 + balls[0].velx * 10, 500 + balls[0].vely * 10)
    // arrow(500, 500, 500 + balls[1].velx * 10, 500 + balls[1].vely * 10)
    // arrow(500, 500, 500 + balls[0].velx * 10 + balls[1].velx * 10, 500 + balls[0].vely * 10 + balls[1].vely * 10)

    
    


}

function dist(x1, y1, x2, y2) {
    return sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}

function arrow(p1x, p1y, p2x, p2y) {
    stroke(255 * dist(p1x, p1y, p2x, p2y)/spacing, 0, 255 - (255 * dist(p1x, p1y, p2x, p2y)/spacing))
    strokeWeight(2)
    line(p1x, p1y, p2x, p2y)
    let LEFTARROWX = cos(atan2(p1y - p2y, p1x - p2x) + PI/4) * dist(p1x, p1y, p2x, p2y)/4
    let LEFTARROWY = sin(atan2(p1y - p2y, p1x - p2x) + PI/4) * dist(p1x, p1y, p2x, p2y)/4
    line(p2x, p2y, p2x + LEFTARROWX, p2y + LEFTARROWY)
    let RIGHTARROWX = cos(atan2(p1y - p2y, p1x - p2x) - PI/4) * dist(p1x, p1y, p2x, p2y)/4
    let RIGHTARROWY = sin(atan2(p1y - p2y, p1x - p2x) - PI/4) * dist(p1x, p1y, p2x, p2y)/4
    line(p2x, p2y, p2x + RIGHTARROWX, p2y + RIGHTARROWY)

    stroke(0)
    strokeWeight(1)
}


function vAdd(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y)
}
function vSub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y)
}

function vDot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
}

function vMult(c, v1) {
    return new Vector(c * v1.x, c * v1.y)
}
function mousePressed() {
    for (let i = 0; i < balls.length; i++) {
        if(dist(balls[i].posx, balls[i].posy, mouseX, mouseY) < 50) {
            balls[i].held = true
        }
    }
    
}

function mouseReleased() {
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].held == true) {
            balls[i].held = false
        }
    }
}

