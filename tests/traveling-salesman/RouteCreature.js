define(function (require) {
    'use strict';

    var Creature = require('../../Creature');
    var Gene = require('../../Gene');


    function RouteCreature (cities) {

        this.cities = cities;

        Creature.call(this);
    }
    RouteCreature.prototype = Object.create(Creature.prototype);
    RouteCreature.prototype.constructor = RouteCreature;


    RouteCreature.prototype.init = function () {
        this.cities.forEach(function (city, i) {
            this.push(new Gene(city));
        }, this);
        return this;
    };


    return RouteCreature;
});
