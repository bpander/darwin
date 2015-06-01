define(function (require) {
    'use strict';


    function Environment () {

        this.creatures = [];

    }


    Environment.prototype.run = function (data) {
        var best = { fitnessScore: -Infinity };
        var evaluationResult;
        var evaluationResults = [];
        var fitnessScoreSum = 0;
        var creature;
        var i = -1;
        while ((creature = this.creatures[++i]) !== undefined) {
            evaluationResult = creature.evaluate(data);
            if (evaluationResult.fitnessScore > best.fitnessScore) {
                best = evaluationResult;
            }
            evaluationResults.push(evaluationResult);
            fitnessScoreSum += evaluationResult.fitnessScore;
        }

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
        var j;
        var l = this.creatures.length;
        this.creatures = [];
        i = 0;
        for (; i !== l; i++) {
            creatureA = weightedGetCreature();

            // Don't let `parentA` and `parentB` be the same creature
            j = l;
            while (j-- !== 0) {
                creatureB = weightedGetCreature();
                if (creatureB !== creatureA) {
                    break;
                }
            }
            if (creatureB === creatureA) {
                console.warn('had to create a new creature');
                creatureB = creatureA.clone().randomize();
            }

            this.creatures.push(creatureA.breedWith(creatureB));
        }
        return best;
    };


    return Environment;
});
