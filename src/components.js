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


Crafty.c('Physics', {
    init: function() {
        this._movement = {x: 0, y: 0};
        this._speed = 7;

        this.bind('KeyDown', function(e) {
            if(e.key == Crafty.keys.A) {
                this._movement.x = -this._speed;
            }
            if(e.key == Crafty.keys.D) {
                this._movement.x = this._speed;
            }
        });

        this.bind('KeyUp', function(e) {
            if(e.key == Crafty.keys.A) {
                this._movement.x = 0;
            }
            if(e.key == Crafty.keys.D) {
                this._movement.x = 0;
            }
        });

        this.bind('EnterFrame', function(e) {
            var old = {x: this.x, y: this.y};
            this.x += this._movement.x;
            this.y += this._movement.y;
            Crafty.trigger('Moved', old);
        })
    },
});


Crafty.c('Player', {
    init: function() {
        this.requires('2D, Canvas, spr_player, SpriteAnimation')
            .requires('Collision, Physics')
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

        this.bind('NewDirection', function(data) {
            if (data.x) {
                this.animate('PlayerRun', -1);
            }
            else {
                this.animate('PlayerStop', -1);
            }
        });

        this.bind('KeyDown', function(e) {
            if(e.key == Crafty.keys.SPACE) {
                this._movement.y = -5;
            }
        });

        this.bind('EnterFrame', function(e) {
            this._movement.y += 0.1;
            this._movement.y = Math.clamp(this._movement.y, -31, 31);
        });
    },

    start: function(x, y) {
        this.attr({x: x, y: y});
        return this;
    },
});
