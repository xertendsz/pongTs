const canvas: HTMLCanvasElement | null = document.querySelector('.canvas');
const ctx = canvas?.getContext('2d')

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const win = document.querySelector('.win');
const lose = document.querySelector('.lose');

const upbtn = document.querySelector('.up');
const downbtn = document.querySelector('.down');

function moveup() {
    player.velocity.y = -5;
}

function movedown() {
    player.velocity.y = 5;
}

if (upbtn) {
    upbtn.innerHTML = "▲"
    upbtn.addEventListener("click", moveup)
}

if(downbtn) {
    downbtn.innerHTML = "▼"
    downbtn.addEventListener("click", movedown)
}

class Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;

    constructor(x: number, y: number, w: number, h: number, color: string) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
    }
    draw() {
        if (ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}

const up: Rectangle = new Rectangle(0, 0, canvas?canvas.width:window.innerWidth, 10, "white")
const bottom: Rectangle = new Rectangle(0, window.innerHeight - 10, canvas?canvas.width:window.innerWidth, 10, "white")
const vertical: Rectangle = new Rectangle(window.innerWidth/2, 0, 10, window.innerHeight - 10, "white")

class Shape {
    x: number
    y: number
    w: number 
    h: number
    color: string
    velocity: {x: number, y: number}

    constructor(x: number, y: number, w: number, h: number, color: string) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = color
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    draw() {
        if (ctx) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.roundRect(this.x, this.y, this.w, this.h, [10]);
            ctx.stroke();
        }
    }
}

class Player extends Shape {
    update(): void {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.y + this.h > window.innerHeight - 15) {
            this.y = window.innerHeight - 15 - this.h
        } else if (this.y < 15) {
            this.y = 15
        }
    }
}

class Opponent extends Shape {
    update() {
        this.draw();
        this.y = ball.y - 15
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.y + this.h > window.innerHeight - 15) {
            this.y = window.innerHeight - 15 - this.h
        } else if (this.y < 15) {
            this.y = 15
        }
    }
}

const player: Player = new Player(10, innerHeight/2.4, 20, innerHeight/5, "#E0E722")
const opponent: Opponent = new Opponent(innerWidth - 30, innerHeight/2.4, 20, innerHeight/5, "cyan")

class Ball {
    x: number
    y: number
    a: number
    b: number
    winv: number = 0
    losev: number = 0
    velocity: {x: number, y: number}

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.velocity = {
            x: 10,
            y: 1
        }
        this.a = this.x
        this.b = this.y
    }

    draw() {
        if (ctx) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI)
            ctx.fillStyle =  "white"
            ctx.fill()
        }
    }

    update() {
        this.draw()
        this.x -= this.velocity.x 
        this.y -= this.velocity.y

        if (this.x > window.innerWidth || this.x  < 0) {
           this.x = this.a
           this.y = this.b
           this.winv -= 1
           this.losev += 1
           if (win && lose) {
                win.innerHTML = `${this.winv}`
                lose.innerHTML = `${this.losev}`
           }
           
        } else if (this.x < player.x + player.w + 10 && this.x > player.x + 15 &&
            this.y < player.y + player.h && this.y > player.y) {
            this.velocity.x *= -1
            this.velocity.y = (Math.random() - 0.5) * 10

        } else if (this.x < opponent.x + opponent.w + 10 && this.x > opponent.x -20 &&
            this.y < opponent.y + opponent.h && this.y > opponent.y) {
            this.velocity.x *= -1
            this.velocity.y = (Math.random() - 0.5)

        } else if (this.y > innerHeight - 25 || this.y < 15) { 
            this.velocity.y *= -1
        } 
    }
}

const ball: Ball = new Ball(innerWidth/2 + 5, innerHeight/2)

function animate(): void {
    if (ctx) 
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    up.draw()
    bottom.draw()
    vertical.draw()
    player.update()
    opponent.update()
    ball.update()
    
    requestAnimationFrame(animate);
}

animate()

function control(e: KeyboardEvent): void {
    switch(e.key) {
        case "ArrowUp":
            player.velocity.y = -5
            break;
        case "ArrowDown":
            player.velocity.y = 5
            break;
    }
}

window.addEventListener("keydown", control)
