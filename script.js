class Character{
  constructor (x, y, w, h, color, img){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = color;
    this.img = img;
    this.v_hor = 0; //horizontal velocity
    this.bounce = 0.5; //determines how hard the character bounces
    this.jump_time = 0; 
    this.jump_time_factor = 0.5; //how quickly the jump height increases when holding the space bar down
    this.walk_speed = 3; //How quickly the character walks
    this.halfWidth = this.w / 2; 
    this.halfHeight = this.h / 2; //variable for collision checking
    this.collision = false //variable for collision checking
    this.ice = 0.98 
    this.ice_walk_speed = 0.04
    this.block_type = "none"
    this.walking = false
  }

  
  jump_walk(){
    this.walking = false
    if (keyIsDown(32)) {
      this.jump_time += this.jump_time_factor
    } else{
      this.jump_time = 0
    }

    //walking without ice physics
    if (keyIsDown(32) != true && this.collision == "bottom" && this.block_type != "ice"){
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)){
        this.v_hor -= this.walk_speed
        this.walking = true
      } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
        this.v_hor += this.walk_speed
        this.walking = true
      }

    //walking with ice physics
    } else if (this.block_type == "ice" && keyIsDown(32) == false)
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)){
        this.walking = true
        if (this.v_hor == 0){
          this.v_hor = -0.5
        } else if (this.v_hor >= -this.walk_speed && this.v_hor < 0){
          this.v_hor +=  (this.v_hor * this.ice_walk_speed)
        } else {
          this.v_hor -=  (this.v_hor * this.ice_walk_speed)
        }

      } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
        this.walking = true
        if (this.v_hor == 0){
          this.v_hor = 0.5
        } else if (this.v_hor <= this.walk_speed){
          if (this.v_hor > 0){
            this.v_hor +=  (this.v_hor * this.ice_walk_speed)
          }else {
            this.v_hor +=  (-this.v_hor * this.ice_walk_speed)
          }
          
        }
      }
  }

  
  
  draw(){
    pickImage();
    fill(this.c)
    //rect(this.x, this.y, this.w, this.h);

    this.img.resize(0,0)
    if (this.img == charjumpcharge){
      image(this.img,this.x, this.y+15, this.w, this.h-15);
    } else if (this.img == charrun1right || this.img == charrun2right){
      image(this.img,this.x, this.y, this.w+9, this.h);
    } else if (this.img == charrun1left || this.img == charrun2left){
      image(this.img,this.x-9, this.y, this.w+9, this.h);
    } else {
      image(this.img,this.x, this.y, this.w, this.h);
    }
    

    
    fill(50)
    text(this.v_hor, 300, 70)
    this.x += this.v_hor
    
    this.collision_blocktype = checkCollision()
    this.collision = this.collision_blocktype[0]
    this.block_type = this.collision_blocktype[1]

    
    if (this.collision == "top"){
      if (hit3.isPlaying() == false){
        hit3.play()
      }
      
    } else if (this.collision == "left" || this.collision == "right"){
      this.v_hor = this.v_hor * -this.bounce
      this.collision = false
      if (this.walking == false){
        hit3.play()
      }
      
    } else if (this.collision == "bottom"){
      if (this.block_type == "ice"){
        if (this.v_hor >= 0){
          this.v_hor *= this.ice
        } else if (this.v_hor <= 0){
          this.v_hor *= this.ice
        }
        if (this.v_hor < 0.1 && this.v_hor > -0.1){
          this.v_hor = 0
        }
      } else {
        this.v_hor = 0
      }
    }
    
    textSize(32)
    fill(50)
    text(this.walking, 100, 30)
    text(this.collision, 300, 30)
    

    if (this.x > width - this.w || this.x < 0 + (this.w)) {
      if (this.x > width - this.w) {
        this.x = width - this.w;
        this.v_hor = this.v_hor * -this.bounce
        hit3.play()
      } else if (this.x < 0){
        this.x = 0;
        this.v_hor = this.v_hor * -this.bounce
        hit3.play()
      }
    }
  }
}

class Block{
  constructor (x, y, w, h, color, type){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.c = color;
    this.halfWidth = this.w /2 //variable for collision checking
    this.halfHeight = this.h /2 //variable for collision checking
    this.v_ver = 0
    this.v_ver_max = 15
    this.a = 0.33
    this.collision = false
    if (type != null){
      this.type = type
    } else {
      this.type = "standard"
    }
    if (this.type == "ice"){
      this.img = block_ice_image  
    } else{
      this.img = block_image
    }
    
   
  }  


