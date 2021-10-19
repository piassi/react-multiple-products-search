import { LocalLoadResource, LocalSaveResource } from '@/data/local';
import { LocalSaveSearch } from '@/products/data/local/save-search';
import { Product } from '@/products/domain/models/product';
import { mock } from 'jest-mock-extended';
import faker from 'faker';
import { LOCAL_SEARCH_KEY } from '@/products/data/local/constants';

describe('Local Save Search', () => {
  const mockLocalSaveResource = mock<LocalSaveResource>();
  const mockLocalLoadResource = mock<LocalLoadResource>();
  const mockStoredProducts = [mock<Product>({ name: faker.random.words() })];

  afterEach(jest.clearAllMocks);

  beforeEach(() => {
    mockLocalLoadResource.load.mockReturnValue(mockStoredProducts);
  });

  describe('Given LocalSaveSearch.execute is called', () => {
    test('Then it should load stored search results', async () => {
      const sut = new LocalSaveSearch(
        mockLocalSaveResource,
        mockLocalLoadResource
      );
      const mockSearchResults = [mock<Product>({ name: faker.random.words() })];

      await sut.execute(mockSearchResults);

      expect(mockLocalLoadResource.load).toHaveBeenCalledWith(LOCAL_SEARCH_KEY);
    });

    test('Then it should call localSaveResource with search results', async () => {
      const sut = new LocalSaveSearch(
        mockLocalSaveResource,
        mockLocalLoadResource
      );
      const mockSearchResults = [mock<Product>({ name: faker.random.words() })];

      await sut.execute(mockSearchResults);

      expect(mockLocalSaveResource.save).toHaveBeenCalledWith(
        LOCAL_SEARCH_KEY,
        [...mockStoredProducts, ...mockSearchResults]
      );
    });
  });
});
