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


    EMACreature.toNearestTenth = function (n) {
        return Math.round(n * 10) / 10;
    };


    EMACreature.prototype.init = function () {

        this.genes = [
            new Gene('EMA Period 1', 5, 200, Math.round),
            new Gene('EMA Period 2', 5, 200, Math.round),
            new Gene('Trailing Stop', 1, 30, EMACreature.toNearestTenth)
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
        var candle;
        var candle_initial = _trainingData.candles[0];
        var ema_fast = [];
        var ema_slow = [];
        var ema_fast_current;
        var ema_slow_current;
        var ema_fast_previous = mid_initial;
        var ema_slow_previous = mid_initial;
        var i = 1;
        var l = _trainingData.candles.length;
        var mid;
        var mid_initial = (candle_initial.closeAsk + candle_initial.closeBid) / 2;
        var period_ema_fast = this.getGeneByPhenotype('EMA Period 1').value;
        var period_ema_slow = this.getGeneByPhenotype('EMA Period 2').value;
        if (period_ema_fast > period_ema_slow) {
            var period_ema_notFast = period_ema_fast;
            period_ema_fast = period_ema_slow;
            period_ema_slow = period_ema_notFast;
        }
        var smoothing_fast = 2 / (1 + period_ema_fast);
        var smoothing_slow = 2 / (1 + period_ema_slow);

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
            ema_slow_current = ema_slow[i];
            ema_fast_current = ema_fast[i];
            if (ema_slow_current > ema_fast_current && ema_slow_previous < ema_fast_previous) {
                console.log('sell');
            } else if (ema_slow_current < ema_fast_current && ema_slow_previous > ema_fast_previous) {
                console.log('buy');
            }
            ema_slow_previous = ema_slow[i];
            ema_fast_previous = ema_fast[i];
        }

        return this.balance;
    };


    EMACreature.prototype.processCandle = function (candle) {
    };


    return EMACreature;
});
