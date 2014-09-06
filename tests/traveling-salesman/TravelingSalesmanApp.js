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


    TravelingSalesmanApp.prototype.init = function () {
        this.generateRandomCities();
        this.generatePopulation();
        return this;
    };


    TravelingSalesmanApp.prototype.generatePopulation = function (populationSize) {
        populationSize = typeof populationSize === 'number' ? Math.round(populationSize) : 5;
        var i = 0;

        this.environment.empty();

        for (; i !== populationSize; i++) {
            this.environment.push(new RouteCreature(this.cities));
        }
    };


    TravelingSalesmanApp.prototype.generateRandomCities = function (cityCount) {
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
