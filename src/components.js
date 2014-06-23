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
        this.requires('2D, Canvas, Color, Twoway, Gravity, Collision');
        this.color('rgb(0, 200, 0)')
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
    },
});
