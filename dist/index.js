"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const database_config_1 = __importDefault(require("./configs/database.config"));
//Connect to db
database_config_1.default.connect();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(express_1.default.static(`${__dirname}/assets`));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use('/api/v1', index_1.default);
app.listen(port, () => {
    return console.log(`Server is listening at http://localhost:${port}`);
});
exports.default = app;
