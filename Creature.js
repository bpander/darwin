define(function (require) {
    'use strict';


    function Creature () {

        this.genes = [];

        this.init();
    }


    Creature.prototype.init = function () {

        return this;
    };


    Creature.prototype.breedWith = function (creature) {
        var CreatureClass = this.constructor;
        var offspring = new CreatureClass();

        this.genes.forEach(function (gene, i) {
            offspring.genes.push(gene.crossWith(creature.genes[i]));
        });

        return offspring;
    };


    Creature.prototype.fitnessFunction = function () {

        return this;
    };


    Creature.prototype.getGeneByPhenotype = function (phenotype) {
        var foundGene = null;
        this.genes.some(function (gene) {
            if (gene.phenotype === phenotype) {
                foundGene = gene;
                return true;
            }
        });
        return foundGene;
    };


    Creature.prototype.randomizeGenes = function () {
        this.genes.forEach(function (gene) {
            gene.randomize();
        });
        return this;
    };


    return Creature;
});
