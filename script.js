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
    this.jump_time_factor = 0.4; //how quickly the jump height increases when holding the space bar down
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
    if (can_move == true){
      this.walking = false
      if (keyIsDown(32) && can_move == true) {
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
  }

  
  
  draw(){
    this.game_state = game_state
    if (this.game_state != "won"){
      pickImage();
    }
    
    fill(this.c)
    //rect(this.x, this.y, this.w, this.h);

    this.img.resize(0,0)
    if (this.img == charjumpcharge){
      image(this.img,this.x, this.y+15, this.w, this.h-15);
    } else if (this.img == charrun1right|| this.img == charrun2right){
      image(this.img,this.x, this.y, this.w+9, this.h);
    } else if (this.img == charrun1left || this.img == charrun2left){
      image(this.img,this.x-9, this.y, this.w+9, this.h);
    } else {
      image(this.img,this.x, this.y, this.w, this.h);
    }
    

    
    this.x += this.v_hor
    
    this.collision_blocktype = checkCollision()
    this.collision = this.collision_blocktype[0]
    this.block_type = this.collision_blocktype[1]
    if (this.collision == "left" || this.collision == "right"){
      if (this.walking == true){
        this.collision = "bottom"
      }
    }
    
    if (this.collision == "top"){
      if (hit3.isPlaying() == false && settings_sound == true){
        hit3.play()
      }
      
    } 
    text(this.collision, 100,100)
    if (this.collision == "bottom"){
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
    if (this.collision == "left" || this.collision == "right"){
      if (this.walking == false){
        
      
        this.v_hor = this.v_hor * -this.bounce
        this.collision = false
        if (this.walking == false && settings_sound == true){
          hit3.play()
        }
      }
    } 
    
    

    if (this.x > width - this.w || this.x < 0 + (this.w)) {
      if (this.x > width - this.w && this.game_state != "won") {
        this.x = width - this.w;
        this.v_hor = this.v_hor * -this.bounce
        if (this.walking == false && settings_sound == true){
          hit3.play()
        }        
      } else if (this.x < 0){
        this.x = 0;
        this.v_hor = this.v_hor * -this.bounce
        if (this.walking == false && settings_sound == true){
          hit3.play()
        }
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
  }  


  draw(){
    fill(this.c)

    if (this.v_ver < this.v_ver_max){
      this.v_ver = this.v_ver + this.a
    } 

    if (this.y + this.h >=0 && this.y <= height){
      this.x_pos = this.x
      this.y_pos = this.y
      for (let i = 0; i < (this.h/25); i++) {
        if (this.type == "standard"){
          if (i == 0){
            this.top = true
          } else if (i == this.h/25 - 1){
            this.top = false
            this.bottom = true
          } else {
            this.bottom = false
            this.top = false
          }
        }
        
        for (let i = 0; i < (this.w/25); i++) {
          if (this.w != 25 && this.h != 25){
            if (i == this.w/25 - 1 && this.top == true){
              this.img = toprightgreen
            } else if (i == 0 && this.top == true){
              this.img = topleftgreen
            } else if (this.top == true){
              this.img = topmid
            } else if (i == this.w/25 -1 && this.bottom == true){
              this.img  = botrightgreen
            } else if (i == 0 && this.bottom == true){
              this.img  = botleftgreen
            } else if (this.bottom == true){
              this.img  = botmid
            } else if (i == 0){
              this.img = midleft
            } else if (i == this.w/25 -1){
              this.img = midright
            } else {
              this.img = midmid
            }
          }

          if (this.h == 25){
            if (i == 0){
              this.img = singularleft
            } else if (i == this.w/25 -1){
              this.img = singularright
            } else {
              this.img = singularxmid
            }
          }
          if (this.w == 25){
            if (this.top == true){
              this.img = singulartop
            } else if (this.bottom == true){
              this.img = singularbot
            } else {
              this.img = singularymid
            }
          }
          
          if (this.type == "ice"){
            this.img = block_ice_image
          }

          if (this.type == "bot"){
            this.img = botright
          }

          if (this.type == "mid"){
            this.img = midmid
          }
          
          
          image(this.img, this.x_pos, this.y_pos, 25, 25)
          this.x_pos += 25
          
        }
      this.x_pos = this.x
      this.y_pos += 25
         
      }
    } else if (this.y + this.h >=0 && this.y <= height) {
      rect(this.x, this.y, this.w, this.h)
    }
    
    this.y -= this.v_ver

    if (character.collision == "top"){
      this.v_ver = 0
    } else if (character.collision == "bottom"){
      this.v_ver = 0
    }

    
  }
}

class Sides{
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
    } else {
      this.img = midmid
    }
  }  


  draw(){
    fill(this.c)
    //rect(this.x, this.y, this.w, this.h)
    if (this.v_ver < this.v_ver_max){
      this.v_ver = this.v_ver + this.a
    } 

    if (this.y + this.h >=0 && this.y <= height){
      this.x_pos = this.x
      this.y_pos = this.y
     
      for (let i = 0; i < (this.h/25); i++) {
        if (i == 0){
          this.img = topmid
          this.top = true
        } else {
          this.img = midmid
          this.top = false
        }
        
      for (let i = 0; i < (this.w/25); i++) {
        if (i == this.w/25 - 1 && this.top == false && this.type != "right"){
          this.img = midright
          image(this.img, this.x_pos, this.y_pos, 25, 25)
        } else if (i == this.w/25 - 1 && this.top == true && this.type != "right"){
          this.img = topright
          image(this.img, this.x_pos, this.y_pos, 25, 25)
        } else if (i == 0 && this.top == false && this.type != "left"){
          this.img = midleft
          image(this.img, this.x_pos, this.y_pos, 25, 25)
        } else if (i == 0 && this.top == true && this.type != "left"){
          this.img = topleft
          image(this.img, this.x_pos, this.y_pos, 25, 25)
        } else if (this.top == true){
          this.img = topmid
          image(this.img, this.x_pos, this.y_pos, 25, 25)
        } else {
          this.img = midmid
          image(this.img, this.x_pos, this.y_pos, 25, 25)
        }
        
        this.x_pos += 25
          
      }
      this.x_pos = this.x
      this.y_pos += 25
         
      }
    } else if (this.y + this.h >=0 && this.y <= height) {
      rect(this.x, this.y, this.w, this.h)
    }
    
    this.y -= this.v_ver
    

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
    } else if (this.character_height <= this.start_height){
      this.y = (this.character_height - this.start_height)
    } else if (this.character_height <= 200 && this.character_height > 0){
      this.start_height = 200
    } else {
      this.y = 0
    }
    
    image(this.img, this.x, this.y, width, this.h)

  }
  
}

