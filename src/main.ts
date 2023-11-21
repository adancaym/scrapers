import { SorianaShop } from "./scrappers";

const scrapper = new SorianaShop(
    'https://www.soriana.com/buscar',
    'arroz'
    );

(async () => {
    scrapper.start();
})();