define(function (require) {
    'use strict';

    var Creature = require('../../Creature');
    var Gene = require('../../Gene');


    function EMACreature () {

        Creature.call(this);
    }
    EMACreature.prototype = Object.create(Creature.prototype);
    EMACreature.prototype.constructor = EMACreature;


    var PIP = 0.0001;


    EMACreature.prototype.init = function () {
        this.genes = [
            new Gene('stopLoss', 5, 200, Math.round),
            new Gene('takeProfit', 5, 200, Math.round)
        ];
    };


    return EMACreature;
});
