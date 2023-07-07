"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Events;
(function (Events) {
    Events["connection"] = "connection";
    Events["disconnect"] = "disconnect";
    Events["joinQuiz"] = "joinQuiz";
    Events["setQuizPosition"] = "setQuizPosition";
    Events["sendQuizPosition"] = "sendQuizPosition";
    Events["receiveAnswer"] = "receiveAnswer";
    Events["sendAnswers"] = "sendAnswers";
})(Events || (Events = {}));
exports.default = Events;
