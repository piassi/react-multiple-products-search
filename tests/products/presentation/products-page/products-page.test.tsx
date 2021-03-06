import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { mock } from 'jest-mock-extended';
import faker from 'faker';
import { ProductsPage } from '@/products/presentation/products-page';
import { ProductsSource } from '@/products/domain/use-cases/products-source';
import { Product } from '@/products/domain/models/product';
import {
  MAX_PRICE_INPUT_LABEL,
  MIN_PRICE_INPUT_LABEL,
  SEARCH_BUTTON_LABEL,
  SEARCH_INPUT_LABEL,
} from '@/products/presentation/search-form/constants';
import {
  GENERIC_ERROR_MESSAGE,
  NO_PRODUCTS_ERROR_MESSAGE,
} from '@/products/presentation/products-page/constants';
import { useProductsSearchOrchestrator } from '@/products/presentation/hooks/use-products-search-orchestrator';
import { SaveSearch } from '@/products/domain/use-cases/save-search';

jest.mock('@/products/presentation/hooks/use-products-search-orchestrator');

const mockRunProductsSearch = jest.fn();
const mockUseProductsSearchOrchestrator =
  useProductsSearchOrchestrator as jest.Mock;

describe('Given products page', () => {
  const mockProductsSearchResponse: Product[] = [
    mock<Product>({
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      price: '',
      imageURL: '',
    }),
    mock<Product>({
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      price: '',
      imageURL: '',
    }),
  ];

  function renderSut(): void {
    render(
      <ProductsPage
        saveSearch={mock<SaveSearch>()}
        productsSearch={[mock<ProductsSource>()]}
      />
    );
  }

  beforeEach(() => {
    mockUseProductsSearchOrchestrator.mockReturnValue({
      products: mockProductsSearchResponse,
      runProductsSearch: mockRunProductsSearch,
    });
  });

  afterEach(jest.clearAllMocks);

  describe('When user use search form', () => {
    const mockSearchedValue = faker.random.words();

    function doUserSearch(): void {
      renderSut();

      user.type(screen.getByLabelText(SEARCH_INPUT_LABEL), mockSearchedValue);
      user.click(screen.getByRole('button', { name: SEARCH_BUTTON_LABEL }));
    }

    test('Then it should call SearchProducts w/ searched value', async () => {
      doUserSearch();

      await waitFor(() => {
        expect(mockRunProductsSearch).toHaveBeenCalledWith({
          search: mockSearchedValue,
          minPrice: '',
          maxPrice: '',
        });
      });
    });

    describe('Given products were found', () => {
      test('Then it should list products', async () => {
        doUserSearch();

        await waitFor(() => {
          expect(
            screen.queryByText(mockProductsSearchResponse[0].name)
          ).toBeInTheDocument();
          expect(
            screen.queryByText(mockProductsSearchResponse[1].name)
          ).toBeInTheDocument();
        });
      });
    });

    describe('Given user has provided minimum price', () => {
      test('Then search products should be called with minimum price', async () => {
        renderSut();

        const mockMinPrice = '50';

        user.type(screen.getByLabelText(SEARCH_INPUT_LABEL), mockSearchedValue);
        user.type(screen.getByLabelText(MIN_PRICE_INPUT_LABEL), mockMinPrice);
        user.click(screen.getByRole('button', { name: SEARCH_BUTTON_LABEL }));

        await waitFor(() => {
          expect(mockRunProductsSearch).toHaveBeenCalledWith({
            search: mockSearchedValue,
            minPrice: mockMinPrice,
            maxPrice: '',
          });
        });
      });
    });

    describe('Given user has provided maximum price', () => {
      test('Then search products should be called with maximum price', async () => {
        renderSut();

        const mockMaxPrice = '100';

        user.type(screen.getByLabelText(SEARCH_INPUT_LABEL), mockSearchedValue);
        user.type(screen.getByLabelText(MAX_PRICE_INPUT_LABEL), mockMaxPrice);
        user.click(screen.getByRole('button', { name: SEARCH_BUTTON_LABEL }));

        await waitFor(() => {
          expect(mockRunProductsSearch).toHaveBeenCalledWith({
            search: mockSearchedValue,
            minPrice: '',
            maxPrice: mockMaxPrice,
          });
        });
      });
    });

    describe('Given search has no results', () => {
      beforeEach(() => {
        mockUseProductsSearchOrchestrator.mockReturnValue({
          errorMessage: NO_PRODUCTS_ERROR_MESSAGE,
          runProductsSearch: mockRunProductsSearch,
          products: [],
        });
      });

      test('Then "No search results" message should be displayed', async () => {
        renderSut();

        user.type(screen.getByLabelText(SEARCH_INPUT_LABEL), mockSearchedValue);
        user.click(screen.getByRole('button', { name: SEARCH_BUTTON_LABEL }));

        await waitFor(() => {
          expect(
            screen.getByText(NO_PRODUCTS_ERROR_MESSAGE)
          ).toBeInTheDocument();
        });
      });
    });

    describe('Given search fails unexpectedly', () => {
      beforeEach(() => {
        mockUseProductsSearchOrchestrator.mockReturnValue({
          errorMessage: GENERIC_ERROR_MESSAGE,
          runProductsSearch: mockRunProductsSearch,
          products: [],
        });
      });

      test('Then generic error message should be displayed', async () => {
        renderSut();

        user.type(screen.getByLabelText(SEARCH_INPUT_LABEL), mockSearchedValue);
        user.click(screen.getByRole('button', { name: SEARCH_BUTTON_LABEL }));

        await waitFor(() => {
          expect(screen.getByText(GENERIC_ERROR_MESSAGE)).toBeInTheDocument();
        });
      });
    });
  });
});
