Engine.Animation = function(framerate, next) {
  this.framerate = framerate;
  this.next = next;
  this.frames = [];
};

Engine.AnimSprite = function(data,resources) {
  var texture = resources[data.source].texture;
  this.frameRow = data.frame_row;
  this.frameCol = data.frame_col;
  this.frameWidth = texture.width / this.frameRow;
  this.frameHeight = texture.height / this.frameCol;

  this.animations = {};

  for(var a in data.animations){
    var anim = data.animations[a];
    var ids = [];

    if(anim[0].length === 2) for(var i = anim[0][0]; i <= anim[0][1]; i++) ids.push(i);
    else ids = anim[0];

    this.animations[a] = new Engine.Animation(anim[1],anim[2]);
    for(var f in ids){
      var frame = new PIXI.Texture(texture);
      frame.frame = new PIXI.Rectangle(Math.floor(ids[f] % this.frameRow) * this.frameWidth, Math.floor(ids[f] / this.frameRow) * this.frameHeight, this.frameWidth, this.frameHeight);

      this.animations[a].frames.push(frame);
    }
  }

  this.setAnim(data.default);
  PIXI.Sprite.call(this, this.animation.frames[this.frameId]);
  this.scale.x = data.scale_x;
  this.scale.y = data.scale_y;
  this.anchor.x = data.pivot_x;
  this.anchor.y = data.pivot_y;
  
};

Engine.AnimSprite.constructor = Engine.AnimSprite;
Engine.AnimSprite.prototype = Object.create(PIXI.Sprite.prototype);

Engine.AnimSprite.prototype.setAnim = function(anim){
  this.animation = this.animations[anim];
  this.frameId = 0;
};

Engine.AnimSprite.prototype.animate = function(dt){
  this.frameId = (this.frameId +  this.animation.framerate * dt )  % this.animation.frames.length;

  var i = Math.floor(this.frameId);
  this.texture = this.animation.frames[i];
  if(this.frameId > this.animation.frames.length-1){
    if(this.animation.next) this.setAnim(this.animation.next);
  }
};
