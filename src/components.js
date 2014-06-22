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
