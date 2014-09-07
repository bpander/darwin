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


    RouteCreature.prototype.fitnessFunction = function () {
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
        return distance_total * -1;  // We multiply by -1 so the better RouteCreatures have a higher fitnessScore than worser RouteCreatures
    };


    return RouteCreature;
});
