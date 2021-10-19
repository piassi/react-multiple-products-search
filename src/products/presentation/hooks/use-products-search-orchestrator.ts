import { NoProductsFoundError } from '@/products/domain/errors/no-products-found';
import { Product } from '@/products/domain/models/product';
import {
  ProductsSearch,
  ProductsSearchArgs,
} from '@/products/domain/use-cases/products-search';
import { SaveSearch } from '@/products/domain/use-cases/save-search';
import { useState } from 'react';
import { GENERIC_ERROR_MESSAGE } from '../products-page/constants';

type ProductsSearchOrchestratorResult = {
  products: Product[];
  runProductsSearch: (searchArgs: ProductsSearchArgs) => void;
  isLoading: boolean;
  errorMessage: string;
};

export function useProductsSearchOrchestrator(
  saveSearch: SaveSearch,
  productsSources: ProductsSearch[]
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
      .catch((e) => console.error(e));
  }

  function runProductsSearch(searchArgs: ProductsSearchArgs): void {
    setErrorMessage('');
    setHasSearchFinished(false);
    setIsLoading(true);
    setProducts([]);

    const productsSourcesPromises = [];

    productsSources.forEach((productsSource) => {
      const productSourcePromise = productsSource.execute(searchArgs);
      productsSourcesPromises.push(productSourcePromise);

      productSourcePromise
        .then((newProducts) =>
          setProducts((currentProducts) =>
            removeDuplicatedProducts(currentProducts, newProducts)
          )
        )
        .catch((error) => {
          if (error instanceof NoProductsFoundError) {
            setErrorMessage(NoProductsFoundError.message);
          } else {
            setErrorMessage(GENERIC_ERROR_MESSAGE);
          }
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
    runProductsSearch,
    products,
    isLoading,
    errorMessage,
  };
}
