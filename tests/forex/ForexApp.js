define(function (require) {
    'use strict';

    var EMACreature = require('./EMACreature');
    var Environment = require('../../Environment');


    function ForexApp () {

        this.creatureCount = 500;

        this.environment = new Environment();

        this.generationCount = 200;

        this.init();
    }


    ForexApp.prototype.init = function () {
        var self = this;
        this.generatePopulation();
        this.environment.runUntil(function (generationsSpawned) {
            return generationsSpawned === self.generationCount;
        }, this);

        return this;
    };


    ForexApp.prototype.generatePopulation = function () {
        var i = 0;
        var l = this.creatureCount;

        this.environment.empty();
        for (; i !== l; i++) {
            this.environment.creatures.push(new EMACreature().randomizeGenes());
        }

        return this;
    };


    return ForexApp;
});
