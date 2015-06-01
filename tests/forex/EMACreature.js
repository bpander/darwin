define(function (require) {
    'use strict';

    var BackTester = require('./BackTester');
    var Creature = require('../../Creature');
    var EMAStudy = require('./EMAStudy');
    var Gene = require('../../Gene');


    function EMACreature () {

        this.backTester = new BackTester();

        this.emaFast = new EMAStudy(7);

        this.emaSlow = new EMAStudy(14);

        Creature.call(this);
    }
    EMACreature.prototype = Object.create(Creature.prototype);
    EMACreature.prototype.constructor = EMACreature;


    var PIP = 0.01;


    EMACreature.prototype.init = function () {
        this.genes = [
            new Gene('stopLoss', 10, 400),
            new Gene('takeProfit', 10, 400)
        ];

        this.backTester.addStudy(this.emaFast);
        this.backTester.addStudy(this.emaSlow);
        this.backTester.onTick(function (candle, i, backTester) {

            if (i < this.emaSlow.period) {
                return;
            }

            var emaFast = this.emaFast.values[i];
            var emaSlow = this.emaSlow.values[i];
            var emaFastPrevious = this.emaFast.values[i - 1];
            var emaSlowPrevious = this.emaSlow.values[i - 1];
            var side = null;
            var takeProfit;
            var stopLoss;

            // Bullish
            if (emaFast > emaSlow && emaFastPrevious <= emaSlowPrevious) {
                side = 'buy';
                takeProfit = candle.closeBid + this.getGeneByPhenotype('takeProfit').value * PIP;
                stopLoss = candle.closeBid - this.getGeneByPhenotype('stopLoss').value * PIP;

            // Bearish
            } else if (emaFast < emaSlow && emaFastPrevious >= emaSlowPrevious) {
                side = 'sell';
                takeProfit = candle.closeAsk - this.getGeneByPhenotype('takeProfit').value * PIP;
                stopLoss = candle.closeAsk + this.getGeneByPhenotype('stopLoss').value * PIP;

            // Neutral
            } else {
                return;
            }

            var units = Math.max(1000, backTester.funds * 0.1);

            backTester.order({
                side: side,
                units: units,
                takeProfit: takeProfit,
                stopLoss: stopLoss
            });

        }.bind(this));
    };


    EMACreature.prototype.fitnessFunction = function (data) {
        this.backTester.setFunds(1e4);
        return Math.max(0, this.backTester.backTest(data).profit);
    };


    return EMACreature;
});
