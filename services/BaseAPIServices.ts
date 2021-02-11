import axios, { AxiosResponse } from 'axios';
import { getAccessToken } from '../auth/msalHelpers';
import { APIConfigs } from '../Config';

class BaseApiService {

  // private readonly corsProxyUrl = 'https://adneovrebo-cors-anywhere.herokuapp.com/';
  private readonly corsProxyUrl = '';

  async get(path: string): Promise<AxiosResponse<any>> {
    return axios.get(this.corsProxyUrl + APIConfigs.url + path, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
  }

  async post(path: string, data: object): Promise<AxiosResponse<any>> {
    return axios.post(this.corsProxyUrl + APIConfigs.url + path, data, {
      headers: {
        ContentType: 'application/json',
        Authorization: await getAccessToken(),
      },
    });
  }

  async put(url: string, data: object): Promise<AxiosResponse<any>> {
    return axios.put(this.corsProxyUrl + APIConfigs.url + url, data, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
  }

  async patch(path: string, data: object): Promise<AxiosResponse<any>> {
    return axios.patch(this.corsProxyUrl + APIConfigs.url + path, data, {
      headers: {
        Authorization: await getAccessToken(),
      },
    });
  }

  async delete(path: string, data?: object): Promise<AxiosResponse<any>> {
    return axios.delete(this.corsProxyUrl + APIConfigs.url + path, {
      headers: {
        Authorization: await getAccessToken(),
      },
      data: data ?? null,
    });
  }

  async uploadFile(path: string, formData: any): Promise<AxiosResponse<any>> {
    return axios.post(this.corsProxyUrl + APIConfigs.url + path, formData, {
      headers: {
        Authorization: await getAccessToken(),
        'content-type': 'multipart/form-data',
      },
    });
  }

}

export default new BaseApiService();
