declare module "facebook-nodejs-business-sdk" {
  type AdImageResponse = {
    _data?: {
      images?: Record<string, { hash?: string }>;
    };
  };

  class FacebookAdsApi {
    static init(accessToken: string, locale?: string, crashLog?: boolean): FacebookAdsApi;
  }

  class AdAccount {
    constructor(id: string);
    createAdImage(fields: string[], params?: { bytes: string }, pathOverride?: string | null): Promise<AdImageResponse>;
  }

  const bizSdk: {
    FacebookAdsApi: typeof FacebookAdsApi;
    AdAccount: typeof AdAccount;
  };

  export default bizSdk;
}
