define(function (require) {
    'use strict';


    function EMAStudy (period) {

        this.period = period;

        this.values = [];

    }


    EMAStudy.prototype.evaluate = function (candles) {
        var a = 2 / (this.period + 1);
        var candle;
        var price;
        var value = (candles[0].closeBid + candles[0].closeAsk) / 2;
        var i = 0;
        this.values = [ value ];
        while ((candle = candles[++i]) !== undefined) {
            price = (candle.closeBid + candle.closeAsk) / 2;
            value = (price * a) + (value * (1 - a));
            this.values.push(value);
        }

    };


    return EMAStudy;
});
