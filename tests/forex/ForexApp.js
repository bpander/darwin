define(function (require) {
    'use strict';

    var EMACreature = require('./EMACreature');
    var Environment = require('../../Environment');
    var trainingData = require('../lib/json!training-data.json');


    function ForexApp () {

        this.creatureCount = 100;

        this.environment = new Environment();

        this.generationCount = 100;

        this.init();
    }


    ForexApp.prototype.init = function () {

        // Seed population
        var emaCreature;
        var i = 0;
        var l = this.creatureCount;
        for (; i !== l; i++) {
            emaCreature = new EMACreature();
            emaCreature.randomize();
            this.environment.creatures.push(emaCreature);
        }

        var globalMaximum = { fitnessScore: -Infinity };
        var results;

        // Run a bunch of times
        i = 0;
        l = this.generationCount;
        for (; i !== l; i++) {
            results = this.environment.run(trainingData.candles);
            console.log('localMaximum', results);
            if (results.fitnessScore > globalMaximum.fitnessScore) {
                globalMaximum = results;
            }
        }
        console.log('globalMaximum', globalMaximum);
    };


    return ForexApp;
});
