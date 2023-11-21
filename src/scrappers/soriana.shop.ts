const puppeteer = require('puppeteer-extra')

import {
  ScrapperBrowserInterface,
  ScrapperShopInterface,
  ScreapperPageInterface,
} from '../core';


const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
const anonymizeUA = require('puppeteer-extra-plugin-anonymize-ua')
puppeteer.use(anonymizeUA())

const userPreferences = require('puppeteer-extra-plugin-user-preferences')

puppeteer.use(userPreferences({userPrefs: {
  webkit: {
    webprefs: {
      default_font_size: 22
    }
  }
}}))

export class SorianaShop implements ScrapperShopInterface {
  keyword: string;
  url: string;
  browser: ScrapperBrowserInterface | null;
  page: ScreapperPageInterface | null;

  constructor(url: string, keyword: string) {
    this.url = url;
    this.browser = null;
    this.page = null;
    this.keyword = keyword;
  }

  async start(): Promise<void> {
    this.browser = await puppeteer.launch({ 
      headless: false,slowMo: 100,
      args: ['--start-maximized, --disable-infobars'],
      ignoreDefaultArgs: ['--enable-automation']

    });
    if(!this.browser) throw new Error('Browser not found');
    const context = this.browser.defaultBrowserContext();
    
    await context.overridePermissions(this.url, ['geolocation', 'notifications']);

    this.page = await this.browser.newPage();
    await this.page.goto(this.url,{waitUntil: "networkidle2"});
    await this.page.waitForSelector('#searchBtnTrack');
    await this.typeSearch();
  }
  async typeSearch(): Promise<void> {
    await this.page?.type('#searchBtnTrack', this.keyword);
    await this.page?.click('button[name="search-button"]');
    await this.page?.waitForSelector('.product-recommendations');
    await this.goToInventory();
  }
  async goToInventory(): Promise<void> {
    const propducts = await this.page?.evaluate(() => {
      const elements = document.querySelectorAll('.product') ?? [];
      const products = [];
      for (const element of Array.from(elements)) {
        const price = element.querySelector('.cart-price')?.textContent ?? '';
        const name = element.querySelector('.ellipsis-product-name')?.textContent ?? '';
        const id = element.getAttribute('data-pid') ?? '';
        const result = { price, name, id };
        products.push(result);
      }  
      return products;
    });
  
    console.log(propducts);
    if( await this.hasNextButton()){
      await this.page?.click('.show-more .slick-next');
      await this.page?.waitForSelector('.product-recommendations');
      this.goToInventory();
    }
   
  }

  async hasNextButton(): Promise<boolean> {
    return this.page?.evaluate(() => !!document.querySelectorAll('.show-more .slick-next'))
    .then((result) => result ?? false) ?? false;
  }

  getProducts(): Promise<void> {
   return Promise.resolve();
  }
  getProductsData(): Promise<void> {
    return Promise.resolve();
  }
  formatProductsData(): Promise<void> {
    return Promise.resolve();
  }
  saveProductsData(): Promise<void> {
    return Promise.resolve();
  }
  async end(): Promise<void> {
    await this.page?.close();
    await this.browser?.close();
  }
}
