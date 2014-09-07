define(function (require) {
    'use strict';

    var Creature = require('../../Creature');
    var Gene = require('../../Gene');


    function RouteCreature (cities) {

        this.cities = cities || [];

        Creature.call(this);
    }
    RouteCreature.prototype = Object.create(Creature.prototype);
    RouteCreature.prototype.constructor = RouteCreature;


    RouteCreature.prototype.init = function () {
        this.cities.forEach(function (city, i) {
            this.genes.push(new Gene(city));
        }, this);
        return this;
    };


    /**
     * @method  fitnessFunction
     * @description  Returns the inverse square of the route's total distance. We take the inverse square because:
     *               a) we want better-performing RouteCreatures to have a higher fitnessScore than lower-performing RouteCreatures and
     *               b) we still want this number to be positive
     *               c) squaring exaggerates the difference between better- and lower-performing RouteCreatures
     *
     * @return {Number}  fitnessScore  A very low number between 0 and 1
     */
    RouteCreature.prototype.fitnessFunction = function () {
        return 1 / Math.pow(this.getRouteDistance(), 2); 
    };


    RouteCreature.prototype.getRouteDistance = function () {
        var gene_originCity = this.genes[0];
        var genes_sorted = this.genes.slice(1).sort(function (a, b) {
            return a.value - b.value;
        });
        var route = [ gene_originCity ].concat(genes_sorted, gene_originCity).map(function (gene) {
            return gene.phenotype;
        });
        var distance_total = 0;
        route.reduce(function (previous, current) {
            var distance = Math.sqrt( Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2) );
            distance_total = distance_total + distance;
            return current;
        });

        return distance_total;
    };


    return RouteCreature;
});
