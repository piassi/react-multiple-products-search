import { LocalStorageClient } from '@/infra/local-storage-client';

const mockGetItem = localStorage.getItem as jest.Mock;

describe('Given Local Storage client', () => {
  describe('When save is called', () => {
    test('Then it should call localStorage with correct key and value', () => {
      const sut = new LocalStorageClient();
      const mockKey = 'mockKey';
      const mockValue = [{ mock: 'value' }];
      sut.save(mockKey, mockValue);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        mockKey,
        JSON.stringify(mockValue)
      );
    });
  });

  describe('When load is called', () => {
    test('Then it should call localStorage with correct key', () => {
      const sut = new LocalStorageClient();
      const mockKey = 'mockKey';
      sut.load(mockKey);
      expect(mockGetItem).toHaveBeenCalledWith(mockKey);
    });

    test('Then it should return parsed items', () => {
      const mockValue = [{ mock: 'value' }];
      mockGetItem.mockReturnValue(JSON.stringify(mockValue));
      const sut = new LocalStorageClient();
      const mockKey = 'mockKey';
      const result = sut.load(mockKey);
      expect(result).toEqual(mockValue);
    });
  });
});
