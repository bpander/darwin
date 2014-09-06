define(function (require) {
    'use strict';

    function Gene (phenotype, lowerBounds, upperBounds, transform) {

        this.phenotype = phenotype;

        this.lowerBounds = lowerBounds;

        this.upperBounds = upperBounds;

        this.transform = typeof transform === 'function' ? transform : function (x) { return x; };

        this.delta = this.upperBounds - this.lowerBounds;

        this.value;

        this.init();
    }


    Gene.prototype.init = function () {
        this.randomize();
        return this;
    };


    Gene.prototype.randomize = function () {
        this.value = this.transform(Math.random() * this.delta + this.lowerBounds);
        return this;
    };


    Gene.prototype.mutate = function () {
        /* TODO: Flesh out Gene mutation */
        return this;
    };


    return Gene;
});
