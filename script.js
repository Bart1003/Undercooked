class Character{
  constructor (x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = color;
    this.v_ver = 0; //vertical velocity
    this.a = 0.33; //downwards accelaration
    this.v_hor = 0; //horizontal velocity
    this.bounce = 0.5 //determines how hard the character bounces
    this.v_ver_max = 15 //max downward speed
    this.jump_time = 0 
    this.jump_time_factor = 0.5 //how quickly the jump height increases when holding the space bar down
  }

  
  jump(){
    if (keyIsDown(32)) {
      this.jump_time += this.jump_time_factor
    }
  }



  draw(){
    fill(this.c)
    rect(this.x, this.y, this.w, this.h);


    if (this.v_ver < this.v_ver_max){
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
    if (this.y > height - this.h || this.y < 0) {
      if (this.y > height - this.h) {
        this.y = height - this.h;
        this.v_ver = 0
        this.v_hor = 0
      } else if (this.y < 0) {
        this.y = 0;
        this.v_ver = 0
      }
    }

    if (this.x > width - this.w || this.x < 0 + (this.w/2)) {
      if (this.x > height - this.w) {
        this.x = width - this.w;
        this.v_hor = this.v_hor * -this.bounce
      } else if (this.x < 0){
        this.x = 0;
        this.v_hor = this.v_hor * -this.bounce
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


var blocks = [], hit = false, 
max_jump_height = 15, min_jump_height = 2 //min and max height the character can jump
ver_jump_speed = 7.5 //speed when jumping vertically

function setup() {
  createCanvas(550, 500);
  character = new Character(150,150,50,50, "white");
  block = new Block(100,450,50,50, "white");

}

function draw() {
	background(225);  
  
  
  character.draw();
  character.jump()
  //block.hit();
  //block.draw();

  
}

function keyReleased(){
  if (keyCode == 32){
    if (character.jump_time > max_jump_height){
      character.v_ver = -max_jump_height
    } else if (character.jump_time < min_jump_height) {
      character.v_ver = -min_jump_height
    } else {
      character.v_ver = -character.jump_time
    }
    character.jump_time = 0
    if (keyIsDown(LEFT_ARROW)) {
    character.v_hor = -ver_jump_speed
    } else if (keyIsDown(RIGHT_ARROW)) {
      character.v_hor = ver_jump_speed
    }
  }
 
}



    