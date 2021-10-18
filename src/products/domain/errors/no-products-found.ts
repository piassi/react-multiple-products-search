export class NoProductsFoundError extends Error {
  static readonly message = 'No products found for your search.';

  constructor() {
    super(NoProductsFoundError.message);
  }
}
