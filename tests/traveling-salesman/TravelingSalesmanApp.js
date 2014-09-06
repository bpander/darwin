define(function (require) {
    'use strict';

    var City = require('./City');


    function TravelingSalesmanApp () {

        this.cities = [];

        this.element = document.body;

        this.init();
    }


    TravelingSalesmanApp.prototype.init = function () {
        this.generateRandomCities();
        return this;
    };


    TravelingSalesmanApp.prototype.generateRandomCities = function (cityCount) {
        cityCount = typeof cityCount === 'number' ? cityCount : 10;
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
