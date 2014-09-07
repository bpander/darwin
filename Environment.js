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
        var parentA;
        var parentB;
        var populationSize = this.creatures.length;

        var creatures_evaluated = this.creatures.map(function (creature) {
            var fitnessScore = creature.fitnessFunction();
            return {
                creature: creature,
                fitnessScore: fitnessScore
            };
        }).sort(function (a, b) {
            return b.fitnessScore - a.fitnessScore;
        });
        var grabCreature = function () {
            var i = Math.floor(Math.random() * creatures_evaluated.length * 0.6);
            return creatures_evaluated[i].creature;
        };

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

        var localMaximum = -Infinity;
        this.creatures.forEach(function (creature) {
            var fitnessScore = creature.fitnessFunction();
            localMaximum = Math.max(localMaximum, fitnessScore);
        });
        console.log('localMaximum:', localMaximum);

        return this;
    };


    return Environment;
});