class snowflake {
  constructor(){
    this.start_height = 6150
    this.end_height = 10550
    this.posY = 0;
    this.splice_height = height
    this.initialangle = random(0, 2 * PI);
    this.size = random(2, 5);
    this.character_height = character_height
    if (this.character_height >= this.end_height){
      this.posY = (this.character_height - this.end_height)
      this.spawn_height = (this.character_height - this.end_height)
    } 
    // radius of snowflake spiral
    // chosen so the snowflakes are uniformly spread out in area
    this.radius = sqrt(random(pow(width / 2, 2)));
  }
  

  update(time) {
    this.character_height = character_height
    if (this.character_height <= this.start_height){
      this.splice_height = height + (this.character_height - this.start_height)
    }

    if (this.character_height >= this.end_height){
      this.spawn_height = (this.character_height - this.end_height)
    } else {
      this.spawn_height = 0
    }
    
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);
    if (this.posY > this.splice_height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  display(){
    if (this.posY > this.spawn_height){
      ellipse(this.posX, this.posY, this.size);
    }
    
  };
}

class Msc{
  constructor (x, y, w, h, color, type){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.c = color;
    this.type = type;
    this.v_ver = 0
    this.v_ver_max = 15
    this.a = 0.33
    this.collision = false
  }  


  draw(){
    if (this.v_ver < this.v_ver_max){
      this.v_ver = this.v_ver + this.a
    } 

    
    fill(this.c)
    //rect(this.x, this.y, this.w, this.h)
    if (this.type == "banner"){
      this.img = banner
    } else if (this.type == "lampleft"){
      this.img = lampleft
    } else if (this.type == "lampright"){
      this.img = lampright
    } else if (this.type == "fence"){
      this.img = fence
    } else if (this.type == "rock2"){
      this.img = rock2
    } else if (this.type == "bookshelf"){
      this.img = bookshelf
    } else if (this.type == "table1"){
      this.img = table1
    } else if (this.type == "table2"){
      this.img = table2
    } else if (this.type == "table3"){
      this.img = table3
    } else if (this.type == "chairright"){
      this.img = chairright
    } else if (this.type == "well"){
      this.img = well
    }
    
    if (this.y + this.h >=0 && this.y <= height){
      image(this.img, this.x, this.y, this.w, this.h)
    } else if (this.y + this.h >=0 && this.y <= height) {
      rect(this.x, this.y, this.w, this.h)
    }
    
    this.y -= this.v_ver
    if (character.collision == "top"){
      this.v_ver = 0
    } else if (character.collision == "bottom"){
      this.v_ver = 0
    }
  }
}

class Greenery{
  constructor (x, y, w, h, color, type, start_height){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.c = color;
    this.type = type;
    this.start_height = start_height
    this.y = this.start_height
    
  }  


