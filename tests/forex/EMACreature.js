define(function (require) {
    'use strict';

    var Creature = require('../../Creature');
    var Gene = require('../../Gene');


    function EMACreature () {

        this.backTester = new BackTester();

        this.emaFast = new EMAStudy(7);

        this.emaSlow = new EMAStudy(14);

        Creature.call(this);
    }
    EMACreature.prototype = Object.create(Creature.prototype);
    EMACreature.prototype.constructor = EMACreature;


    var PIP = 0.0001;


    EMACreature.prototype.init = function () {
        this.genes = [
            new Gene('stopLoss', 5, 200, Math.round),
            new Gene('takeProfit', 5, 200, Math.round)
        ];

        this.backTester.setFunds(1e4);
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
                side = Order.BUY;
                takeProfit = candle.closeBid + this.getGeneByPhenotype('takeProfit').value;
                stopLoss = candle.closeBid - this.getGeneByPhenotype('stopLoss').value;

            // Bearish
            } else if (emaFast < emaSlow && emaFastPrevious >= emaSlowPrevious) {
                side = Order.SELL;
                takeProfit = candle.closeAsk - this.getGeneByPhenotype('takeProfit').value;
                stopLoss = candle.closeAsk - this.getGeneByPhenotype('stopLoss').value;

            // Neutral
            } else {
                return;
            }

            var units = Math.max(1000, backTester.balance * 0.1);

            backTester.order({
                side: side,
                units: units,
                takeProfit: takeProfit,
                stopLoss: stopLoss
            });

        });
    };


    EMACreature.prototype.fitnessFunction = function (data) {
        return this.backTester.backTest(data).profit;
    };


    return EMACreature;
});
