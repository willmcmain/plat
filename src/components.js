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
        this.requires('Grid, Canvas, Color');
    },
});

Crafty.c('Player', {
    init: function() {
        this.requires('2D, Canvas, spr_player, Twoway, Gravity, Collision, SpriteAnimation')
            .attr({x:96, y:896, w:32, h:64})
            .twoway(8, 7)
            .gravity('Tile');
        this.onHit('Tile', function() {
            this._speed=0;
            if(this._movement) {
                this.x -= this._movement.x;
                this.y -= this._movement.y;
            }
        });
        this.bind('Moved', function() {
            this.x = Math.clamp(this.x, 0, Game.width-this.w);
            this.y = Math.clamp(this.y, 0, Game.height-this.h);
        });

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
    },
});
