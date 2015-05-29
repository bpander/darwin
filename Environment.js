define(function (require) {
    'use strict';


    function Environment () {

        this.creatures = [];

    }


    Environment.prototype.run = function (data) {
        var evaluationResult;
        var evaluationResults = [];
        var fitnessScoreSum = 0;
        var creature;
        var i = -1;
        while ((creature = this.creatures[++i]) !== undefined) {
            evaluationResult = creature.evaluate(data);
            evaluationResults.push(evaluationResult);
            fitnessScoreSum += evaluationResult.fitnessScore;
        }
        console.log('test');

        var weightedGetCreature = function () {
            while (evaluationResult = evaluationResults[Math.round((evaluationResults.length - 1) * Math.random())]) {
                if (Math.random() < evaluationResult.fitnessScore / fitnessScoreSum) {
                    return evaluationResult.creature;
                }
            }
        };
        if (fitnessScoreSum === 0) {
            weightedGetCreature = function () {
                return evaluationResults[Math.round((evaluationResults.length - 1) * Math.random())].creature;
            };
        }

        var creatureA;
        var creatureB;
        var l = this.creatures.length;
        this.creatures = [];
        i = 0;
        for (; i !== l; i++) {
            creatureA = weightedGetCreature();
            while ((creatureB = weightedGetCreature()) === creatureA) {}  // Don't let `parentA` and `parentB` be the same creature
            this.creatures.push(creatureA.breedWith(creatureB));
        }
    };


    return Environment;
});
