import { mock } from 'jest-mock-extended';
import {
  EbayFindApiPostClient,
  EbayProductsSource,
} from '@/products/data/ebay/products-source';
import faker from 'faker';
import { ebayEndpoints } from '@/products/data/ebay/endpoints';
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

  afterEach(jest.clearAllMocks);

  test('Should call HttpPostClient with correct arguments', async () => {
    const sut = new EbayProductsSource(mockHttpPostClient);

    const mockSearch = faker.random.words();

    await sut.search({ search: mockSearch });

    expect(mockHttpPostClient.post).toHaveBeenCalledWith({
      url: ebayEndpoints.findByKeyword,
      body: `<?xml version="1.0" encoding="UTF-8"?>
<findItemsByKeywordsRequest xmlns="http://www.ebay.com/marketplace/search/v1/services">
  <keywords>${mockSearch}</keywords>
</findItemsByKeywordsRequest>`,
    });
  });

  test('Should return Products list', async () => {
    const sut = new EbayProductsSource(mockHttpPostClient);
    const { findItemsByKeywordsResponse } = findItemsByKeywordsRequestStub;
    const mockItems = findItemsByKeywordsResponse[0].searchResult[0].item;

    const response = await sut.search({ search: 'mockSearch' });

    const priceFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    expect(response).toEqual([
      {
        id: mockItems[0].itemId[0],
        name: mockItems[0].title[0],
        price: priceFormatter.format(
          parseInt(mockItems[0].sellingStatus[0].currentPrice[0].__value__)
        ),
        imageURL: mockItems[0].galleryURL[0],
      },
      {
        id: mockItems[1].itemId[0],
        name: mockItems[1].title[0],
        price: priceFormatter.format(
          parseInt(mockItems[1].sellingStatus[0].currentPrice[0].__value__)
        ),
        imageURL: mockItems[1].galleryURL[0],
      },
      {
        id: mockItems[2].itemId[0],
        name: mockItems[2].title[0],
        price: priceFormatter.format(
          parseInt(mockItems[2].sellingStatus[0].currentPrice[0].__value__)
        ),
        imageURL: mockItems[2].galleryURL[0],
      },
    ]);
  });

  describe('Given Ebay api returns no results', () => {
    beforeEach(() => {
      mockHttpPostClient.post.mockResolvedValue({
        statusCode: HttpStatusCodes.success,
        body: {
          findItemsByKeywordsResponse: [
            {
              ack: ['Success'],
              searchResult: [{ '@count': '0' }],
            },
          ],
        },
      });
    });

    test('Then it should return empty array', async () => {
      const sut = new EbayProductsSource(mockHttpPostClient);

      const result = await sut.search({
        search: 'mockSearch',
      });

      expect(result).toEqual([]);
    });
  });

  describe('Given Ebay api return failure', () => {
    beforeEach(() => {
      mockHttpPostClient.post.mockResolvedValue({
        statusCode: HttpStatusCodes.success,
        body: {
          findItemsByKeywordsResponse: [
            {
              ack: ['Failure'],
              searchResult: [],
            },
          ],
        },
      });
    });

    test('Then it should return empty array', async () => {
      const sut = new EbayProductsSource(mockHttpPostClient);

      const result = await sut.search({
        search: 'mockSearch',
      });

      expect(result).toEqual([]);
    });
  });

  describe('Given min price is provided', () => {
    test('Then it should send minPrice filter on req body', async () => {
      const sut = new EbayProductsSource(mockHttpPostClient);

      const mockSearch = faker.random.words();
      const mockMinPrice = '50';

      await sut.search({ search: mockSearch, minPrice: mockMinPrice });

      expect(mockHttpPostClient.post).toHaveBeenCalledWith({
        url: ebayEndpoints.findByKeyword,
        body: `<?xml version="1.0" encoding="UTF-8"?>
<findItemsByKeywordsRequest xmlns="http://www.ebay.com/marketplace/search/v1/services">
  <keywords>${mockSearch}</keywords>
  <itemFilter>
    <name>MinPrice</name>
    <value>${mockMinPrice}</value>
  </itemFilter>
</findItemsByKeywordsRequest>`,
      });
    });
  });

  describe('Given max price is provided', () => {
    test('Then it should send maxPrice filter on req body', async () => {
      const sut = new EbayProductsSource(mockHttpPostClient);

      const mockSearch = faker.random.words();
      const mockMaxPrice = '100';

      await sut.search({ search: mockSearch, maxPrice: mockMaxPrice });

      expect(mockHttpPostClient.post).toHaveBeenCalledWith({
        url: ebayEndpoints.findByKeyword,
        body: `<?xml version="1.0" encoding="UTF-8"?>
<findItemsByKeywordsRequest xmlns="http://www.ebay.com/marketplace/search/v1/services">
  <keywords>${mockSearch}</keywords>
  <itemFilter>
    <name>MaxPrice</name>
    <value>${mockMaxPrice}</value>
  </itemFilter>
</findItemsByKeywordsRequest>`,
      });
    });
  });
});
