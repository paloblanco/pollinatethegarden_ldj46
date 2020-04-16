// Game by Palo Blanco Games, 2020
// Rocco Panella
// credit for starting template to Frank Poth 08/13/2017

/*
################
DECLARATIONS
################
*/

var context, controller, rectangle, loop, update, draw, ctx, offCanvas, pixelRatio;
var baseheight, basewidth, basescale, colors;



/*
################
CANVAS SETUP
################
*/

baseheight = 48;
basewidth = 84;
basescale = 6;
targetheight = baseheight*basescale;
targetwidth = basewidth*basescale;
pixelRatio = 1.5;//window.devicePixelRatio;

//OFFSCREEN CANVAS

offCanvas = document.createElement("canvas");
offCanvas.width = basewidth;
offCanvas.height = baseheight;
offCanvas.style.imageRendering = "pixelated";
ctx = offCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

context = document.querySelector("canvas").getContext("2d");
context.canvas.height = targetheight * pixelRatio;
context.canvas.style.height = '${targetheight}px'
context.canvas.width = targetwidth * pixelRatio;
context.canvas.style.width = '${targetwidth}px'
// context.scale(basescale*pixelRatio, basescale*pixelRatio);
context.imageSmoothingEnabled = false;

colors = ["#c7f0d8", "#43523d"];


/*
################
PRINTING SPRITE FONT
################
*/

// FIX SPRITE SHEET
var font_sheet = new Image();
font_sheet.src = "data/pico8_font_nokia.png";

var print = function(str, x, y) {
  str = str.toUpperCase();
  for (let ii=0; ii < str.length; ii++) {
    let xsheet, ysheet;
    let char = str[ii].charCodeAt(0);
    if (char < 65) {
      ysheet = 24;
      xsheet = (char - 48)*8;
    } else {
      ysheet = 48 + 8*Math.floor((char - 64)/16);
      xsheet = ((char - 64)%16)*8;
    };
    ctx.drawImage(font_sheet,xsheet,ysheet,8,8,x+4*ii,y,8,8);
  }
};

//loading other images
var sprite_sheet = new Image();
sprite_sheet.src = "data/phoenix2_nokia.png";

// set up sounds
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
};

var beep = new sound("data/sound_0.wav");

/*
################
CONTROLLER
################
*/

controller = {

left:false,
right:false,
up:false,
down:false,
keyListener:function(event) {
  var key_state = (event.type == "keydown")?true:false;
  switch(event.keyCode) {
    case 37:// left key
      controller.left = key_state;
    break;
    case 38:// up key
      controller.up = key_state;
    break;
    case 39:// right key
      controller.right = key_state;
    break;
    case 40:// down key
      controller.down = key_state;
    break;
  }
}
};

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

/*
################
ENTITY CREATION
################
*/

var currentlevel = 1;
var timer = 0;
// Level array
var levels = {"1": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 17, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "2": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 32, 0, 8, 2, 2, 4, 0, 17, 0, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2], "3": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 17, 2, 2, 0, 0, 0, 0, 0, 0, 8, 2, 3, 4, 0, 0, 0, 0, 0, 0, 5, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3], "4": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 8, 2, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 0, 32, 0, 0, 0, 0, 0, 5, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3], "5": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 17, 2, 2, 0, 0, 0, 0, 0, 0, 8, 2, 3, 4, 18, 18, 18, 18, 18, 18, 5, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3], "6": [0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 8, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 18, 0, 0, 18, 0, 0, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "7": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 0, 0, 0, 6, 0, 0, 0, 5, 4, 0, 0, 0, 0, 6, 0, 0, 0, 5, 4, 0, 0, 0, 0, 19, 0, 0, 0, 5, 4, 32, 0, 20, 0, 19, 0, 17, 0, 5, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3], "8": [0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 32, 0, 0, 0, 0, 0, 0, 19, 17, 2, 2, 0, 0, 0, 0, 0, 0, 8, 2, 3, 4, 18, 0, 20, 0, 0, 18, 5, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3], "9": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 21, 21, 21, 21, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], "10": [0, 0, 0, 0, 0, 19, 0, 0, 19, 0, 32, 0, 0, 0, 0, 19, 0, 17, 19, 0, 2, 2, 21, 21, 21, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 20, 0, 0, 0, 0, 0, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3], "11": [32, 0, 0, 0, 0, 0, 0, 5, 3, 3, 8, 0, 0, 0, 0, 0, 0, 5, 3, 3, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 18, 18, 18, 18, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3], "12": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 9, 0, 0, 0, 5, 0, 0, 0, 0, 0, 9, 0, 0, 0, 5, 0, 0, 0, 0, 0, 9, 0, 0, 0, 5, 32, 0, 22, 0, 0, 9, 0, 17, 0, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3], "13": [0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 22, 0, 32, 0, 0, 0, 0, 0, 9, 17, 2, 2, 2, 18, 18, 18, 18, 8, 8, 2, 3, 3, 4, 2, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], "14": [0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 17, 0, 9, 0, 0, 22, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 18, 18, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3], "15": [3, 3, 3, 3, 3, 3, 3, 3, 24, 25, 4, 0, 0, 0, 0, 0, 0, 26, 24, 24, 4, 0, 0, 0, 0, 0, 26, 24, 24, 24, 4, 0, 0, 0, 0, 26, 24, 24, 24, 24, 4, 0, 32, 10, 26, 24, 24, 24, 24, 24, 3, 2, 2, 2, 2, 2, 23, 23, 23, 23], "16": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "17": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "18": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "19": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "20": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "21": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "22": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "23": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "24": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
var mylevel;
var corpselist = [];
var plate = false;
var hitplate = false;

