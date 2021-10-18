import { LocalStorageClient } from '@/infra/local-storage-client';

describe('Given Local Storage client', () => {
  describe('When saveLocal is called', () => {
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
});
