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
        var fitnessScore_sum = 0;
        var parentA;
        var parentB;
        var populationSize = this.creatures.length;

        var creatures_evaluated = this.creatures.map(function (creature) {
            var fitnessScore = creature.fitnessFunction();
            fitnessScore_sum = fitnessScore_sum + fitnessScore;
            return {
                creature: creature,
                fitnessScore: fitnessScore,
                probability: 0
            };
        });
        var grabCreature = function () {
            var baseWeight = 0;
            var foundCreature = null;
            var y = Math.random();
            creatures_evaluated.some(function (creature_evaluated) {
                baseWeight = baseWeight + creature_evaluated.probability;
                if (y < baseWeight) {
                    foundCreature = creature_evaluated.creature;
                    return true;
                }
            });
            if (foundCreature === null) {
                throw new Error('Could not find suitable Creature for breeding');
            }
            return foundCreature;
        };

        // Decide odds of picking individual Creatures. Better performing Creatures will have higher odds of getting grabbed.
        creatures_evaluated.forEach(function (creature_evaluated) {
            creature_evaluated.probability = creature_evaluated.fitnessScore / fitnessScore_sum;
        });

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
            this.spawnNewGeneration();
            generationsSpawned++;
        }

        // TODO: This pretty specific for the TravelingSalesmanApp test
        var localMaximum = -Infinity;
        this.creatures.forEach(function (creature) {
            var fitnessScore = creature.fitnessFunction();
            localMaximum = Math.max(localMaximum, fitnessScore);
        });
        console.log('localMaximum:', Math.sqrt(1 / localMaximum));
        // END TODO

        return this;
    };


    return Environment;
});
