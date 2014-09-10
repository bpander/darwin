define(function (require) {
    'use strict';

    var Creature = require('../../Creature');
    var Gene = require('../../Gene');
    var _trainingData = require('../lib/json!training-data.json');


    function EMACreature () {

        this.orders = [];

        Creature.call(this);
    }
    EMACreature.prototype = Object.create(Creature.prototype);
    EMACreature.prototype.constructor = EMACreature;


    var PIP = 0.0001; // TODO: For some reason, if this gets st to .001, the EMACreature performs better. This seems weird.


    EMACreature.toNearestTenth = function (n) {
        return Math.round(n * 10) / 10;
    };


    EMACreature.prototype.init = function () {

        this.genes = [
            new Gene('EMA Period 1', 5, 200, Math.round),
            new Gene('EMA Period 2', 5, 200, Math.round),
            new Gene('Trailing Stop', 3 * PIP, 30 * PIP)
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
        var c;
        var candle;
        var candle_initial = _trainingData.candles[0];
        var ema_fast = [];
        var ema_slow = [];
        var ema_fast_current;
        var ema_slow_current;
        var ema_fast_previous = mid_initial;
        var ema_slow_previous = mid_initial;
        var i = 1;
        var isBull;
        var l = _trainingData.candles.length;
        var mid;
        var mid_initial = (candle_initial.closeAsk + candle_initial.closeBid) / 2;
        var movement = 0;
        var order;
        var period_ema_fast = this.getGeneByPhenotype('EMA Period 1').value;
        var period_ema_slow = this.getGeneByPhenotype('EMA Period 2').value;
        if (period_ema_fast > period_ema_slow) {
            var period_ema_notFast = period_ema_fast;
            period_ema_fast = period_ema_slow;
            period_ema_slow = period_ema_notFast;
        }
        var smoothing_fast = 2 / (1 + period_ema_fast);
        var smoothing_slow = 2 / (1 + period_ema_slow);
        var trailingStop = this.getGeneByPhenotype('Trailing Stop').value;

        ema_fast_previous = mid_initial;
        ema_slow_previous = mid_initial;

        for (; i !== l; i++) {
            candle = _trainingData.candles[i];
            mid = (candle.closeAsk + candle.closeBid) / 2;
            ema_slow.push(ema_slow_previous = mid * smoothing_slow + ema_slow_previous * (1 - smoothing_slow));
            ema_fast.push(ema_fast_previous = mid * smoothing_fast + ema_fast_previous * (1 - smoothing_fast));
        }

        ema_slow_previous = ema_slow[0];
        ema_fast_previous = ema_fast[0];
        l = ema_slow.length;
        for (i = 1; i !== l; i++) {
            candle = _trainingData.candles[i];
            isBull = candle.closeBid > candle.openBid;

            for (c = this.orders.length - 1; c !== -1; c--) {
                order = this.orders[c];
                if (isBull) {
                    if (order.side === 'buy') {
                        order.stopLoss = candle.closeBid - order.trailingStop;
                    }
                } else {
                    if (order.side === 'sell') {
                        order.stopLoss = candle.closeAsk + order.trailingStop;
                    }
                }
                if (order.side === 'buy') {
                    if (candle.closeBid < order.stopLoss) {
                        this.orders.splice(c, 1);
                        movement = movement + (candle.closeBid - order.price);
                    }
                } else if (order.side === 'sell') {
                    if (candle.closeAsk > order.stopLoss) {
                        this.orders.splice(c, 1);
                        movement = movement + (order.price - candle.closeAsk);
                    }
                }
            }

            ema_slow_current = ema_slow[i];
            ema_fast_current = ema_fast[i];
            if (ema_slow_current > ema_fast_current && ema_slow_previous < ema_fast_previous) {
                this.open({
                    side: 'sell',
                    trailingStop: trailingStop,
                    price: candle.closeBid,
                    stopLoss: candle.closeAsk + trailingStop,
                    time: candle.time
                });
            } else if (ema_slow_current < ema_fast_current && ema_slow_previous > ema_fast_previous) {
                this.open({
                    side: 'buy',
                    trailingStop: trailingStop,
                    price: candle.closeAsk,
                    stopLoss: candle.closeAsk - trailingStop,
                    time: candle.time
                });
            }
            ema_slow_previous = ema_slow[i];
            ema_fast_previous = ema_fast[i];
        }

        return movement;
    };


    /**
     * @method  order
     * @description  Place a buy or sell order
     * 
     * @param  {Object}         order
     * @param  {'buy'|'sell'}   order.side
     * @param  {Number}         order.trailingStop
     * @param  {Number}         order.price
     * @return {EMACreature}
     */
    EMACreature.prototype.open = function (order) {
        this.orders.push(order);
        return this;
    };


    EMACreature.prototype.processCandle = function (candle) {
    };


    return EMACreature;
});
