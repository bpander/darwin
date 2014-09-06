define(function (require) {
    'use strict';


    function Environment () {
        Array.call(this);

    }
    Environment.prototype = Object.create(Array.prototype);
    Environment.prototype.constructor = Environment;


    Environment.prototype.empty = function () {
        while (this.length !== 0) {
            this.pop();
        }
        return this;
    };


    return Environment;
});
