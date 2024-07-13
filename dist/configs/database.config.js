"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB } = process.env;
const username = encodeURIComponent(`${MONGODB_USER}`);
const password = encodeURIComponent(`${MONGODB_PASSWORD}`);
const uri = `mongodb+srv://${username}:${password}@${MONGODB_HOST}/${MONGODB_DB}?retryWrites=true`;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(uri);
        console.log("Database connected successfully!");
    }
    catch (err) {
        console.log('Fail to connect to DB: ', err);
    }
});
exports.default = { connect };