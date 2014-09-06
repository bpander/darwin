define(function (require) {
    'use strict';


    /**
     * @class  Gene
     * @description  The raw data that describes a phenotype of a Creature
     * 
     * @param {String}   phenotype          The human-readable characteristic, e.g. 'Tooth length'
     * @param {Number}   [lowerBounds=0]    The lowest possible value this Gene could be
     * @param {Number}   [upperBounds=1]    The highest possible value this Gene could be
     * @param {Function} [transform=noop]   A transformation function applied to the gene's value. For example, you could pass in `Math.round` if you wanted the Gene's value to always be an integer.
     */
    function Gene (phenotype, lowerBounds, upperBounds, transform) {

        this.phenotype = phenotype;

        this.lowerBounds = typeof lowerBounds === 'number' ? lowerBounds : 0;

        this.upperBounds = typeof upperBounds === 'number' ? upperBounds : 1;

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
