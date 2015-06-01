define(function (require) {
    'use strict';

    var EvaluationResult = require('./EvaluationResult');


    function Creature () {

        this.genes = [];

        this.init();
    }


    Creature.prototype.init = function () {

    };


    Creature.prototype.clone = function () {
        var CreatureClass = this.constructor;
        var clone = new CreatureClass();
        clone.genes = this.genes.slice(0);
        return clone;
    };


    Creature.prototype.breedWith = function (creature) {
        var CreatureClass = this.constructor;
        var offspring = new CreatureClass();

        offspring.genes = this.genes.map(function (gene, i) {
            return gene.crossWith(creature.genes[i]);
        });

        return offspring;
    };


    Creature.prototype.evaluate = function (data) {
        return new EvaluationResult(this, data, this.fitnessFunction(data));
    };


    Creature.prototype.fitnessFunction = function () {
        return 0;
    };


    Creature.prototype.getGeneByPhenotype = function (phenotype) {
        var i = -1;
        var gene;
        while ((gene = this.genes[++i]) !== undefined) {
            if (gene.phenotype === phenotype) {
                return gene;
            }
        }
        return null;
    };


    Creature.prototype.randomize = function () {
        var i = -1;
        var gene;
        while ((gene = this.genes[++i]) !== undefined) {
            gene.randomize();
        }
        return this;
    };


    return Creature;
});
