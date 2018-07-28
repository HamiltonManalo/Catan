function dragAndDrop(target) {
    var element = document.getElementById(target);
    var mover = false, x, y, posx, posy, first = true;
    element.onmousedown = function() {
        mover = true;
    };
    element.onmouseup = function() {
        mover = false;
        first = true;
    };
    element.onmousemove = function(e) {
        if (mover) {
            if (first) {
                x = e.offsetX;
                y = e.offsetY;
                first = false;
            }
            posx = e.pageX - x;
            posy = e.pageY - y;
            this.style.left = posx + 'px';
            this.style.top = posy + 'px';
}