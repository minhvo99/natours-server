"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tour_route_1 = __importDefault(require("./tour.route"));
const user_route_1 = __importDefault(require("./user.route"));
const appRouter = express_1.default.Router();
appRouter.use('./tour', tour_route_1.default);
appRouter.use('./user', user_route_1.default);
exports.default = appRouter;
