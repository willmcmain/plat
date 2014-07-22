Math.clamp = function(val, min, max) {
    return Math.max(Math.min(val, max), min);
};

Array.prototype.max = function() {
    return Math.max.apply(null, this);
}

Array.prototype.min = function() {
    return Math.min.apply(null, this);
}

Array.prototype.remove = function(val) {
    var ix = this.indexOf(val);
    if(ix === -1) {
       return this
    };
    return this.splice(ix, 1);
}
