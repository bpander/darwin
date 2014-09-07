define(function (require) {
    'use strict';

    var City = require('./City');
    var RouteCreature = require('./RouteCreature');
    var Environment = require('../../Environment');


    function TravelingSalesmanApp () {

        this.cities = [];

        this.element = document.body;

        this.environment = new Environment();

        this.init();
    }


    TravelingSalesmanApp.MAX_GENERATIONS = 100;


    TravelingSalesmanApp.prototype.init = function () {
        this.generateRandomCities();
        this.generatePopulation();
        this.environment.runUntil(function (generationsSpawned) {
            return generationsSpawned === TravelingSalesmanApp.MAX_GENERATIONS;
        });
        return this;
    };


    TravelingSalesmanApp.prototype.generatePopulation = function (populationSize) {
        populationSize = typeof populationSize === 'number' ? Math.round(populationSize) : 5;
        var i = 0;

        this.environment.empty();

        for (; i !== populationSize; i++) {
            this.environment.creatures.push(new RouteCreature(this.cities).randomizeGenes());
        }

        return this;
    };


    TravelingSalesmanApp.prototype.generateRandomCities = function (cityCount) {
        // TODO: Here's some hardcoded cities for testing
        this.cities = [
            new City(239.93783522280864, 33.83709011296742),
            new City(594.1490982340183, 92.29226555675268),
            new City(213.52676601754501, 81.95272134663537),
            new City(592.9029894296546, 395.3669613294769),
            new City(216.76033119834028, 555.4148496934213),
            new City(291.54524080152623, 433.3915188363753),
            new City(159.7737762457691, 307.4827005658299),
            new City(422.5477536339313, 369.15487226634286),
            new City(136.65842375345528, 117.29403634485789),
            new City(412.0247841924429, 554.5568665754981)
        ];
        this.cities.forEach(function (city) {
            this.element.appendChild(city.element);
            city.render();
        }, this);
        return this;
        // END TODO

        cityCount = typeof cityCount === 'number' ? Math.round(cityCount) : 10;
        this.cities = [];
        var city;
        var i = 0;
        for (; i !== cityCount; i++) {
            city = new City(Math.random() * window.innerWidth, Math.random() * window.innerHeight).render();
            this.element.appendChild(city.element);
            this.cities.push(city);
        }
        return this;
    };


    return TravelingSalesmanApp;
});
