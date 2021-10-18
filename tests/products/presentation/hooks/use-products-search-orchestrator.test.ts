import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { useProductsSearchOrchestrator } from '@/products/presentation/hooks/use-products-search-orchestrator';
import { mock } from 'jest-mock-extended';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import { Product } from '@/products/domain/models/product';
import faker from 'faker';
import { waitFor } from '@testing-library/dom';
import { SaveSearch } from '@/products/domain/use-cases/save-search';

describe('Given Products Search Orchestrator', () => {
  afterEach(jest.clearAllMocks);

  describe('When run products search', () => {
    const mockSourceOne = mock<ProductsSearch>();
    const mockSourceTwo = mock<ProductsSearch>();
    const mockProductOne = mock<Product>({
      name: faker.random.words(),
      price: '10',
      id: faker.datatype.uuid(),
    });
    const mockProductTwo = mock<Product>({
      name: faker.random.words(),
      price: '20',
      id: faker.datatype.uuid(),
    });
    const mockProductThree = mock<Product>({
      name: faker.random.words(),
      price: '30',
      id: faker.datatype.uuid(),
    });
    const mockProductsSources = [mockSourceOne, mockSourceTwo];

    const mockSaveSearch = mock<SaveSearch>();
    const mockSearchArgs = { search: 'mockSearch' };

    beforeEach(() => {
      mockSaveSearch.execute.mockResolvedValue();

      mockProductsSources[0].execute.mockResolvedValue([
        mockProductOne,
        mockProductTwo,
      ]);

      mockProductsSources[1].execute.mockResolvedValue([mockProductThree]);
    });

    test('Then it should call all productsSources with search args', async () => {
      const { result } = renderHook(() =>
        useProductsSearchOrchestrator(mockSaveSearch, mockProductsSources)
      );

      act(() => {
        result.current.runProductsSearch(mockSearchArgs);
      });

      await waitFor(() => {
        mockProductsSources.forEach((source) => {
          expect(source.execute).toHaveBeenCalledWith(mockSearchArgs);
        });
      });
    });

    test('Then it should add products from sources to returned products', async () => {
      const { result } = renderHook(() =>
        useProductsSearchOrchestrator(mockSaveSearch, mockProductsSources)
      );

      act(() => {
        result.current.runProductsSearch(mockSearchArgs);
      });

      await waitFor(() => {
        expect(result.current.products).toEqual([
          mockProductOne,
          mockProductTwo,
          mockProductThree,
        ]);
      });
    });

    test('Then it should save user search', async () => {
      const { result } = renderHook(() =>
        useProductsSearchOrchestrator(mockSaveSearch, mockProductsSources)
      );

      act(() => {
        result.current.runProductsSearch(mockSearchArgs);
      });

      await waitFor(() => {
        expect(mockSaveSearch.execute).toHaveBeenCalledWith([
          mockProductOne,
          mockProductTwo,
          mockProductThree,
        ]);
      });
    });

    describe('Given source returned product already listed', () => {
      test('Then it should not be added twice to the list', async () => {
        const mockRepeatedProduct = mock<Product>({
          name: faker.random.words(),
          price: '10',
          id: faker.datatype.uuid(),
        });
        const mockProductTwo = mock<Product>({
          name: faker.random.words(),
          price: '20',
          id: faker.datatype.uuid(),
        });

        mockProductsSources[0].execute.mockResolvedValue([
          mockRepeatedProduct,
          mockProductTwo,
        ]);

        mockProductsSources[1].execute.mockResolvedValue([
          { ...mockRepeatedProduct },
        ]);

        const { result } = renderHook(() =>
          useProductsSearchOrchestrator(mockSaveSearch, mockProductsSources)
        );

        act(() => {
          result.current.runProductsSearch(mockSearchArgs);
        });

        await waitFor(() => {
          expect(result.current.products).toEqual([
            mockRepeatedProduct,
            mockProductTwo,
          ]);
        });
      });
    });
  });
});
