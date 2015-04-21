(function() {
  
  var canvas,
      ctx,
      W, W0,
      H, H0,
      backCanvas,
      ball,
      racket1,
      racket2,
      keys = [];


  function Ball(x, y, speedx, speedy, radius, color) {
    this.x = x;
    this.y = y;
    this.speedx = speedx;
    this.speedy = speedy;
    this.color = color;
    this.radius = radius;
    this.draw = function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    this.isLeftRightHitRect = function(rect) {
      if ((this.x + this.radius > rect.x && this.x < rect.x + rect.width && this.y + this.radius > rect.y && this.y - this.radius < rect.y + rect.height) ||
          (this.x - this.radius < rect.x + rect.width && this.x > rect.x && this.y + this.radius > rect.y && this.y - this.radius < rect.y + rect.height)){
            return true;
      } else {
        return false;
      }
    }
    
    this.isUpDownHitRect = function(rect) {
      if ((this.x + this.radius > rect.x && this.x < rect.x + rect.width && this.y + this.radius >= rect.y && this.y <= rect.y + rect.height) ||
          (this.x + this.radius > rect.x && this.x < rect.x + rect.width && this.y - this.radius <= rect.y + rect.height && this.y >= rect.y)) {
        return true;
      } else {
        return false;
      }
    }
    
    this.update = function(racket1, racket2, timeDiff) {
      
      if (this.isUpDownHitRect(racket1) || this.isUpDownHitRect(racket2)) {
        this.speedy *= -1;
      } else if (this.isLeftRightHitRect(racket1) || this.isLeftRightHitRect(racket2)) {
        this.speedx *= -1;
      } else if (this.y - this.radius < H0 || this.y + this.radius > H) {
        this.speedy *= -1;
      } else if (this.x - this.radius < W0 || this.x + this.radius > W) {
        this.speedx *= -1;
      }
      this.x += this.speedx;
      this.y += this.speedy;
    }
  }
  
  function Rect(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 7;
    this.draw = function(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    
    this.update = function(isUp) {
      if (isUp) {
        if (this.y - this.speed >= H0) {
          this.y -= this.speed;
          }
      } else if (this.y + this.height + this.speed < H) {
          this.y += this.speed;
      }
    }
  }
  
  window.onload = function(){
    canvas = document.getElementById("pingPongCanvas"),
    ctx = canvas.getContext("2d"),
    W = window.innerWidth - window.innerWidth/20,
    H = window.innerHeight - window.innerHeight/20;
    W0 = W/50;
    H0 = H/50;
    canvas.width = W;
    canvas.height = H;
    
    backCanvas = new Rect(W0,H0,W,H,"black");
        
    racket1 = new Rect(W/10, H/4, W/50, H/6, "blue");  
    racket2 = new Rect(9*W/10, H/4, W/50, H/6, "red");   
    ball = new Ball(W/2, H/2, 5, -5, 10, "white");
    ball2 = new Ball(W/2, H/2, -5, 5, 10, "green");
    
    document.addEventListener("keyup", function(event) {
      keys[event.key] = false;
    });
    document.addEventListener("keydown", function(event) {
      keys[event.key] = true;
    });
    
    window.requestAnimationFrame = /*window.requestAnimationFrame || 
                                   window.mozRequestAnimationFrame || 
                                   window.webkitRequestAnimationFrame || 
                                   window.msRequestAnimationFrame || */
                                   function(callback) {
                                     window.setTimeout(callback, 1000 / 60);
                                   };
    
    function step(lastTime) {
      var date = new Date();
      var time = date.getTime();
      var timeDiff = time - lastTime;
      draw(timeDiff);
      lastTime = time;
      
      requestAnimationFrame(function() {
        step(lastTime);
      });      
    }
    
    var date = new Date();
    var time = date.getTime();
    step(time);
  };
  
  function draw(timeDiff) {
    updateRacketsByKeys();
    
    ctx.clearRect(0, 0, W, H);
    
    backCanvas.draw(ctx);
    racket1.draw(ctx, timeDiff);
    racket2.draw(ctx, timeDiff);
    
    ball.update(racket1, racket2, timeDiff);
    ball.draw(ctx);
    
    ball2.update(racket1, racket2, timeDiff);
    ball2.draw(ctx);
  }
  
  function updateRacketsByKeys() {
    if (keys["Up"]) {
      racket2.update(true);
    } 
    if (keys["Down"]) {
      racket2.update(false);
    }
    if (keys["w"]) {
      racket1.update(true);
    } 
    if (keys["s"]) {
      racket1.update(false);
    }  
  }  
  
})();