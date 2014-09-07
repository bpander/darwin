define(function (require) {
    'use strict';


    function Environment () {

        this.creatures = [];

    }


    Environment.prototype.empty = function () {
        this.creatures = [];
        return this;
    };


    Environment.prototype.evaluatePopulation = function () {

        return this;
    };


    Environment.prototype.spawnNewGeneration = function () {
        var i = 0;
        var indexOfDud = -1;
        var parentA;
        var parentB;
        var populationSize = this.creatures.length;
        var score_max = -Infinity;
        var score_min = Infinity;

        var creatures_evaluated = this.creatures.map(function (creature) {
            var fitnessScore = creature.fitnessFunction();
            score_max = Math.max(score_max, fitnessScore);
            score_min = Math.min(score_min, fitnessScore);
            return {
                creature: creature,
                fitnessScore: fitnessScore
            };
        });
        var grabCreature = function () {
            var baseWeight = 0;
            var foundCreature = null;
            var y = Math.random();
            creatures_evaluated.some(function (creature_evaluated) {
                baseWeight = baseWeight + creature_evaluated.fitnessScore;
                if (y < baseWeight) {
                    foundCreature = creature_evaluated.creature;
                    return true;
                }
            });
            if (foundCreature === null) {
                throw new Error('somethings wrong!');
            }
            return foundCreature;
        };

        // Decide odds based on individual creature's fitness
        var fitnessScoreTotal = creatures_evaluated.reduce(function (previous, current) {
            return previous + current.fitnessScore - score_min;
        }, 0);
        creatures_evaluated.forEach(function (creature_evaluated, i) {
            if (creature_evaluated.fitnessScore === score_min) {
                indexOfDud = i;
                return;
            }
            creature_evaluated.fitnessScore = (creature_evaluated.fitnessScore - score_min) / fitnessScoreTotal;
        });
        creatures_evaluated.splice(indexOfDud, 1); // The 'dud' will just die off (fitnessScore === 0)

        // Select creatures and breed them together (or in Sims terms, get them to make woo-hoo)
        this.empty();
        for (; i !== populationSize; i++) {
            parentA = grabCreature();
            while ((parentB = grabCreature()) === parentA) {}  // Don't let `parentA` and `parentB` be the same creature
            this.creatures.push(parentA.breedWith(parentB));
        }
        return this;
    };


    Environment.prototype.runUntil = function (terminationEvaluator) {
        if (typeof terminationEvaluator !== 'function') {
            throw new Error('terminationEvaluator must be a function, Dave');
        }

        var generationsSpawned = 0;
        while (terminationEvaluator(generationsSpawned) !== true) {
            console.log('generationsSpawned', generationsSpawned);
            this.spawnNewGeneration();
            generationsSpawned++;
        }

        return this;
    };


    return Environment;
});
