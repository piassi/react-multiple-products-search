import { mock } from 'jest-mock-extended';
import {
  EbayFindApiPostClient,
  EbayProductsSearch,
} from '@/products/data/ebay-products-search';
import faker from 'faker';
import { ebayEndpoints } from '@/products/data/endpoints';
import { HttpStatusCodes } from '@/data/http';
import { findItemsByKeywordsRequestStub } from './ebay-keyword-response-stub';

describe('Ebay Products Search', () => {
  const mockHttpPostClient = mock<EbayFindApiPostClient>();

  beforeEach(() => {
    mockHttpPostClient.post.mockResolvedValue({
      statusCode: HttpStatusCodes.success,
      body: findItemsByKeywordsRequestStub,
    });
  });

  test('Should call HttpPostClient with correct arguments', async () => {
    const sut = new EbayProductsSearch(mockHttpPostClient);

    const mockSearch = faker.random.words();

    await sut.execute(mockSearch);

    expect(mockHttpPostClient.post).toHaveBeenCalledWith({
      url: ebayEndpoints.findByKeyword,
      body: `<?xml version="1.0" encoding="UTF-8"?><findItemsByKeywordsRequest xmlns="http://www.ebay.com/marketplace/search/v1/services"><keywords>${mockSearch}</keywords></findItemsByKeywordsRequest>`,
    });
  });

  test('Should return Products list', async () => {
    const sut = new EbayProductsSearch(mockHttpPostClient);
    const { findItemsByKeywordsResponse } = findItemsByKeywordsRequestStub;
    const mockItems = findItemsByKeywordsResponse[0].searchResult[0].item;

    const response = await sut.execute(`mockSearch`);

    expect(response).toEqual([
      {
        id: mockItems[0].itemId[0],
        name: mockItems[0].title[0],
        price: mockItems[0].sellingStatus[0].currentPrice[0].__value__,
      },
      {
        id: mockItems[1].itemId[0],
        name: mockItems[1].title[0],
        price: mockItems[1].sellingStatus[0].currentPrice[0].__value__,
      },
      {
        id: mockItems[2].itemId[0],
        name: mockItems[2].title[0],
        price: mockItems[2].sellingStatus[0].currentPrice[0].__value__,
      },
    ]);
  });
});
