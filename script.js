class Character{
  constructor (x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = color;
    this.v = 1;
    this.a = 0.33; 
  }

  
  jump(){

  }



  draw(){
    fill(this.c)
    ellipse(this.x, this.y, this.w, this.h);

    
    this.y += this.v;
    this.x += 2

    if (this.v < 15){
        this.v = this.v + this.a;
      } 
    

    //helps see what happens to the velocity, not a part of the end game (at least not planned yet, could be fun though)
    textSize(32)
    fill(50)
    text(this.v, 100, 30);

    //collision met de grond en plafond
    if (this.y > height - (this.h/2)|| this.y < 0 + (this.h/2)) {
      if (this.y > height - (this.h/2)) {
       this.y = height - (this.h/2);
      } else if ( this.y < 0 + (this.h/2)){
        this.y = 0 + (this.h/2);
      }
    }

    if (this.x > width - (this.w/2)|| this.x < 0 + (this.w/2)) {
      if (this.x > height - (this.w/2)) {
       this.x = width - (this.w/2);
      } else if ( this.x < 0 + (this.w/2)){
        this.x = 0 + (this.w/2);
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
      character.v = 0
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
  block = new Block(475,450,50,50, "white");

}

function draw() {
	background(225);  
  
  
  character.draw();
  block.hit();
  block.draw();

  
}



function keyPressed() {
  if (keyCode == 32) {
    character.v = -10
  }
}

    