  draw(){
    fill(this.c)

    if (this.v_ver < this.v_ver_max){
      this.v_ver = this.v_ver + this.a
    } 

    if (this.y + this.h >=0 && this.y <= height && this.type != "wall"){
      this.x_pos = this.x
      this.y_pos = this.y
      for (let i = 0; i < (this.h/25); i++) {
        for (let i = 0; i < (this.w/25); i++) {
        image(this.img, this.x_pos, this.y_pos, 25, 25)
        this.x_pos += 25
          
        }
        this.x_pos = this.x
        this.y_pos += 25
         
      }
    } else if (this.y + this.h >=0 && this.y <= height) {
      rect(this.x, this.y, this.w, this.h)
    }
    
    //background_images.forEach(c => c.v_ver = this.v_ver)
    this.y -= this.v_ver
    //text(this.v_ver, 200, 100, 100, 100)

    if (character.collision == "top"){
      this.v_ver = 0
    } else if (character.collision == "bottom"){
      this.v_ver = 0
    }

    
  }
}


class Background{
  constructor (x, y, w, h, image, start_height, end_height, character_height){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.start_height = start_height-300
    this.end_height = end_height - 300
    this.character_height = character_height
    
    this.v_ver = blocks[4].v_ver
    
    this.img = image
    
   
  }  


  draw(){
    this.v_ver = blocks[4].v_ver
    this.character_height = character_height
    if (this.character_height >= this.end_height){
      this.y = (this.character_height - this.end_height)
    }else if (this.character_height <= this.start_height){
      this.y = (this.character_height - this.start_height)
    } else {
      this.y = 0
    }
    //rect(this.x, this.y, this.w, this.h);

    //if (this.character_height <= this.end_height && this.character_height >= this.start_height){
      //image(this.img, this.x, this.y, width, height)
    //} else if (this.character_height <= (this.end_height + height) && this.character_height >= this.end_height){
      //image(this.img, this.x, this.y, width, height)
      //this.y -= this.v_ver
      
    //} else {
     // image(this.img, this.x, this.y, width, height)
    //}
    
    image(this.img, this.x, this.y, width, this.h)
    
    //this.y -= this.v_ver

    fill(50)
    text(this.y, 100, 100, 100, 100)
    

  }
  
}



var hit = false,
max_jump_height = 15, min_jump_height = 1 //min and max height the character can jump
ver_jump_speed = 7.5 //speed when jumping vertically
max_v_hor = 10 //max horizontal jumping speed on ice
frame_counter = 0
character_height = 0
game_state = "startscreen"
prev_collision = "false"
this_vver = 0
lastdir = right