var getblock = function(x,y) {
  let xi = Math.floor((x-2)/8);
  let yi = Math.floor(y/8);
  // let thislevel = levels[currentlevel.toString()];
  let ix = thislevel[xi + yi*10];
  if (ix==19 & plate) {
    ix = 0;
  }
  return ix;
};

var setblock = function(x,y,num) {
  let xi = Math.floor((x-2)/8);
  let yi = Math.floor(y/8);
  // let thislevel = levels[currentlevel.toString()];
  // let ix = thislevel[xi + yi*10];
  thislevel[xi + yi*10] = num;
  return num;
};

var buildlevel = function(lev) {
  let thislevel = levels[currentlevel.toString()];
  for (let i=0; i < thislevel.length; i ++) {
    let ix = thislevel[i];
    if (ix == 32) {
      thislevel[i] = 0;
      phoenix.x = (i%10)*8 + 2;
      phoenix.y = Math.floor(i/10)*8;
    };
  };
  corpselist=[];
  plate = false;
  return thislevel;
};


var phoenix = {
  height:8,
  jumping:true,
  width:8,
  x:0, // center of the canvas
  x_velocity:0,
  x_draw:0,
  y:0,
  y_velocity:0,
  y_draw:0,
  dead: false,
  speed: 1,
  glow: false,
  flash: false,
  flashtime: 0,
  glowtime:0,
};

class corpse {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.y_velocity = 0;
    this.jumping = true;
    this.x_draw = 0;
    this.y_draw = 0;
  }
}


thislevel = buildlevel(currentlevel);

/*
################
UPDATE
################
*/

