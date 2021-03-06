import {
  ProductsSource,
  ProductsSearchArgs,
} from '../../domain/use-cases/products-source';
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
    searchResult: Array<{
      '@count': string;
      item?: EbayFindApiResponseItem[];
    }>;
  }>;
};

export type EbayFindApiPostClient = HttpPostClient<string, EbayFindApiResponse>;

export class EbayProductsSource implements ProductsSource {
  constructor(private readonly httpPostClient: EbayFindApiPostClient) {}

  findByKeywordBody(searchArgs: ProductsSearchArgs): string {
    const { search, minPrice, maxPrice } = searchArgs;

    const body = xmlbuilder
      .create('findItemsByKeywordsRequest', {
        encoding: 'UTF-8',
        version: '1.0',
      })
      .attribute('xmlns', 'http://www.ebay.com/marketplace/search/v1/services')
      .element('keywords', search);

    if (minPrice) {
      body
        .root()
        .element('itemFilter')
        .element('name', 'MinPrice')
        .insertAfter('value', minPrice);
    }

    if (maxPrice) {
      body
        .root()
        .element('itemFilter')
        .element('name', 'MaxPrice')
        .insertAfter('value', maxPrice);
    }

    return body.end({ pretty: true });
  }

  async search(searchArgs: ProductsSearchArgs): Promise<Product[]> {
    const response = await this.httpPostClient.post({
      url: ebayEndpoints.findByKeyword,
      body: this.findByKeywordBody(searchArgs),
    });

    const [ebayResponseStatus] =
      response.body.findItemsByKeywordsResponse[0].ack;

    if (ebayResponseStatus !== 'Success') {
      return [];
    }

    const ebayResponse =
      response.body.findItemsByKeywordsResponse[0].searchResult[0];

    if (parseInt(ebayResponse['@count']) <= 0) {
      return [];
    }

    const ebayProducts = ebayResponse.item;

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
