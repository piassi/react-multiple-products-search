import { ProductsSearch } from '../../domain/use-cases/products-search';
import { Product } from '../../domain/models/product';
import { HttpPostClient } from '@/data/http';
import { ebayEndpoints } from './endpoints';
import xmlbuilder from 'xmlbuilder';

type EbayFindApiResponseItem = {
  itemId: string[];
  title: string[];
  galleryURL: string[];
  sellingStatus: Array<{
    currentPrice: Array<{
      '@currencyId': string;
      __value__: string;
    }>;
  }>;
};

type EbayFindApiResponse = {
  findItemsByKeywordsResponse: Array<{
    ack: string[];
    version: string[];
    timestamp: string[];
    searchResult: Array<{
      '@count': string;
      item: EbayFindApiResponseItem[];
    }>;
  }>;
};

export type EbayFindApiPostClient = HttpPostClient<string, EbayFindApiResponse>;

export class EbayProductsSearch implements ProductsSearch {
  constructor(private readonly httpPostClient: EbayFindApiPostClient) {}

  findByKeywordBody(search: string): string {
    const body = {
      findItemsByKeywordsRequest: {
        '@xmlns': 'http://www.ebay.com/marketplace/search/v1/services',
        keywords: {
          '#text': search,
        },
      },
    };

    return xmlbuilder.create(body, { version: '1.0', encoding: 'UTF-8' }).end();
  }

  async execute(search: string): Promise<Product[]> {
    const response = await this.httpPostClient.post({
      url: ebayEndpoints.findByKeyword,
      body: this.findByKeywordBody(search),
    });

    const ebayProducts =
      response.body.findItemsByKeywordsResponse[0].searchResult[0].item;

    const priceFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return ebayProducts.map((ebayProduct) => ({
      id: ebayProduct.itemId[0],
      name: ebayProduct.title[0],
      price: priceFormatter.format(
        parseInt(ebayProduct.sellingStatus[0].currentPrice[0].__value__)
      ),
      imageURL: ebayProduct?.galleryURL[0],
    }));
  }
}
