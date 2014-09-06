define(function (require) {
    'use strict';


    function Creature () {
        Array.call(this);

        this.init();
    }
    Creature.prototype = Object.create(Array.prototype);
    Creature.prototype.constructor = Creature;


    Creature.prototype.init = function () {

    };


    Creature.prototype.breedWith = function (creature) {
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


    return Creature;
});
