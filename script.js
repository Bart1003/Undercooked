class Character{
  constructor (x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = color;
    this.v_ver = 1;
    this.a = 0.33; 
    this.v_hor = 1
  }

  
  jump(){

  }



  draw(){
    fill(this.c)
    ellipse(this.x, this.y, this.w, this.h);


    if (this.v_ver < 15){
        this.v_ver = this.v_ver + this.a;
      } 

    this.y += this.v_ver;
    this.x += this.v_hor

    //helps see what happens to the velocities, not a part of the end game (at least not planned yet, could be fun though)
    textSize(32)
    fill(50)
    text(this.v_ver, 100, 30);
    text(this.v_hor, 100, 70)

    //collision met de grond en plafond
    if (this.y > height - (this.h/2)|| this.y < 0 + (this.h/2)) {
      if (this.y > height - (this.h/2)) {
        this.y = height - (this.h/2);
        this.v_ver = 0
        this.v_hor = 0
      } else if ( this.y < 0 + (this.h/2)){
        this.y = 0 + (this.h/2);
        this.v_ver = 0
      }
    }

    if (this.x > width - (this.w/2)|| this.x < 0 + (this.w/2)) {
      if (this.x > height - (this.w/2)) {
        this.x = width - (this.w/2);
        this.v_hor = 0
      } else if ( this.x < 0 + (this.w/2)){
        this.x = 0 + (this.w/2);
        this.v_hor = 0
      }
    }
  }



}

class Block{
  constructor (x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = color;
  }

  hit(){
    hit = collideRectCircle(this.x,this.y,this.w, this.h , character.x, character.y, character.w, character.h);
    if (hit == true){
      this.c = "red"
      character.v_ver = 0
      character.v_hor = 0
      character.y = this.y - (this.h/2) 
    } else {
      this.c = "white"
    }  
  }


  draw(){
    fill(this.c)
    rect(this.x, this.y, this.w, this.h);
  }
  
}


var blocks = [], hit = false

function setup() {
  createCanvas(550, 500);
  character = new Character(150,150,50,50, "white");
  block = new Block(100,450,50,50, "white");

}

function draw() {
	background(225);  
  
  
  character.draw();
  block.hit();
  block.draw();

  
}



function keyPressed() {
  if (keyIsDown(LEFT_ARROW)) {
    if (keyCode == 32) {
      character.v_ver = -10
      character.v_hor = -5
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    if (keyCode == 32) {
      character.v_ver = -10
      character.v_hor = 5
    }
  } else if (keyCode == 32) {
      character.v_ver = -10
    }

}

    