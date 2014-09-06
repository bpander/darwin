define(function (require) {
    'use strict';


    function Creature () {

        this.genes = [];

    }


    Creature.prototype.breedWith = function (creature) {
        var i = 0;
        var l = this.genes.length;
        var offspring = new Creature();
        for (; i !== l; i++) {
            /* TODO: Flesh out creature 'breeding' */
        }
        return new Creature();
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


    return this;
});
