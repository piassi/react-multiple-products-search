import { mock } from 'jest-mock-extended';
import { LocalLoadResource } from '@/data/local';
import { LocalProductsSearch } from '@/products/data/local/products-search';
import { LOCAL_SEARCH_KEY } from '@/products/data/local/constants';
import { Product } from '@/products/domain/models/product';

describe('Given Local Products Search ', () => {
  const mockLocalLoadResource = mock<LocalLoadResource>();

  const firstProduct = mock<Product>({ name: 'First product', price: '10' });
  const secondProduct = mock<Product>({ name: 'Second product', price: '50' });
  const thirdProduct = mock<Product>({ name: 'Third', price: '100' });

  beforeEach(() => {
    mockLocalLoadResource.load.mockReturnValue([
      firstProduct,
      secondProduct,
      thirdProduct,
    ]);
  });

  describe('When executed', () => {
    test('Then it should call LocalLoadResource', async () => {
      const sut = new LocalProductsSearch(mockLocalLoadResource);

      await sut.execute({
        search: 'mockSearch',
      });

      expect(mockLocalLoadResource.load).toHaveBeenCalledWith(LOCAL_SEARCH_KEY);
    });

    describe('Given is a search by keyword', () => {
      test('Then it should return only products with name that matches searched item', async () => {
        const sut = new LocalProductsSearch(mockLocalLoadResource);

        const searchedProducts = await sut.execute({
          search: 'product',
        });

        expect(searchedProducts).toEqual([firstProduct, secondProduct]);
      });

      describe('Given search has minPrice', () => {
        test('Then it should return only products with the minimum value provided', async () => {
          const sut = new LocalProductsSearch(mockLocalLoadResource);

          const searchedProducts = await sut.execute({
            search: 'product',
            minPrice: '50',
          });

          expect(searchedProducts).toEqual([secondProduct]);
        });
      });

      describe('Given search has maxPrice', () => {
        test('Then it should return only products with the maximum value provided', async () => {
          const sut = new LocalProductsSearch(mockLocalLoadResource);

          const searchedProducts = await sut.execute({
            search: 'product',
            maxPrice: '50',
          });

          expect(searchedProducts).toEqual([firstProduct, secondProduct]);
        });
      });
    });
  });
});
