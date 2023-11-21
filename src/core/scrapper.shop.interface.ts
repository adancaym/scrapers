import { ScrapperInterface } from "./scrapper.interface";

export interface ScrapperShopInterface extends ScrapperInterface{

    start(): Promise<void>;
    goToInventory(): Promise<void>;
    typeSearch(): Promise<void>;
    getProducts(): Promise<void>;
    getProductsData(): Promise<void>;
    formatProductsData(): Promise<void>;
    saveProductsData(): Promise<void>;
    end(): Promise<void>;
}