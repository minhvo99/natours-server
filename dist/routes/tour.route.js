"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Tour_controller_1 = __importDefault(require("./../controllers/Tour.controller"));
const tourRoute = express_1.default.Router();
tourRoute.get('/', Tour_controller_1.default.getAllTour);
exports.default = tourRoute;
