import faker from 'faker';
import axios from 'axios';
import { AxiosHttpClient } from '@/infra/axios-http-client';
import { mocked } from 'ts-jest/utils';

jest.mock('axios');

type SutTyes = {
  sut: AxiosHttpClient;
  mockUrl: string;
  mockBody: any;
};

const makeSut = (): SutTyes => {
  const sut = new AxiosHttpClient();
  const mockUrl = faker.internet.url();
  const mockBody = faker.random.objectElement();

  return {
    sut,
    mockBody,
    mockUrl,
  };
};

describe('AxiosHttpClient', () => {
  describe('post', () => {
    it('should call axios.post with correct values', async () => {
      const { sut, mockBody, mockUrl } = makeSut();

      mocked(axios.post).mockResolvedValueOnce({
        status: 200,
        data: faker.datatype.json(),
      });

      await sut.post({
        url: mockUrl,
        body: mockBody,
      });

      expect(axios.post).toHaveBeenCalledWith(mockUrl, mockBody, {
        headers: {},
      });
    });

    it('should return HttpResponse', async () => {
      const { sut, mockBody, mockUrl } = makeSut();
      const mockResponse = {
        data: faker.datatype.json(),
        status: 200,
      };

      mocked(axios.post).mockResolvedValueOnce(mockResponse);

      const response = await sut.post({
        url: mockUrl,
        body: mockBody,
      });

      expect(response).toEqual({
        statusCode: mockResponse.status,
        body: mockResponse.data,
      });
    });
  });
});
