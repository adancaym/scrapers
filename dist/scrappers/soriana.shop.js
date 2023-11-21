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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SorianaShop = void 0;
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const anonymizeUA = require('puppeteer-extra-plugin-anonymize-ua');
puppeteer.use(anonymizeUA());
const userPreferences = require('puppeteer-extra-plugin-user-preferences');
puppeteer.use(userPreferences({ userPrefs: {
        webkit: {
            webprefs: {
                default_font_size: 22
            }
        }
    } }));
class SorianaShop {
    constructor(url, keyword) {
        this.url = url;
        this.browser = null;
        this.page = null;
        this.keyword = keyword;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer.launch({
                headless: false, slowMo: 100,
                args: ['--start-maximized, --disable-infobars'],
                ignoreDefaultArgs: ['--enable-automation']
            });
            if (!this.browser)
                throw new Error('Browser not found');
            const context = this.browser.defaultBrowserContext();
            yield context.overridePermissions(this.url, ['geolocation', 'notifications']);
            this.page = yield this.browser.newPage();
            yield this.page.goto(this.url, { waitUntil: "networkidle2" });
            yield this.page.waitForSelector('#searchBtnTrack');
            yield this.typeSearch();
        });
    }
    typeSearch() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.type('#searchBtnTrack', this.keyword));
            yield ((_b = this.page) === null || _b === void 0 ? void 0 : _b.click('button[name="search-button"]'));
            yield ((_c = this.page) === null || _c === void 0 ? void 0 : _c.waitForSelector('.product-recommendations'));
            yield this.goToInventory();
        });
    }
    goToInventory() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const propducts = yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.evaluate(() => {
                var _a, _b, _c, _d, _e, _f;
                const elements = (_a = document.querySelectorAll('.product')) !== null && _a !== void 0 ? _a : [];
                const products = [];
                for (const element of Array.from(elements)) {
                    const price = (_c = (_b = element.querySelector('.cart-price')) === null || _b === void 0 ? void 0 : _b.textContent) !== null && _c !== void 0 ? _c : '';
                    const name = (_e = (_d = element.querySelector('.ellipsis-product-name')) === null || _d === void 0 ? void 0 : _d.textContent) !== null && _e !== void 0 ? _e : '';
                    const id = (_f = element.getAttribute('data-pid')) !== null && _f !== void 0 ? _f : '';
                    const result = { price, name, id };
                    products.push(result);
                }
                return products;
            }));
            console.log(propducts);
            if (yield this.hasNextButton()) {
                yield ((_b = this.page) === null || _b === void 0 ? void 0 : _b.click('.show-more .slick-next'));
                yield ((_c = this.page) === null || _c === void 0 ? void 0 : _c.waitForSelector('.product-recommendations'));
                this.goToInventory();
            }
        });
    }
    hasNextButton() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            return (_b = (_a = this.page) === null || _a === void 0 ? void 0 : _a.evaluate(() => !!document.querySelectorAll('.show-more .slick-next')).then((result) => result !== null && result !== void 0 ? result : false)) !== null && _b !== void 0 ? _b : false;
        });
    }
    getProducts() {
        return Promise.resolve();
    }
    getProductsData() {
        return Promise.resolve();
    }
    formatProductsData() {
        return Promise.resolve();
    }
    saveProductsData() {
        return Promise.resolve();
    }
    end() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.close());
            yield ((_b = this.browser) === null || _b === void 0 ? void 0 : _b.close());
        });
    }
}
exports.SorianaShop = SorianaShop;
