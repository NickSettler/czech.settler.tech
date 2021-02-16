import DirectusSDK from "@directus/sdk-js";

export default class Api extends DirectusSDK {
  private static API_URL = "https://cms.settler.tech/";
  private static instance: Api;

  private constructor(url: string) {
      super(url);
  }

  public static getInstance(): DirectusSDK {
      if (!Api.instance) {
          Api.instance = new Api(Api.API_URL);
      }

      return Api.instance;
  }
}
