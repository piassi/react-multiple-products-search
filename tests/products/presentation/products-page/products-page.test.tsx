import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { mock } from 'jest-mock-extended';
import faker from 'faker';
import { ProductsPage } from '@/products/presentation/products-page';
import { ProductsSearch } from '@/products/domain/use-cases/products-search';
import { Product } from '@/products/domain/models/product';
import {
  SEARCH_BUTTON_LABEL,
  SEARCH_INPUT_LABEL,
} from '@/products/presentation/products-page/constants';

describe('Given products page', () => {
  const mockProductsSearchResponse: Product[] = [
    mock<Product>({
      name: faker.random.words(),
    }),
    mock<Product>({
      name: faker.random.words(),
    }),
  ];
  const mockProductsSearch = mock<ProductsSearch>();

  function renderSut() {
    render(<ProductsPage productsSearch={mockProductsSearch} />);
  }

  beforeEach(() => {
    mockProductsSearch.execute.mockResolvedValue(mockProductsSearchResponse);
  });

  afterEach(jest.clearAllMocks);

  describe('When user use search form', () => {
    const mockSearchedValue = faker.random.words();

    beforeEach(() => {
      renderSut();

      user.type(screen.getByLabelText(SEARCH_INPUT_LABEL), mockSearchedValue);
      user.click(screen.getByRole('button', { name: SEARCH_BUTTON_LABEL }));
    });

    test('Then it should call SearchProducts w/ searched value', () => {
      expect(mockProductsSearch.execute).toHaveBeenCalledWith(
        mockSearchedValue
      );
    });
  });
});
