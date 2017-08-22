"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpClient_service_1 = require("./httpClient.service");
//import { LoaderService } from '../core/loader/loader.service';
function httpServiceFactory(http, localStorageService) {
    return new httpClient_service_1.HttpClient(http, localStorageService);
}
exports.httpServiceFactory = httpServiceFactory;
//# sourceMappingURL=httpClient.factory.js.map