update = function() {
    
    phoenix.x_velocity = 0;
    
    
    if (!phoenix.dead) {if (controller.up && phoenix.jumping == false) {
        phoenix.y_velocity = -1.2;
        phoenix.jumping = true;
        beep.stop();
        beep.play();
    }

    if (controller.left) {
        phoenix.x_velocity = -0.5;
    }

    if (controller.right) {
        phoenix.x_velocity = 0.5;
    }}

    if (controller.down) {
      if (!phoenix.flash) {
        let acorpse = new corpse(phoenix.x, phoenix.y);
        corpselist.push(acorpse);
        phoenix.dead=false;
        beep.stop();
        beep.play();
        phoenix.flash = true;
        phoenix.flashtime = timer + 10;
        if (phoenix.jumping) {
          phoenix.y_velocity = -1.2;
        };
        if (phoenix.glow) {
          phoenix.glowtime = timer + 3;
          phoenix.glow = false;
          let b1 = getblock(phoenix.x+4+8,phoenix.y+4);
          if (b1 == 9) {
            setblock(phoenix.x+4+8,phoenix.y+4),0;
          }
          b1 = getblock(phoenix.x+4-8,phoenix.y+4);
          if (b1 == 9) {
            setblock(phoenix.x+4-8,phoenix.y+4),0;
          }
        }
      }
    };

    phoenix.y_velocity += 0.06;// gravity
    phoenix.x += phoenix.x_velocity;
    phoenix.y += phoenix.y_velocity;
    
    if (phoenix.y_velocity > 0) {
      let checkleft = getblock(phoenix.x+2, phoenix.y+8);
      let checkright = getblock(phoenix.x+6, phoenix.y+8);
      if (checkleft == 19) {checkleft = 8};
      if (checkright == 19) {checkright = 8};
      if ((checkleft > 0 & checkleft < 10) | (checkright > 0 & checkright < 10)) {
        phoenix.y = Math.floor(phoenix.y/8)*8;
        phoenix.jumping = false;
        phoenix.y_velocity = 0;
      }
    };

    if (phoenix.x_velocity > 0) {
      let checkup = getblock(phoenix.x+7, phoenix.y+2);
      let checkdown = getblock(phoenix.x+7, phoenix.y+6);
      if (checkup == 19) {checkup = 8};
      if (checkdown == 19) {checkdown = 8};
      if ((checkup > 0 & checkup < 10) | (checkdown > 0 & checkdown < 10)) {
        phoenix.x = Math.floor(phoenix.x/8)*8 + 2+ 1;
        // phoenix.jumping = false;
        phoenix.x_velocity = 0;
      }
    };

    if (phoenix.x_velocity < 0) {
      let checkup = getblock(phoenix.x, phoenix.y+2);
      let checkdown = getblock(phoenix.x, phoenix.y+6);
      if (checkup == 19) {checkup = 8};
      if (checkdown == 19) {checkdown = 8};
      if ((checkup > 0 & checkup < 10) | (checkdown > 0 & checkdown < 10)) {
        phoenix.x = Math.floor(phoenix.x/8)*8 + 1;
        // phoenix.jumping = false;
        phoenix.x_velocity = 0;
      }
    };

    if (phoenix.y_velocity < 0) {
      let checkleft = getblock(phoenix.x+2, phoenix.y+1);
      let checkright = getblock(phoenix.x+6, phoenix.y+1);
      if (checkleft == 19) {checkleft = 8};
      if (checkright == 19) {checkright = 8};
      if ((checkleft > 0 & checkleft < 10) | (checkright > 0 & checkright < 10)) {
        phoenix.y = Math.floor(phoenix.y/8)*8+8;
        // phoenix.jumping = false;
        phoenix.y_velocity = 0;
      }
    };

    // if rectangle is falling below floor line
    if (phoenix.y > 48 - 8) {
      phoenix.jumping = false;
      phoenix.y = 48 - 8;
      phoenix.y_velocity = 0;
    }

    // if rectangle is going off the left of the screen
    if (phoenix.x < 2) {
      phoenix.x = 2;
    } else if (phoenix.x > 82 - 8) {
      phoenix.x = 82-8;
    }

    //phoenix cannot die if it is flashing or jumping
    if (phoenix.flash) {
      if (timer > phoenix.flashtime) {
        if (!phoenix.jumping) {
          phoenix.flash = false;
        };
      };
    };

    phoenix.x_draw = Math.floor(phoenix.x);
    phoenix.y_draw = Math.floor(phoenix.y);

    // did i beat the level?
    let centerMass = getblock(phoenix.x+4,phoenix.y+4);

    switch(centerMass) {
      case 17:
        currentlevel ++;
        thislevel = buildlevel(currentlevel);
      break;
      case 18:
        phoenix.dead = true;
        setblock(phoenix.x+4,phoenix.y+4,0);
      break;
      case 21:
        phoenix.dead = true;
        setblock(phoenix.x+4,phoenix.y+4,0);
      break;
      case 20:
        hitplate = true;
      break;
      case 22:
        phoenix.glow = true;
      break;
    };

    // update corpses

    for (let i = 0; i < corpselist.length; i++) {
      if (corpselist[i].jumping) {
        corpselist[i].y += corpselist[i].y_velocity;
        corpselist[i].y_velocity += 0.06;// gravity
        let checkleft = getblock(corpselist[i].x+2, corpselist[i].y+8);
        let checkright = getblock(corpselist[i].x+6, corpselist[i].y+8);
        if ((checkleft > 0 & checkleft < 10) | (checkright > 0 & checkright < 10)) {
          corpselist[i].y = Math.floor(corpselist[i].y/8)*8;
          corpselist[i].jumping = false;
          corpselist[i].y_velocity = 0;
        }
        // gotta check every other one to stack them!!
        for (let ii = 0; ii < corpselist.length; ii++) {
          if (ii != i) {
            if ((corpselist[i].x + 7 > corpselist[ii].x) & (corpselist[i].x < corpselist[ii].x+7)) {
              if ((corpselist[i].y <  corpselist[ii].y) & (corpselist[i].y+7 >  corpselist[ii].y)) {
                corpselist[i].y = Math.floor(corpselist[i].y/8)*8;
                corpselist[i].jumping = false;
                corpselist[i].y_velocity = 0;
              }
            }
          }
        }
      } else {
        if ((phoenix.x + 7 > corpselist[i].x) & (phoenix.x < corpselist[i].x+7)) {
            if ((phoenix.y <  corpselist[i].y) & (phoenix.y+8 >  corpselist[i].y)) {
              if (phoenix.y_velocity > 0) {
                phoenix.y = Math.floor(phoenix.y/8)*8;
                phoenix.jumping = false;
                phoenix.y_velocity = 0;
              }
            }
          }
        }

      //check if i hit anything
      let thisblock = getblock(corpselist[i].x+4,corpselist[i].y+4);
      switch(thisblock) {
        case 18:
          setblock(corpselist[i].x+4,corpselist[i].y+4,0);
        break;
        case 21:
          setblock(corpselist[i].x+4,corpselist[i].y+4,0);
        break;
        case 20:
          hitplate = true;
        break;
      };

      corpselist[i].x_draw = Math.floor(corpselist[i].x);
      corpselist[i].y_draw = Math.floor(corpselist[i].y);
    };

    timer ++;
    if (hitplate == true) {
      plate = true;
    }
    if (plate) {
      if (!hitplate) {
        plate = false;
      }
    }
    hitplate = false;

    }