  draw(){
    
    fill(this.c)
    //rect(this.x, this.y, this.w, this.h)
    if (this.type == "grasstop"){
      this.img = grass
    } else if (this.type == "rock2"){
      this.img = rock2
    } else if (this.type == "railing1"){
      this.img = railing1
    } else if (this.type == "railing2"){
      this.img = railing2
    } else if (this.type == "railing2r"){
      this.img = railing2r
    } 
      
    if (this.y + this.h >=0 && this.y <= height){
      image(this.img, this.x, this.y, this.w, this.h)
    } else if (this.y + this.h >=0 && this.y <= height) {
      rect(this.x, this.y, this.w, this.h)
    }
    this.character_height = character_height
    this.y = this.start_height + character_height
        
    
    
    
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
can_move = true
moving_x = 0
animation_timer = 200
//animation_timer = 0
saved_x = 300
saved_height = 0
soundeffects = "on"
music = "on"
info_displayed = false
animation_done = false
settings_music = true
settings_sound = true
settings_grey = false
settings_wheather = true
origin_menu = "start"
iceboard = true
win_height = 13500
ending_timer = 0
fade1 = 0
fade2 = 0
fade3 = 0



function setup() {
  createCanvas(1000, 500)
  noStroke()
  snowflakes = []
  
  if (localStorage.getItem('player_height') != null){
    saved_x = Math.floor(localStorage.getItem('player_x'))
    saved_height = localStorage.getItem('player_height')
  }
  if (saved_height > 11000){
    animation_timer = 0
  }

  
  //character = new Character(saved_x,250,50,50, "white", charstandardright)
  character = new Character(445,250,50,50, "white", charstandardright)
  
  blocks = [  
  
  new Block(375,(height-250),300,50, "white"), 
  new Block(575,(height-400),50,25, "white"),
  new Block(225,(height-200),50,200, "white"),
  new Block(225,(height-650),100,50, "white"),
  new Block(675,(height-650),100,50, "white"),
  new Block(225,(height-950),200,150, "white"),
  new Block(675,(height-1000),25,100, "white"),
  new Block(425,(height-1300),25,150, "white"),
  new Block(625,(height-1250),150,50, "white"),
  new Block(350,(height-1600),100,50, "white"),
  new Block(0,(height-1800),375,50, "white"),
  new Block(525,(height-1800),475,50, "white"),
  new Msc(153, (height-1850), 50, 50, "white", "table1"),
  new Msc(203, (height-1850), 50, 50, "white", "table2"),
  new Msc(253, (height-1850), 50, 50, "white", "table3"),
  new Msc(275, (height-125), 16, 25, "white", "lampleft"),
  new Msc(625, (height-40), 150, 40, "white", "fence"),
  new Msc(225, (height-725), 16, 25, "white", "lampleft"),
  new Msc(759, (height-725), 16, 25, "white", "lampright"),
  new Msc(25, (height-1944), 128, 144, "white", "bookshelf"),
  new Msc(850, (height-1864), 46, 64, "white", "chairright"),
  //na de eerste checkpoint (wanneer het scherm breeder wordt)
  new Block(0, (height-1950), 25, 150, "white"),
  new Block(975, (height-2150), 25, 350, "white"),
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
  new Msc(100, (height-3600), 100, 100, "white", "well"),
  new Block(850,(height-3700),150,50, "white"),
  new Block(450, (height -3525), 100, 25, "white"),
  //new Block(425, (height-3525), 25, 25, "white", "mid"),
  new Block(475,(height-3900),50,50, "white"),
  new Block(525, (height-3875), 25, 25, "white", "bot"),
  new Block(0,(height-4100),50, 600, "white"),
  new Block(475,(height-4300),50,50, "white"),
  new Block(750,(height-4500),250,50, "white"),
  new Block(650,(height-5550),50,925, "white"),//lange veri rechts
  new Block(0,(height-4675),650,50, "white"), //lange hori onder
    
  new Msc(250, (height-4625),50, 100, "white", "banner"),
  
  new Block(850,(height-4750),50,50, "white"),
  new Block(850,(height-4900),50,50, "white"),
  new Block(850,(height-5100),50,50, "white"),
  new Block(850,(height-5350),50,50, "white"),
  new Block(500,(height-5750),50,950, "white"),// lange veri links
  new Block(550,(height-5750),450,50, "white"), // lange hori boven
  //na de derde checkpoint (wanneer je een stukje naarbeneden moest vallen)
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
  //na de vierde checkpoint (wanner het ice stuk begint)
  new Block(0,(height-5950),700,25, "white", "ice"),
  new Block(850,(height-5950),150,25, "white", "ice"),
  new Block(0,(height-6100),200,25, "white", "ice"),
  new Block(700,(height-6300),200,25, "white", "ice"),
  new Block(600,(height-6550),200,25, "white", "ice"),
  new Block(0,(height-6750),200,25, "white", "ice"),
  new Block(800,(height-6950),200,25, "white", "ice"),
  new Block(0,(height-7050),300,25, "white", "ice"),
  new Block(100,(height-7300),200,25, "white", "ice"),
  new Block(200,(height-7550),100,25, "white", "ice"),
  new Block(200,(height-7750),800,25, "white", "ice"),
  //moeilijker ijsstuk
  new Block(700,(height-7950),100,25, "white", "ice"),
  new Block(100,(height-8150),150,25, "white", "ice"),
  new Block(900,(height-8250),100,25, "white", "ice"),
  new Block(450,(height-8550),150,25, "white", "ice"),
  new Block(50,(height-8750),100,25, "white", "ice"),
  new Block(600,(height-8950),125,25, "white", "ice"),
  new Block(0,(height-9150),600,25, "white", "ice"),
  new Block(725,(height-9150),350,25, "white", "ice"),
  //laatste ijsstuk
  new Block(0,(height-9300),150,25, "white", "ice"),
  new Block(750,(height-9500),100,25, "white", "ice"),
  new Block(650,(height-9750),100,25, "white", "ice"),
  new Block(0,(height-9950),100,25, "white", "ice"),
  new Block(850,(height-10150),150,25, "white", "ice"),
  new Block(0,(height-10250),150,25, "white", "ice"),
  new Block(750,(height-10450),100,25, "white", "ice"),
  new Block(700,(height-10700),100,25, "white", "ice"),
  new Block(300,(height-10700),100,25, "white", "ice"),
  new Block(150,(height-10900),850,50, "white"),
  new Block(0,(height-10700),150,50, "white"),
  //laatste level
    //dit eerste block moet later weggehaald worden, de animatie weer aan en gamestate op startscreen
  //new Block(0,(height-10900),150,50, "white"),
  new Block(200,(height-11450),25,350, "white"),
  new Block(775,(height-11475),25,375, "white"),
  new Block(750,(height-11500),50,25, "white"),
  new Block(725,(height-11200),50,25, "white"),
  new Block(200,(height-11750),25,200, "white"),
  new Block(225,(height-11750),100,50, "white"),
  new Block(200,(height-11900),125,50, "white"),
  new Block(200,(height-12375),25,325, "white"),
  new Block(200,(height-12400),50,25, "white"),
  new Block(775,(height-12200),25,500, "white"),
  new Block(700,(height-12200),75,25, "white"),
  new Block(0,(height-12400),25,50, "white"),
  new Block(500,(height-12600),50,25, "white"),
  new Block(775,(height-13200),25,625, "white"),
  new Block(200,(height-13300),25,550, "white"),
  new Block(725,(height-12600),50,25, "white"),
  new Block(225,(height-12900),100,50, "white"),
  new Block(675,(height-13200),100,25, "white"),
  new Block(00,(height-13300),200,25, "white"),
  new Block(300,(height-13300),100,25, "white"),
  new Block(200,(height-13500),1200, 25, "white"),
  
  //deze blokken vormen de muren en ondergrond in het eerste stuk
  new Sides(775,(height-1800),225,2200, "black", "right"),
  new Sides(0,(height-1800),225,2200, "black", "left"),
  new Sides(225,height,550,400, "black", "bottom"),
  
  ]

  greenery = [
    new Greenery(275,10,25, 25, "white", "grasstop", (height-215)),
    new Greenery(721, 10, 54, 24, "white", "rock2", (height-224)),
    new Greenery(450,0, 50, 25, "white", "railing1", (height-3750)),
    //new Greenery(425,0, 25, 50, "white", "railing2", (height-3775)),
    new Greenery(425,0, 25, 50, "white", "railing2", (height-3750)),
    new Greenery(500,0, 50, 25, "white", "railing1", (height-3750)),
    new Greenery(850,0, 50, 25, "white", "railing1", (height-3925)),
    new Greenery(900,0, 50, 25, "white", "railing1", (height-3925)),
    new Greenery(950,0, 50, 25, "white", "railing1", (height-3925)),
    new Greenery(475,0, 50, 25, "white", "railing1", (height-4125)),
    //new Greenery(450,0, 25, 50, "white", "railing2r", (height-4150))
    new Greenery(525,0, 25, 50, "white", "railing2r", (height-4125)),
    new Greenery(0,0, 50, 25, "white", "railing1", (height-4325))
  ]
  
  
  if (saved_height > 11000){
    blocks.push(new Block(0,(height-10900),150,50, "white"))
  }

  background_images = [
    new Background(0,0,width,height, backgroundimgend, 14000, 100000, character_height),
    new Background(0,0,width,height, backgroundimg4, 11400, 13500, character_height),
    new Background(0,0,width,height, backgroundimg3, 6425, 10900, character_height),
    new Background(0,0,width, height, backgroundimg, 3950, 5925, character_height),
    new Background(0,0,width,height, backgroundimg, 2300, 3450, character_height),
    new Background(0,0, width,height, bot3, 300, 1800, character_height)
  ]
  


  //blocks.forEach(b => b.y += (saved_height-200))
  blocks.forEach(b => b.y += 3600)
} 

function preload(){
  //block en background images
  backgroundimg = loadImage('images/background/dungeon_background.jpg')
  backgroundimg2 = loadImage('images/background/dungeonbackground4.png')
  backgroundimg3 = loadImage('images/background/icedungeonbackground.jpg')
  backgroundimg4 = loadImage('images/background/test.jpg')
  backgroundimgend = loadImage('images/background/endimage.png')
  block_image = loadImage("images/block/blockimg3.png")
  block_ice_image = loadImage("images/block/ice.jpeg")
  ice_board = loadImage('images/block/bord.png')
  bot = loadImage('images/background/2.png')
  bot2 = loadImage('images/background/2.png')
  bot3 = loadImage('images/background/2.png')
//  cave = loadImage('images/background/cave.png')
  //characterimages
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
  //menu images
  menu1 = loadImage('images/menu/menu1.png')
  menu1_1 = loadImage('images/menu/menu1_1.png')
  menu1_2 = loadImage('images/menu/menu1_2.png')
  menu1_3 = loadImage('images/menu/menu1_3.png')
  menu2 = loadImage('images/menu/menu2.png')
  menu2_1 = loadImage('images/menu/menu2_1.png')
  menu2_2 = loadImage('images/menu/menu2_2.png')
  menu2_3 = loadImage('images/menu/menu2_3.png')
  menu2_4 = loadImage('images/menu/menu2_4.png')
  menu2_5 = loadImage('images/menu/menu2_5.png')
  menu3 = loadImage('images/menu/menu3.png')
  menu3_1 = loadImage('images/menu/menu3_1.png')
  menu4 = loadImage('images/menu/menu4.png')
  menu4_1 = loadImage('images/menu/menu4_1.png')
  menu4_2 = loadImage('images/menu/menu4_2.png')
  menu4_3 = loadImage('images/menu/menu4_3.png')
  //miscellaneous images
  banner = loadImage('images/block/banner.png')
  grass = loadImage('images/block/grass.png')
  lampleft = loadImage('images/block/lampleft.png')
  lampright = loadImage('images/block/lampright.png')
  fence = loadImage('images/block/fence_2.png')
  rock2 = loadImage('images/block/rock_2.png')
  bookshelf = loadImage('images/block/bookshelf1.png')
  table1 = loadImage('images/block/table1.png')
  table2 = loadImage('images/block/table2.png')
  table3 = loadImage('images/block/table3.png')
  chairright = loadImage('images/block/chairright.png')
  well = loadImage('images/block/well.png')
  railing1 = loadImage('images/block/railing.png')
  railing2 = loadImage('images/block/railing2.png')
  railing2r = loadImage('images/block/railing2r.png')
  //grasstile images
  //grass = loadImage('images/block/grassdirttile.png')
  //dirt = loadImage('images/block/dirttile.png')
  //stonetile images
  stone = loadImage('images/block/stonetile/stone2.png')
  stonetile = loadImage('images/block/stonetile/stonetile.png')
  stonetileleft = loadImage('images/block/stonetile/stonetileleft.png')
  stonetileleftcorner = loadImage('images/block/stonetile/stonetileleftcorner.png')
  stonetileright = loadImage('images/block/stonetile/stonetileright.png')
  stonetilerightcorner = loadImage('images/block/stonetile/stonetilerightcorner.png')
  stonetiletop = loadImage('images/block/stonetile/stonetiletop.png')
  tilemid = loadImage('images/block/stonetile/tilemid.png')
  //stonetile new images
  topleft = loadImage('images/block/stonetilenew/stonetiletopleft.png')
  topmid = loadImage('images/block/stonetilenew/stonetiletopmid.png')
  topright = loadImage('images/block/stonetilenew/stonetiletopright.png')
  midleft = loadImage('images/block/stonetilenew/stonetilemidleft.png')
  midmid = loadImage('images/block/stonetilenew/stonetilemidmid.png')
  midright = loadImage('images/block/stonetilenew/stonetilemidright.png')
  botleft = loadImage('images/block/stonetilenew/stonetilebotleft.png')
  botmid = loadImage('images/block/stonetilenew/stonetilebotmid.png')
  botright = loadImage('images/block/stonetilenew/stonetilebotright.png')
  //stonetile new images green
  topleftgreen = loadImage('images/block/stonetilenewgreen/stonetiletopleftgreen.png')
  toprightgreen = loadImage('images/block/stonetilenewgreen/stonetiletoprightgreen.png')
  botleftgreen = loadImage('images/block/stonetilenewgreen/stonetilebotleftgreen.png')
  botrightgreen = loadImage('images/block/stonetilenewgreen/stonetilebotrightgreen.png')
  //singular stonetile images
  singularleft = loadImage('images/block/stonetile/stonetilesingularleft.png')
  singularxmid = loadImage('images/block/stonetile/stonetilesingularxmid.png')
  singularright = loadImage('images/block/stonetile/stonetilesingularright.png')
  singulartop = loadImage('images/block/stonetile/stonetilesingulartop.png')
  singularymid = loadImage('images/block/stonetile/stonetilesingularymid.png')
  singularbot = loadImage('images/block/stonetile/stonetilesingularbot.png')
  //song and sfx
  song = loadSound('sounds/songs/level1Music.mp3')
  song2 = loadSound('sounds/songs/level2Music.mp3')
  song3 = loadSound('sounds/songs/iceMusic.mp3')
  song4 = loadSound('sounds/songs/level4Music.mp3')
  song_menu = loadSound('sounds/songs/menuMusic.mp3')
  songend = loadSound('sounds/songs/endMusic.mp3')
  walking_sound = loadSound('sounds/walking.mp3')
  walking_sound_ice = loadSound('sounds/walking_snow.mp3')
  hit1 = loadSound('sounds/hit1.wav')
  hit2 = loadSound('sounds/hit2.wav')
  hit3 = loadSound('sounds/hit3.mp3')
  slam = loadSound('sounds/slam.m4a')
  last_dir = charstandardright
  
}

function draw() {
  sound()
  if (game_state == "startscreen"){
    background(menu1);
    if(mouseX > 400 && mouseX < 600){
      if(mouseY > 230 && mouseY < 290){
        background(menu1_1)
      } else if (mouseY > 310 && mouseY < 370){
        background(menu1_2)
      } else if (mouseY > 385 && mouseY < 445){
        background(menu1_3)
      }
    }
  }

  if (game_state == "pause"){
    image(menu4, 0, 0);
    if(mouseX > 400 && mouseX < 585){
      if(mouseY > 180 && mouseY < 235){
        image(menu4_1, 0, 0)
      } else if (mouseY > 255 && mouseY < 315){
        image(menu4_2, 0, 0)
      } else if (mouseY > 330 && mouseY < 390){
        image(menu4_3, 0, 0)
      } 
    }
  }

  if (game_state == "settings"){
    image(menu2, 0, 0);
    if(mouseX > 80 && mouseX < 115){
      if(mouseY > 380 && mouseY < 465){
        image(menu2_1, 0, 0)
      }
    }
    if(settings_music){
      image(menu2_2, 124, 303)
    }
    if(settings_sound){
      image(menu2_3, 124, 376)
    }
    if(settings_grey){
      image(menu2_4, 523, 303)
    }
    if(settings_wheather){
      image(menu2_5, 523, 376)
    }
  }

  if (game_state == "credits"){
    background(menu3);
    if(mouseX > 130 && mouseX < 190){
      if(mouseY > 360 && mouseY < 375){
        background(menu3_1)
      }
    }
  }

  if (game_state == "information"){
    image(ice_board, 0, 0)
  }
  
  if (game_state == "game"){
    background_images.forEach(b => b.draw())
    if (saved_height < 11000){
      blockAnimation()
    }
    
    progressStorage()
    mechanicsInfo()
    
    
    blocks.forEach(b => b.draw())
    
    if (can_move == true){
      character.jump_walk()
    }
    character.draw()
    
    character_height = Math.floor(blocks[4].y) + 350
    if (character_height < 0){
      character_height = 0
    }
    greenery.forEach(b => b.draw())
    
    if (settings_wheather == true && character_height >= 5650 && character_height <= 11100){
      let t = frameCount / 60; // update time
      for (let i = 0; i < random(5); i++) {
        snowflakes.push(new snowflake()); // append snowflake object
      }
      // loop through snowflakes with a for..of loop
      for (let flake of snowflakes) {
        flake.update(t); // update snowflake position
        flake.display(); // draw snowflake
      }
    }    
  
    //code voor win height, moet wanneer de levels af zijn aangepast worden naar de juiste hoogte
    if (character_height >= (win_height - 1) && character.collision == "bottom"){
      game_state = "won"
    }
    fill(200)
    textSize(32)
    textStyle(NORMAL)
    text("height: " + character_height + "/" + win_height, 25, 70);

  }

  if (game_state == "won"){
    can_move = false

    ending_timer += 1
    
    background_images.forEach(b => b.draw())
    character.img = charstandardright
    
    if (ending_timer > 120 && character.x < 600){
      character.v_hor = 1.5
      frame_counter += 1
      if (frame_counter >= 1 && frame_counter <= 20){
        character.img = charrun1right
      } else if (frame_counter >= 21 && frame_counter <= 40){
        character.img = charstandardright
      } else if (frame_counter >= 41 && frame_counter <= 60){
        character.img = charrun2right
      } else if (frame_counter >= 61 && frame_counter <= 80){
        character.img = charstandardright
      }
      if (frame_counter >= 80){
        frame_counter = 0
      }
    }
    
    if (ending_timer > 300 && ending_timer <= 1000){
      blocks.forEach(b => b.y += 1)
      character.y += 1
    }
    if (ending_timer >= 600 && fade1 <= 255){
      fade1 += 5
    }
    if (ending_timer >= 720 && fade2 <= 255){
      fade2 += 5
    }
    if (ending_timer >= 840 && fade3 <= 255){
      fade3 += 5
    }
    textSize(50)
    fill(0, fade1)
    text("You escaped the dungeon", 150, 150)
    fill(0, fade2)
    text("Free, finally", 150, 225)
    fill(0, fade3)
    text("Press Esc to return to title screen", 150, 300)
    
    blocks.forEach(b => b.draw())
    character.draw();
    character_height = Math.floor(blocks[4].y) + 350
    
  }
  
  if (settings_grey){
    filter(GRAY)
  }
  
}

function mousePressed() {
  if(mouseX > 400 && mouseX < 600 && game_state == "startscreen"){
    if(mouseY > 230 && mouseY < 290){
      game_state = "game"
    }else if(mouseY > 310 && mouseY < 370){
      game_state = "settings"
      if(origin_menu == "pause"){
        origin_menu = "start"
      }
    }else if(mouseY > 385 && mouseY < 445){
      game_state = "credits"
    }
  }
  if(mouseX > 130 && mouseX < 190 && game_state == "credits"){
    if(mouseY > 360 && mouseY < 375){
      game_state = "startscreen"
    }
  }
  if(mouseX > 80 && mouseX < 115 && game_state == "settings"){
    if(mouseY > 380 && mouseY < 465){
      if(origin_menu == "start"){
        game_state = "startscreen"
      } else if(origin_menu == "pause"){
        background_images.forEach(b => b.draw())
        blocks.forEach(b => b.draw())
        character.draw();
        game_state = "pause"
      
      }
      
    }
  }

  if (game_state == "settings"){
    if(mouseX > 365 && mouseX < 385){
      if(mouseY > 305 && mouseY < 325){
        if(settings_music == true){
          settings_music = false
        }else{
          settings_music = true
        }
      } 
    }
    if(mouseX > 365 && mouseX < 385){
      if(mouseY > 380 && mouseY < 400){
        if(settings_sound == true){
          settings_sound = false
        }else{
          settings_sound = true
        }
      }
    }
    if(mouseX > 765 && mouseX < 785){
      if(mouseY > 305 && mouseY < 325){
        if(settings_grey == true){
          settings_grey = false
        }else{
          settings_grey = true
        }
      }
    }
    if(mouseX > 765 && mouseX < 785){
      if(mouseY > 380 && mouseY < 400){
        if(settings_wheather == true){
          settings_wheather = false
        }else{
          settings_wheather = true
        }
      }
    }
  }
  if(mouseX > 400 && mouseX < 585 && game_state == "pause"){
    if(mouseY > 180 && mouseY < 235){
      game_state = "game"
    } else if (mouseY > 255 && mouseY < 315){
      game_state = "settings"
      if(origin_menu == "start"){
        origin_menu = "pause"
      }
    } else if (mouseY > 330 && mouseY < 390){
      game_state = "startscreen"
    } 
  }
}

function keyPressed(){
  if (game_state == "information" && keyCode == 27){
    game_state = "game"
    info_displayed = true
  } else if(game_state == "game" && keyCode == 27){
    game_state = "pause"
  } else if (game_state == "pause" && keyCode == 27){
    game_state = "game"
    frompause = "true"
  }
  if (game_state == "settings" && keyCode == 27) {
    if(origin_menu == "start"){
      game_state = "startscreen"
    } else if(origin_menu == "pause"){
      game_state = "game"
    }
    
  }
  if (game_state == "credits" && keyCode == 27 && fade3 > 0) {
    game_state = "startscreen"
  }

  if (game_state == "won" && keyCode == 27 && fade3 > 0){
    reset()
  }
  
}

function sound(){

  if (settings_music == true){
    if (game_state == "startscreen" || game_state == "credits" || game_state == "settings"){
      if (song_menu.isPlaying() == false){
        song.stop()
        song2.stop()
        song3.stop()
        song4.stop()
        song_menu.loop()
      }
      
      
    }

    if (game_state == "pause"){
      song.stop()
      song2.stop()
      song3.stop()
      song4.stop()
      songend.stop()  
    } else if (game_state == "game"  || game_state == "information" || game_state == "won"){
      song.setVolume(0.5)
      song2.setVolume(0.5)
      song3.setVolume(0.5)
      song4.setVolume(0.5)
      songend.setVolume(0.5)
    
      if (character_height < 1799 && song.isPlaying() == false){
        song_menu.stop()
        song2.stop()
        song3.stop()
        song4.stop()
        songend.stop()
        song.loop()
      } else if (character_height >= 1799 && character_height < 5899 && song2.isPlaying() == false){
        song_menu.stop()
        song.stop()
        song3.stop()
        song4.stop()
        songend.stop()
        song2.loop()
      } else if (character_height >= 5899 && character_height < 10899 && song3.isPlaying() == false){
        song_menu.stop()
        song.stop()
        song2.stop()
        song4.stop()
        songend.stop()
        song3.loop()
      } else if (character_height >= 10899 && character_height < win_height - 1 && song4.isPlaying() == false) {
        song_menu.stop()
        song.stop()
        song2.stop()
        song3.stop()
        songend.stop()
        if (animation_timer == 0){
          song4.loop() 
        }
        //if (frompause == "true"){
         // song4.loop()
         // frompause == "false"
       // }
      } else if (game_state == "won" && songend.isPlaying() == false){
        song_menu.stop()
        song.stop()
        song2.stop()
        song3.stop()
        song4.stop()
        songend.loop()
      }
    }    
  } else {
    song.stop()
    song2.stop()
    song3.stop()
    song4.stop()
    songend.stop()
    song_menu.stop()
    
  }
  if (settings_sound == true){
    if (game_state == "game" || game_state == "pause"){    
      if (walking_sound.isPlaying() == false && walking_sound_ice.isPlaying() == false && character.walking == true){
        walking_sound.setVolume(2)
        walking_sound_ice.setVolume(0.4)
        if (character.block_type == "ice"){
          walking_sound_ice.play()
        } else {
          walking_sound.play()
        }
        
      } else if (walking_sound.isPlaying() == true && character.walking == false){
        walking_sound.stop()
      } else if (walking_sound_ice.isPlaying() == true && character.walking == false){
        walking_sound_ice.stop()
      }
    
      this_collision = character.collision
      if (this_collision == "bottom" && prev_collision == false){
        hit1.play()
      }
      prev_collision = character.collision
    }
  }

  
}
   
function pickImage(){
  if (character.v_hor > 0){
    last_dir = charstandardright
  } else if (character.v_hor < 0){
    last_dir = charstandardleft
  }
  
  block_ver = blocks[1].v_ver
  if(block_ver != 0){
    if(block_ver < 0){
      if (character.v_hor >= 0){
        character.img = charjumpright
      } else {
        character.img = charjumpleft
      }
    }else if(block_ver > 0){
      if (character.v_hor >= 0){
        character.img = charfallright
      } else {
        character.img = charfallleft
      }
    }
  } else if (keyIsDown(32) && can_move == true){
    character.img = charjumpcharge
  } else {
	  character.img = last_dir
  }


  if (character.walking == true){
    frame_counter += 1

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) || game_state == "won"){
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

function blockAnimation(){
  moving_block = new Block(0,(height-moving_x),150,50, "white")
  
  
  if (character_height >= 10899 && character_height <= 10900 && animation_timer > 0 && animation_done == false){
    can_move = false
    animation_timer -= 1
    moving_x += 1
    moving_block.draw()
    if (animation_timer == 10){
      slam.setVolume(10)
      slam.play()
    }
  } else if (animation_timer == 0) {
    blocks.push(moving_block)
    animation_timer -= 1
    animation_done = true
    can_move = true
  }
}





function mechanicsInfo(){
  if(character_height <= 5950 && character_height >= 5949 && info_displayed == false){
    game_state = "information"
  }
}

function keyReleased(){
  if (keyCode == 32 && character.collision == "bottom" && can_move == true){
    if (character.jump_time > max_jump_height){
      blocks.forEach(b => b.v_ver = -max_jump_height)
    } else if (character.jump_time < min_jump_height) {
      blocks.forEach(b => b.v_ver = -min_jump_height)
    } else {
      blocks.forEach(b => b.v_ver = -character.jump_time)
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

function progressStorage (){
  if (game_state == "game" && character.collision == "bottom"){
    localStorage.setItem('player_x', character.x);
    localStorage.setItem('player_height', character_height);
    saved_x = localStorage.getItem('player_x');
    saved_height = localStorage.getItem('player_height');
  }
}

function reset(){
  
  //de volgende dingen moeten gereset worden wanneer de game gehaald is: saved_x, saved_height, ending_timer, can_move, fade1, fade2, fade3
  localStorage.setItem('player_x', 300);
  localStorage.setItem('player_height', 0);
  hit = false,
  max_jump_height = 15, min_jump_height = 1 //min and max height the character can jump
  ver_jump_speed = 7.5 //speed when jumping vertically
  max_v_hor = 10 //max horizontal jumping speed on ice
  frame_counter = 0
  character_height = 0
  game_state = "startscreen"
  prev_collision = "false"
  this_vver = 0
  can_move = true
  moving_x = 0
  animation_timer = 200
  //animation_timer = 0
  character_height = 0
  saved_x = 300
  //saved_height = 0
  soundeffects = "on"
  music = "on"
  info_displayed = false
  animation_done = false
  settings_music = true
  settings_sound = true
  settings_grey = false
  settings_wheather = true
  origin_menu = "start"
  iceboard = true
  win_height = 13500
  ending_timer = 0
  fade1 = 0
  fade2 = 0
  fade3 = 0
  setup()
 
}