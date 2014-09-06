define(function (require) {
    'use strict';


    function City (x, y) {

        this.x = x || 0;

        this.y = y || 0;

        this.element = document.createElement('x-city');

    }


    City.prototype.render = function () {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        return this;
    };


    return City;
});
