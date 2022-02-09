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
    this.bounce = 0.5; //determines how hard the character bounces
    this.v_ver_max = 15; //max downward speed
    this.jump_time = 0; 
    this.jump_time_factor = 0.5; //how quickly the jump height increases when holding the space bar down
    this.walk_speed = 3; //How quickly the character walks
    this.halfWidth = this.w / 2; 
    this.halfHeight = this.h / 2; //variable for collision checking
    this.collision = false //variable for collision checking
  }

  
  jump_walk(){
    if (keyIsDown(32)) {
      this.jump_time += this.jump_time_factor
    }
    if (keyIsDown(32) != true && this.collision == "bottom"){
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)){
        this.x -= this.walk_speed
      } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
        this.x += this.walk_speed
      }
    }   
    if (keyIsDown(32) == false){
      this.jump_time = 0
    }   
  }

  draw(){
    fill(this.c)
    rect(this.x, this.y, this.w, this.h);


    //if (this.v_ver < this.v_ver_max){
      //this.v_ver = this.v_ver + this.a;
    //} 
  
    //this.y += this.v_ver
    this.x += this.v_hor

    


    
    this.collision = checkCollision()
    if (this.collision == "top"){
      //this.v_ver = 0
      //this.v_hor = 0
    } else if (this.collision == "left" || this.collision == "right"){
      this.v_hor = this.v_hor * -this.bounce
      this.collision = false
    } else if (this.collision == "bottom"){
      //this.v_ver = 0
      this.v_hor = 0
    }
    

    

    
      

    //helps see what happens to the velocities, not a part of the end game (at least not planned yet, could be fun though)
    textSize(32)
    fill(50)
    
    //text(this.collision, 100, 100)
    //text(this.v_ver, 100, 30);
    text(this.v_hor, 100, 70)

    //collision met de grond en plafond
    //if (this.y > height - this.h || this.y < 0) {
      //if (this.y > height - this.h) {
        //this.y = height - this.h;
        //this.v_ver = 0
        //this.v_hor = 0
      //} 
      //if (this.y < 0) {
        //this.y = 0;
        //this.v_ver = 0
      //}
    //}

    if (this.x > width - this.w || this.x < 0 + (this.w)) {
      if (this.x > width - this.w) {
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
    this.halfWidth = this.w /2; //variable for collision checking
    this.halfHeight = this.h /2; //variable for collision checking
    this.v_ver = 0
    this.v_ver_max = 15
    this.a = 0.33
    this.collision = false
  }


  draw(){
    fill(this.c)
    rect(this.x, this.y, this.w, this.h);

    if (this.v_ver < this.v_ver_max){
      this.v_ver = this.v_ver + this.a;
    } 

    
    this.y -= this.v_ver

    fill(50)
    text(this.v_ver, 100, 30);
    text(character.collision, 100, 100)
    if (character.collision == "top"){
      this.v_ver = 0
    } else if (character.collision == "bottom"){
      this.v_ver = 0
    }
    
    
    

    
  }
  
}


var hit = false,
max_jump_height = 15, min_jump_height = 1 //min and max height the character can jump
ver_jump_speed = 7.5 //speed when jumping vertically

function setup() {
  createCanvas(550, 500);
  character = new Character(200,250,50,50, "white");
  blocks = [new Block(150,(height-250),300,50, "white"), 
  new Block(350,(height-400),50,20, "white"),
  new Block(0, (height-200),50,200, "white"),
  new Block(0,height,width,10, "white"),
  new Block(0,(height-650),100,50, "white"),
  new Block(450,(height-650),100,50, "white"),
  new Block(0,(height-950),200,150, "white"),
  new Block(450,(height-1000),20,100, "white"),
  new Block(200,(height-1300),20,150, "white"),
  new Block(400,(height-1250),150,50, "white"),
  ] 
  blocks.forEach(b => b.y += 2000)

}

function draw() {
	background(225);  
  
  
  
  
  
 
  blocks.forEach(b => b.draw())
  character.jump_walk()
  character.draw();
  character_height = blocks[4].y
  fill(50)
  text(character_height, 220, 70);
  
  
  

  
}

function keyReleased(){
  if (keyCode == 32 && character.collision == "bottom"){
    if (character.jump_time > max_jump_height){
      blocks.forEach(b => b.v_ver = -max_jump_height)
    } else if (character.jump_time < min_jump_height) {
      blocks.forEach(b => b.v_ver = -min_jump_height)
    } else {
      blocks.forEach(b => b.v_ver = -character.jump_time)
    }
    character.jump_time = 0
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      character.v_hor = -ver_jump_speed
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      character.v_hor = ver_jump_speed
    }
    character.collision = false
  }
 
}






function checkCollision(){   

  colliding = false;

  // check collision for each block
  blocks.forEach(function(block) {
    
    // calculate difference from x and y axis centres
    let dx = (character.x + character.halfWidth) - (block.x + block.halfWidth);
    let dy = (character.y + character.halfHeight) - (block.y + block.halfHeight);

    let combinedHalfWidths  = character.halfWidth + block.halfWidth;
    let combinedHalfHeights = character.halfHeight + block.halfHeight;

    // x-axis collision?
    if(Math.abs(dx) < combinedHalfWidths){
      
      // y-axis collision?
      if(Math.abs(dy) < combinedHalfHeights){          

        let overlapX = combinedHalfWidths - Math.abs(dx);
        let overlapY = combinedHalfHeights - Math.abs(dy);          

        // collision is on the smallest overlap
        if(overlapX >= overlapY){
          if(dy > 0) {
            blocks.forEach(b => b.y -= overlapY) 

            //character.y += overlapY;
            colliding = "top";
          }
          else { 
            blocks.forEach(b => b.y += overlapY)           
            //character.y -= overlapY;
            colliding = "bottom";            
          }
        }
        else{
          if(dx > 0){ 
            character.x += overlapX; 
            colliding = "left";
          }
          else {
            character.x -= overlapX;
            colliding = "right";
          }
        }

        //showDebug({ overlapX:overlapX, overlapY:overlapY, dx:dx, dy:dy, colliding:colliding});
      }
    }

  });

  return colliding;
}





    