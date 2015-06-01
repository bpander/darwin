define(function (require) {
    'use strict';

    require('../../bower_components/jquery/dist/jquery');


    function BackTester () {

        this.funds = 0;

        this.orders = [];

        this.studies = [];

        this.currentCandle = null;

        this._tick = function () {};

    }


    BackTester.prototype.setFunds = function (funds) {
        this.funds = funds;
    };


    BackTester.prototype.addStudy = function (study) {
        this.studies.push(study);
    };


    BackTester.prototype.onTick = function (fn) {
        this._tick = fn;
    };


    BackTester.prototype.backTest = function (candles) {
        var i = -1;
        var j = -1;
        var candle;
        var order;
        var study;
        var initialFunds = this.funds;

        while ((study = this.studies[++i]) !== undefined) {
            study.evaluate(candles);
        }
        i = -1;
        while ((candle = candles[++i]) !== undefined) {

            j = this.orders.length;
            while ((order = this.orders[--j]) !== undefined) {
                if (order.side === 'buy') {
                    if (candle.lowBid <= order.stopLoss) {
                        // TODO: This math is probably wrong. Doesn't take into account the exchange rate.
                        this.funds += order.units + (order.stopLoss - order.price) * order.units * (1 / order.stopLoss);
                        this.orders.splice(j, 1);
                    } else if (candle.highBid >= order.takeProfit) {
                        this.funds += order.units + (order.takeProfit - order.price) * order.units * (1 / order.takeProfit);
                        this.orders.splice(j, 1);
                    }

                } else if (order.side === 'sell') {
                    if (candle.highAsk >= order.stopLoss) {
                        this.funds += order.units + (order.price - order.stopLoss) * order.units * (1 / order.stopLoss);
                        this.orders.splice(j, 1);
                    } else if (candle.lowAsk <= order.takeProfit) {
                        this.funds += order.units + (order.price - order.takeProfit) * order.units * (1 / order.takeProfit);
                        this.orders.splice(j, 1);
                    }
                }
            }

            this.currentCandle = candle;
            this._tick(candle, i, this);
        }
        var results = {
            profit: this.funds - initialFunds
        };
        return results;
    };


    BackTester.prototype.order = function (options) {
        if (options.units > this.funds) {
            return;
        }
        var price = options.side === 'buy' ? this.currentCandle.closeAsk : this.currentCandle.closeBid;
        var order = $.extend({}, options);
        order.price = price;
        this.funds -= options.units;
        this.orders.push(order);
    };


    return BackTester;
});
