import { ScrapperBrowserInterface } from "./scrapper.browser.interface";
import { ScreapperPageInterface } from "./scrapper.page.interface";

export interface ScrapperInterface {
    url: string;
    keyword: string;
    browser: ScrapperBrowserInterface | null;
    page: ScreapperPageInterface | null;
}
