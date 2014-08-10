Crafty.c('Grid', {
    _grid: {
        x: 0,
        y: 0,
    },
    init: function() {
        this.requires('2D');
        this.x = this.y = 0;
        this.w = Game.tile_width;
        this.h = Game.tile_height;
    },
    grid: function(x, y) {
        if(x === undefined && y === undefined) {
            return this._grid;
        }
        else {
            if(x !== undefined) {
                this._grid.x = x;
            }
            if(y !== undefined) {
                this._grid.y = y;
            }
            this.x = this._grid.x * Game.tile_width;
            this.y = this._grid.y * Game.tile_height;
        }
        return this;
    },
});


Crafty.c('Tile', {
    init: function() {
        this.requires('Grid, Canvas');
    },
});


Crafty.c('PlayerPhysics', {
    ground: false,
    _movement: {x: 0, y: 0},
    _direction: [],

    _push_dir: function(dir) {
        this._direction.unshift(dir);
        this.trigger("NewDirection", this.direction());
    },

    _pop_dir: function(dir) {
        this._direction.remove(dir);
        this.trigger("NewDirection", this.direction());
    },

    direction: function() {
        return this._direction.length > 0 ? this._direction[0] : null;
    },

    init: function() {
        this.bind('KeyDown', function(e) {
            if(e.key == Crafty.keys.A) {
                this._push_dir('left');
            }
            else if(e.key == Crafty.keys.D) {
                this._push_dir('right');
            }
        });

        this.bind('KeyUp', function(e) {
            if(e.key == Crafty.keys.A) {
                this._pop_dir('left');
            }
            else if(e.key == Crafty.keys.D) {
                this._pop_dir('right');
            }
        });


        this.bind('EnterFrame', function(e) {
            $('#is-ground').text(this.ground);

            // Accelleration
            switch(this.direction()) {
                case 'left':
                    this._movement.x -= Player.horizontal_accel;
                    break;
                case 'right': 
                    this._movement.x += Player.horizontal_accel;
                    break;
                default:
                    if(this._movement.x > 0) {
                        this._movement.x -= Player.horizontal_accel;
                    }
                    else if(this._movement.x < 0) {
                        this._movement.x += Player.horizontal_accel;
                    }
                    break;
            }
            this._movement.x = Math.clamp(this._movement.x,
                                          -Player.horizontal_max,
                                          Player.horizontal_max)

            var old = {x: this.x, y: this.y};
            this._movement.y += Physics.gravity;
            this._movement.y = Math.clamp(this._movement.y, -31, 31);
            this.x += this._movement.x;
            this.y += this._movement.y;
            Crafty.trigger('Moved', old);

            this.ground = false;
        })
    },
});


Crafty.c('Player', {
    init: function() {
        this.requires('2D, Canvas, spr_player, SpriteAnimation')
            .requires('Collision, PlayerPhysics')
            .attr({w:32, h:64})
        this.last_frame = {x: this.x, y: this.y};

        // Collision
        this.onHit('Tile', function(collision) {
            var that = this;
            var corrections = [];
            $(collision).each(function(i, val) {
                var correction = {x: that.x, y: that.y};
                // x collision
                if(that.x + that.w > val.obj.x && that.x <= val.obj.x) {
                    correction.x = val.obj.x - that.w;
                }
                else if(that.x < val.obj.x + val.obj.w
                        && that.x + that.w >= val.obj.x + val.obj.w) {
                    correction.x = val.obj.x + val.obj.w;
                }

                // y collision
                if(that.y + that.h > val.obj.y && that.y <= val.obj.y) {
                    correction.y = val.obj.y - that.h;
                }
                else if(that.y < val.obj.y + val.obj.h
                        && that.y + that.h >= val.obj.y + val.obj.h) {
                    correction.y = val.obj.y + val.obj.h;
                }

                if(that.last_frame.y + that.h <= val.obj.y) {
                    correction.type = 'y';
                }
                else {
                    correction.type = 'x';
                }
                corrections.push(correction);
            });

            x_corrections = (corrections
                .filter(function(i) { return i.type === 'x' })
                .map(function(i) { return i.x }));

            for(var i = 0; i < corrections.length; i++) {
                if(corrections[i].type === 'x') {
                    this.x = corrections[i].x;
                }
                else if(corrections[i].type === 'y') {
                    if(x_corrections.indexOf(corrections[i].x) === -1) {
                        this.y = corrections[i].y;
                        this._movement.y = 0;
                        this.ground = true;
                    }
                }
            }
        });

        // Clamp to playable area
        this.bind('Moved', function(old) {
            this.last_frame = old;
            this.x = Math.clamp(this.x, 0, Game.width-this.w);
            this.y = Math.clamp(this.y, 0, Game.height-this.h);
        });

        // Animations
        this.reel('PlayerRun', 400, 0, 0, 3);
        this.reel('PlayerStop', 400, 2, 0, 1);

        this.bind('NewDirection', function(dir) {
            if (dir !== null) {
                this.animate('PlayerRun', -1);
            }
            else {
                this.animate('PlayerStop', -1);
            }
        });

        this.bind('KeyDown', function(e) {
            if(e.key == Crafty.keys.SPACE && this.ground) {
                this.jump = 1;
            }
        });

        this.bind('EnterFrame', function(e) {

            if(Crafty.keydown[Crafty.keys.SPACE]
               && this.jump > 0 && this.jump <= Player.jump_frames) {
                this._movement.y -= Player.jump_accel;
                this.jump++;
            }
            else if(this.jump > 0) {
                this.jump = 0;
            }
        });
    },

    start: function(x, y) {
        this.attr({x: x, y: y});
        return this;
    },
});