/*
################
DRAW
################
*/

draw = function() {
    ctx.fillStyle = colors[1];
    ctx.fillRect(0, 0, 84, 48);// x, y, width, height
    ctx.fillStyle = colors[0];
    

    // draw the level
    // var thislevel = levels[currentlevel.toString()]
    for (let row = 0; row < 6; row ++) {
      for (let col = 0; col < 10; col ++) {
        let ix = col + 10*row;
        let x_sprite = (thislevel[ix]%16)*8;
        let y_sprite = (Math.floor(thislevel[ix]/16)*8);
        if (thislevel[ix] == 19) {
          if (!plate) {
            ctx.drawImage(sprite_sheet,x_sprite,y_sprite,8,8,2+col*8, row*8,8,8);  
          }
        } else {
          ctx.drawImage(sprite_sheet,x_sprite,y_sprite,8,8,2+col*8, row*8,8,8);    
        }
      }
    };


    //draw the phoenix
    if (!phoenix.dead) {
      ctx.drawImage(sprite_sheet,0,16,8,8,phoenix.x_draw, phoenix.y_draw,8,8);
    } else {
      ctx.drawImage(sprite_sheet,0,8,8,8,phoenix.x_draw, phoenix.y_draw,8,8);
    }
    
    if (phoenix.flash) {
      if (timer % 4 > 1) {
        ctx.beginPath();
        ctx.lineWidth =  "1";
        ctx.strokeStyle = colors[0];
        ctx.rect(phoenix.x_draw-1.5, phoenix.y_draw-1.5, 10, 10);
        ctx.stroke();
      }
    }
    if (phoenix.glow) {
      if (timer % 4 > 0) {
        ctx.beginPath();
        ctx.lineWidth =  "1";
        ctx.strokeStyle = colors[0];
        ctx.rect(phoenix.x_draw-3.5, phoenix.y_draw-3.5, 14, 14);
        ctx.stroke();
      }
    }
    if (phoenix.glowtime > timer) {
      ctx.beginPath();
      ctx.lineWidth =  "1";
      ctx.strokeStyle = colors[0];
      ctx.rect(phoenix.x_draw-6.5, phoenix.y_draw-6.5, 20, 20);
      ctx.stroke();
      
    }


    ctx.fillStyle = colors[0];

    //draw corpses
    for (let i = 0; i < corpselist.length; i++) {
      ctx.drawImage(sprite_sheet,8,0,8,8,corpselist[i].x_draw, corpselist[i].y_draw,8,8);
    }

    

    ctx.font = "8px Arial";
    // ctx.fillStyle = "red";
    ctx.textAlign = "left";
    
    
    // print("it is alive", 12,28);
    // print("it is alive", 12,40);

    if (currentlevel == 1) {

      print("Phoenix Escape", 8,12);
      print("by palo blanco", 8,22);

    }

    if (currentlevel == 15) {

      print("you escaped", 11,12);
      print("nokiajam2", 11,22);

    }
    
    // context.scale(basescale*pixelRatio, basescale*pixelRatio);
    context.drawImage(offCanvas,0,0,pixelRatio*basescale*84,pixelRatio*basescale*48);
    // context.scale(1, 1);

    
}

/*
################
MAIN LOOP
################
*/


loop = function() {

  update();
  draw();

    // if (i==3) {
      
    //   draw();
    // }

    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop);



};

/*
################
SET UP LISTENERS AND START!
################
*/

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);