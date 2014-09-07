define(function (require) {
    'use strict';


    function Creature () {
        Array.call(this);

        this.init();
    }
    Creature.prototype = Object.create(Array.prototype);
    Creature.prototype.constructor = Creature;


    Creature.prototype.init = function () {

        return this;
    };


    Creature.prototype.breedWith = function (creature) {

        return this;
    };


    Creature.prototype.fitnessFunction = function () {

        return this;
    };


    Creature.prototype.getGeneByPhenotype = function (phenotype) {
        var foundGene = null;
        this.some(function (gene) {
            if (gene.phenotype === phenotype) {
                foundGene = gene;
                return true;
            }
        });
        return foundGene;
    };


    Creature.prototype.randomizeGenes = function () {
        this.forEach(function (gene) {
            gene.randomize();
        });
        return this;
    };


    return Creature;
});