function setup() {
  createCanvas(1000, 500)
  character = new Character(100,250,50,50, "white", charstandardright)

  blocks = [  
  new Block(375,(height-250),300,50, "white"), 
  new Block(575,(height-400),50,20, "white"),
  new Block(225,(height-200),50,200, "white"),
  new Block(225,(height-650),100,50, "white"),
  new Block(675,(height-650),100,50, "white"),
  new Block(225,(height-950),200,150, "white"),
  new Block(675,(height-1000),20,100, "white"),
  new Block(425,(height-1300),20,150, "white"),
  new Block(625,(height-1250),150,50, "white"),
  new Block(350,(height-1600),100,50, "white"),
  new Block(0,(height-1800),375,50, "white"),
  new Block(525,(height-1800),475,50, "white"),
  //na de eerste checkpoint (wanneer het scherm breeder wordt)
  new Block(375,(height-2000),450,50, "white"),
  new Block(100,(height-2200),50,50, "white"),
  new Block(500,(height-2400),100,50, "white"),
  new Block(500,(height-2550),400,50, "white"),
  new Block(800,(height-2400),100,50, "white"),
  new Block(0,(height-2800),250,50, "white"),
  new Block(150,(height-3000),150,50, "white"),
  new Block(00,(height-3250),100,50, "white"),
  new Block(300,(height-3250),25,300, "white"),
  new Block(550,(height-3250),25,50, "white"),
  new Block(800,(height-3250),25,50, "white"),
  new Block(0,(height-3500),825,50, "white"),
  //na de tweede checkpoint
  new Block(850,(height-3700),150,50, "white"),
  new Block(475,(height-3900),50,50, "white"),
  new Block(0,(height-4100),50,50, "white"),
  new Block(475,(height-4300),50,50, "white"),
  new Block(750,(height-4500),250,50, "white"),
  new Block(675,(height-5550),25,900, "white"),
  new Block(0,(height-4650),700,25, "white"),
  new Block(850,(height-4750),50,50, "white"),
  new Block(850,(height-4900),50,50, "white"),
  new Block(850,(height-5100),50,50, "white"),
  new Block(850,(height-5350),50,50, "white"),
  new Block(500,(height-5750),25,950, "white"),
  //na de derde checkpoint (wanneer je een stukje naarbeneden moest vallen)
  new Block(525,(height-5750),475,25, "white"),
  new Block(75,(height-4900),50,50, "white"),
  new Block(225,(height-4900),50,50, "white"),
  new Block(375,(height-4900),50,50, "white"),
  new Block(150,(height-5100),50,50, "white"),
  new Block(325,(height-5100),50,50, "white"),
  new Block(75,(height-5300),50,50, "white"),
  new Block(225,(height-5300),50,50, "white"),
  new Block(375,(height-5300),50,50, "white"),
  new Block(150,(height-5500),50,50, "white"),
  new Block(325,(height-5500),50,50, "white"),
  new Block(0,(height-5950),700,25, "white", "ice"),
  new Block(850,(height-5950),150,25, "white", "ice"),
  //na de vierde checkpoint (wanner het ice stuk begint)
  new Block(0,(height-6100),200,25, "white", "ice"),
  new Block(700,(height-6300),200,25, "white", "ice"),
  new Block(600,(height-6550),200,25, "white", "ice"),
  new Block(0,(height-6750),200,25, "white", "ice"),
  new Block(800,(height-6950),200,25, "white", "ice"),
  new Block(0,(height-7050),300,25, "white", "ice"),
  new Block(100,(height-7300),200,25, "white", "ice"),
  new Block(200,(height-7550),100,25, "white", "ice"),
  new Block(400,(height-7750),600,25, "white", "ice"),
  new Block(700,(height-7950),100,25, "white", "ice"),
  new Block(100,(height-8150),150,25, "white", "ice"),
  new Block(900,(height-8250),100,25, "white", "ice"),
  
  //deze blokken vormen de muren en ondergrond in het eerste stuk
  new Block(775,(height-1800),225,1800, "black", "wall"),
  new Block(0,(height-1800),225,1800, "black", "wall"),
  new Block(0,height,width,1000, "black", "wall"),
  
  ] 

  background_images = [
  new Background(0,0,width,height, backgroundimg3, 6425, 38000, character_height),
  new Background(0,0,width,height, backgroundimg, 2300, 5925, character_height),
  new Background(0,0,width,height, backgroundimg2, 0, 1800, character_height)
  ]

  
  blocks.forEach(b => b.y += 8150)
  //blocks.forEach(b => b.y += 000)
}

function preload(){
  //block en background images
  backgroundimg = loadImage('images/block/dungeon_background.jpg')
  backgroundimg2 = loadImage('images/block/dungeonbackground4.png')
  backgroundimg3 = loadImage('images/block/icedungeonbackground.jpg')
  block_image = loadImage("images/block/blockimg3.png")
  block_ice_image = loadImage("images/block/ice.jpeg")
  //characterimages:
  charstandardright = loadImage('images/character/charstandard/charstandardright.png')
  charstandardleft = loadImage('images/character/charstandard/charstandardleft.png')
  charjumpleft = loadImage('images/character/charjump/charjumpleft.png')
  charjumpright = loadImage('images/character/charjump/charjumpright.png')
  charfallleft = loadImage('images/character/charfall/charfallleft.png')
  charfallright = loadImage('images/character/charfall/charfallright.png')
  charrun1right = loadImage('images/character/charrun1/charrunright.png')
  charrun2right = loadImage('images/character/charrun2/charrunright2.png')
  charrun1left = loadImage('images/character/charrun1/charrunleft.png')
  charrun2left = loadImage('images/character/charrun2/charrunleft2.png')
  charjumpcharge = loadImage('images/character/charjumpcharge/charjumpcharge.png')
  song = loadSound('sounds/of.mp3')
  song2 = loadSound('sounds/shovelknight.mp3')
  song3 = loadSound('sounds/iceMusic.mp3')
  walking_sound = loadSound('sounds/walking.mp3')
  hit1 = loadSound('sounds/hit1.wav')
  hit2 = loadSound('sounds/hit2.wav')
  hit3 = loadSound('sounds/hit3.mp3')
}

