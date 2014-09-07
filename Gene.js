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

    }


    Gene.MUTATION_RATE = 0.01;

    Gene.INHERITANCE_METHOD = [
        function (geneA, geneB) {
            var gene = geneA.copy();
            gene.value = geneA.value;  // Gene inherits from parentA
            return gene;
        },
        function (geneA, geneB) {
            var gene = geneA.copy();
            gene.value = geneB.value;  // Gene inherits from parentB
            return gene;
        },
        function (geneA, geneB) {
            var gene = geneA.copy();
            gene.value = geneA.transform((geneA.value + geneB.value) / 2);  // Gene is average of A + B
            return gene;
        }
    ];


    Gene.prototype.copy = function () {
        return new Gene(this.phenotype, this.lowerBounds, this.upperBounds, this.transform);
    };


    Gene.prototype.crossWith = function (gene) {
        var inheritanceMethod = Gene.INHERITANCE_METHOD[Math.floor(Math.random() * Gene.INHERITANCE_METHOD.length)];
        var gene = inheritanceMethod(this, gene);
        if (Math.random() < Gene.MUTATION_RATE) {
            gene.mutate();
        }
        return gene;
    };


    /**
     * @method  mutate
     * @description  Applies a mutation to a gene's value. We want every value in the range to be possible, but we want values closer to the current value to be favored. Also, if the Gene's current value is close to one of its bounds, we want it to be more likely to normalize rather than go closer to the nearest bound. To achieve this, we use an ellipse formula. Propbability is on the y-axis and percentOfDelta is on the x. Below y=0.5, the ellipse center point is (0, 0.5) with an x-radius of currentPercentOfDelta and a y-radius of 0.5. Above y=0.5, the ellipse center point is (1, 0.5) with an x-radius of 1 - currentPercentOfDelta and a y-radius of 0.5. This makes an S-shape where a large upswing occurs at the currentPercentOfDelta. We plug in a random value (0 to 1) and the output is our NEW percentOfDelta which we apply to the Gene's range to give us our new value. You really gotta draw this shit out for it to make sense.
     * 
     * @return {Gene}
     */
    Gene.prototype.mutate = function () {
        var percentOfDelta = (this.value - this.lowerBounds) / this.delta;
        var a;          // Radius of ellipse along x-axis
        var b = 0.5;    // Radius of ellipse along y-axis
        var h;          // x-coordinate of ellipse centerpoint
        var k = 0.5;    // y-coordinate of ellipse centerpoint

        var x;                  // The mutated percentOfDelta
        var y = Math.random();  // The random input value
        var doReflect = false;  // Because of squaring, we might need to reflect the result about the y-axis

        if (y < 0.5) {
            a = percentOfDelta;
            h = 0;
        } else {
            a = 1 - percentOfDelta;
            h = 1;
            doReflect = true;
        }

        x = Math.sqrt( Math.pow(a, 2) * ( 1 - ( Math.pow(y - k, 2) / Math.pow(b, 2) ) ) ) + h;
        if (doReflect) {
            x = 2 - x;
        }

        this.value = this.transform(x * this.delta + this.lowerBounds);

        return this;
    };


    Gene.prototype.randomize = function () {
        this.value = this.transform(Math.random() * this.delta + this.lowerBounds);
        return this;
    };


    return Gene;
});
