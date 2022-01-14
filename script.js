class Character{
  constructor (x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = color
    this.v = 3
    this.a = 1.05
  }

  draw(){
    fill(this.c)
    ellipse(this.x, this.y, this.w, this.h);

    if (this.v < 10){
      this.v = this.v * this.a;
    }
    this.y += this.v

    if (this.y > height - (this.h/2)|| this.y < 0 + (this.h/2)) {
      if (this.y > height - (this.h/2)) {
       this.y = height - (this.h/2);
      } else if ( this.y < 0 + (this.h/2)){
        this.y = 0 + (this.h/2);
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
    this.c = color
  }

  hit(){
    hit = collideRectCircle(this.x,this.y,this.w, this.h , character.x, character.y, character.w, character.h);
    if (hit == true){
      this.c = "red"
    } else {
      this.c = "white"
    }  
  }


  draw(){
    fill(this.c)
    rect(this.x, this.y, this.w, this.h);
  }
  
}


var blocks = [], hit = false;

function setup() {
  createCanvas(550, 500);
  character = new Character(150,150,50,50, "white");
  block = new Block(100,450,50,50, "white");

}

function draw() {
	background(225);  
  
  block.hit();
  character.draw();
  block.draw();
  

  
}




    