function draw() {
  sound()
	//background_images = [
  //new Background(0,0,width,height, block_image, 1800, 3000, character_height),
  //new Background(0,0,width,height, backgroundimg, 0, 1800, character_height)
  //]

  
  if (game_state == "startscreen"){
    background(charstandardright);
  }

  if (game_state == "pause"){
    background(block_image);
  }
  
  if (game_state == "game"){
    //background(backgroundimg);
    //background_image.draw();
    background_images.forEach(b => b.draw())
    
    
    
    blocks.forEach(b => b.draw())
    character.jump_walk()
    character.draw();
    background_images.forEach(b => text(b.y, 100,100,100))
    character_height = Math.floor(blocks[4].y) + 350
    if (character_height < 0){
      character_height = 0
    }
  
    //code to set a win height character has to reach, currently arbitrarily high so the game still works
    if (character_height >= 63000000 && character.collision == "bottom"){
      game_state = "won"
    }
    fill(50)
    text("height: " + character_height, 50, 70);
  }

  if (game_state == "won"){
    background(block_ice_image);
  }

  //text(character.v_hor, 100, 70)
  
  
}


function sound(){
  if (game_state == "game" || game_state == "pause"){
    song.setVolume(0.2)
    song2.setVolume(0.2)
    song3.setVolume(0.4)
    
    if (character_height < 1800 && song.isPlaying() == false){
      song2.stop()
      song3.stop()
      //song.loop()
    } else if (character_height >= 1800 && character_height < 5900 && song2.isPlaying() == false){
      song.stop()
      song3.stop()
      //song2.loop()
    } else if (character_height >= 5900 && song3.isPlaying() == false){
      song.stop()
      song2.stop()
      //song3.loop()
    }
  
    
    if (walking_sound.isPlaying() == false && character.walking == true){
      walking_sound.setVolume(2)
      walking_sound.play()
    } else if (walking_sound.isPlaying() == true && character.walking == false){
      walking_sound.stop()
    }
  
    this_collision = character.collision
    if (this_collision == "bottom" && prev_collision == false){
      hit1.play()
    }
    prev_collision = character.collision
  }
  

  
}


function keyPressed(){
  

  if (game_state == "startscreen"){
    game_state = "game"
  }

  if (game_state == "game" && keyCode == 80){
    game_state = "pause"
  } else if (game_state == "pause" && keyCode == 80){
    game_state = "game"
  }
}


function keyReleased(){
  if (keyCode == 32 && character.collision == "bottom"){
    if (character.jump_time > max_jump_height){
      blocks.forEach(b => b.v_ver = -max_jump_height)
      //background_images.forEach(b => b.v_ver = -max_jump_height)
    } else if (character.jump_time < min_jump_height) {
      blocks.forEach(b => b.v_ver = -min_jump_height)
      //background_images.forEach(b => b.v_ver = -min_jump_height)
    } else {
      blocks.forEach(b => b.v_ver = -character.jump_time)
      //background_images.forEach(b => b.v_ver = -character.jump_time)
    }
    character.jump_time = 0
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      character.v_hor -= ver_jump_speed
      if (character.v_hor <= -10){
        character.v_hor = -max_v_hor
      }
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      character.v_hor += ver_jump_speed
      if (character.v_hor >= 10){
        character.v_hor = max_v_hor
      }
    }
    character.collision = false
  }
}




function checkCollision(){   

  colliding = false;
  block_type = "none"

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
            block_type = block.type      
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

  return [colliding, block_type];
}



function pickImage(){
  block_ver = blocks[1].v_ver
  if(block_ver != 0){
    if(block_ver < 0){
      if (character.v_hor >= 0){
        character.img = charjumpright
	lastdir = right
      } else {
        character.img = charjumpleft
	lastdir = left
      }
    }else if(block_ver > 0){
      if (character.v_hor >= 0){
        character.img = charfallright
	lastdir = right
      } else {
        character.img = charfallleft
	lastdir = left
      }
    }
  } else if (keyIsDown(32)){
    character.img = charjumpcharge
  } else {
    prev_direction = 0
    if(lastdir == right){
	character.img = charstandardright
    }else if(lastdir == left){
	character.img = charstandardleft
    }
  }


  if (character.walking == true){
    frame_counter += 1

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
      if (frame_counter >= 1 && frame_counter <= 10){
        character.img = charrun1right
      } else if (frame_counter >= 11 && frame_counter <= 20){
        character.img = charstandardright
      } else if (frame_counter >= 21 && frame_counter <= 30){
        character.img = charrun2right
      } else if (frame_counter >= 31 && frame_counter <= 40){
        character.img = charstandardright
      }
    }

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)){
      if (frame_counter >= 1 && frame_counter <= 10){
        character.img = charrun1left
      } else if (frame_counter >= 11 && frame_counter <= 20){
        character.img = charstandardleft
      } else if (frame_counter >= 21 && frame_counter <= 30){
        character.img = charrun2left
      } else if (frame_counter >= 31 && frame_counter <= 40){
        character.img = charstandardleft
      }
    }
    
    if (frame_counter >= 40){
      frame_counter = 0
    }
    
  } else {
    frame_counter = 0
  }
}

    
