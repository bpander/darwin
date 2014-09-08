define(function (require) {
    'use strict';

    var Creature = require('../../Creature');
    var Gene = require('../../Gene');
    var _trainingData = require('../lib/json!training-data.json');


    function EMACreature () {

        this.balance = 1000;

        Creature.call(this);
    }
    EMACreature.prototype = Object.create(Creature.prototype);
    EMACreature.prototype.constructor = EMACreature;


    EMACreature.prototype.init = function () {

        this.emaGene_1 = new Gene('EMA Period 1', 5, 200, Math.round);

        this.emaGene_2 = new Gene('EMA Period 2', 5, 200, Math.round);

        this.takeProfitGene = new Gene('Take-Profit %');

        this.stopLossGene = new Gene('Stop-Loss');

        this.genes = [
            this.emaGene_1,
            this.emaGene_2,
            this.takeProfitGene,
            this.stopLossGene
        ];

        return this;
    };


    /**
     * @method  fitnessFunction
     * @description  
     * 
     * @return {Number}  fitnessScore
     */
    EMACreature.prototype.fitnessFunction = function () {
        _trainingData.candles.slice(10).forEach(this.processCandle, this);
        return this.balance;
    };


    EMACreature.prototype.processCandle = function (candle) {
    };


    return EMACreature;
});
