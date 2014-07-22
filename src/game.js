Player = {
    sprite: 'assets/luigi.png',
    horizontal_accel: 0.1,
    horizontal_max: 6,
    jump_accel: 0.5,
    jump_frames: 10,
}

Game = {
    MAP: '/plat.tmx',
    width: 0,
    height: 0,
    screen_width: 1024,
    screen_height: 768,
    tile_width: 32,
    tile_height: 32,
    start: function() {
        Crafty.init(this.screen_width, this.screen_height);
        Crafty.background('lightskyblue');

        Crafty.scene('Loading');
    },
}

text_css = {
    'font-size': '48px',
    'font-family': 'Arial',
    'color': 'black',
    'text-align': 'center',
};
