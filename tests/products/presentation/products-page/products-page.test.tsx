import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { mock } from 'jest-mock-extended';
import faker from 'faker';
import { ProductsPage } from '@/products/presentation/products-page';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import { Product } from '@/products/domain/models/product';
import {
  MIN_PRICE_INPUT_LABEL,
  SEARCH_BUTTON_LABEL,
  SEARCH_INPUT_LABEL,
} from '@/products/presentation/products-page/constants';

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
  const mockProductsSearch = mock<ProductsSearch>();

  function renderSut(): void {
    render(<ProductsPage productsSearch={mockProductsSearch} />);
  }

  beforeEach(() => {
    mockProductsSearch.execute.mockResolvedValue(mockProductsSearchResponse);
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
        expect(mockProductsSearch.execute).toHaveBeenCalledWith({
          search: mockSearchedValue,
          minPrice: '',
        });
      });
    });

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

    describe('Given user has provided minimum price', () => {
      test('Then search products should be called with minimum price', async () => {
        renderSut();

        const mockMinPrice = '50';

        user.type(screen.getByLabelText(SEARCH_INPUT_LABEL), mockSearchedValue);
        user.type(screen.getByLabelText(MIN_PRICE_INPUT_LABEL), mockMinPrice);
        user.click(screen.getByRole('button', { name: SEARCH_BUTTON_LABEL }));

        await waitFor(() => {
          expect(mockProductsSearch.execute).toHaveBeenCalledWith({
            search: mockSearchedValue,
            minPrice: mockMinPrice,
          });
        });
      });
    });
  });
});
