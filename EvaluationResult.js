define(function (require) {
    'use strict';


    function EvaluationResult (creature, data, fitnessScore) {

        this.creature = creature;

        this.data = data;

        this.fitnessScore = fitnessScore;

    }


    return EvaluationResult;
});
