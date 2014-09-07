define(function (require) {
    'use strict';


    function Environment () {

        this.creatures = [];

    }


    Environment.prototype.empty = function () {
        this.creatures = [];
        return this;
    };


    return Environment;
});
