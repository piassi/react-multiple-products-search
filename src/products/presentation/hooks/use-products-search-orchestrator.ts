import { Product } from '@/products/domain/models/product';
import {
  ProductsSource,
  ProductsSearchArgs,
} from '@/products/domain/use-cases/products-source';
import { SaveSearch } from '@/products/domain/use-cases/save-search';
import { useState } from 'react';
import { GENERIC_ERROR_MESSAGE } from '../products-page/constants';

type ProductsSearchOrchestratorResult = {
  hasSearchFinished: boolean;
  products: Product[];
  runProductsSearch: (searchArgs: ProductsSearchArgs) => void;
  isLoading: boolean;
  errorMessage: string;
};

export function useProductsSearchOrchestrator(
  saveSearch: SaveSearch,
  productsSources: ProductsSource[]
): ProductsSearchOrchestratorResult {
  const [errorMessage, setErrorMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearchFinished, setHasSearchFinished] = useState(false);

  function removeDuplicatedProducts(
    currentProducts: Product[],
    newProducts: Product[]
  ): Product[] {
    let uniqueProducts = [...currentProducts];

    newProducts.forEach((productToAdd) => {
      const productAlreadyListed = uniqueProducts.some(
        (p) => p.id === productToAdd.id
      );

      if (!productAlreadyListed) {
        uniqueProducts = [
          ...uniqueProducts.filter((p) => p.id !== productToAdd.id),
          productToAdd,
        ];
      }
    });

    return uniqueProducts;
  }

  function onAllSourcesFinish(productsSourcesPromises: unknown[]): void {
    Promise.all(productsSourcesPromises)
      .then(() => {
        setHasSearchFinished(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error.message);
      });
  }

  function runProductsSearch(searchArgs: ProductsSearchArgs): void {
    setErrorMessage('');
    setHasSearchFinished(false);
    setIsLoading(true);
    setProducts([]);

    const productsSourcesPromises = [];

    productsSources.forEach((productsSource) => {
      const productSourcePromise = productsSource.search(searchArgs);
      productsSourcesPromises.push(productSourcePromise);

      productSourcePromise
        .then((newProducts) =>
          setProducts((currentProducts) =>
            removeDuplicatedProducts(currentProducts, newProducts)
          )
        )
        .catch(() => {
          setErrorMessage(GENERIC_ERROR_MESSAGE);
          setIsLoading(false);
          setHasSearchFinished(true);
        });
    });

    onAllSourcesFinish(productsSourcesPromises);
  }

  if (hasSearchFinished) {
    saveSearch.execute(products).catch((e) => console.error(e));
  }

  return {
    hasSearchFinished,
    runProductsSearch,
    products,
    isLoading,
    errorMessage,
  };
}
