import { InjectionToken } from '@angular/core';

export interface ApplicationConfig {
    eliotApp: any;
    mobileApiEndpoint: string;
}

export const MY_CONFIG = {
    eliotApp: {
        client_id: "9999d816-d539-463a-afbd-7fc663de1c8a",
        client_secret: "8Gw97T22oUOo27/{)757Cu>,",
        oauthBaseEndpoint: "https://partners-login.eliotbylegrand.com",
        oauthRedirectEndpoint: "https://login.microsoftonline.com/tfp/oauth2/nativeclient"
    },
    // mobileApiEndpoint: "http://localhost:7001/AtlantisJEE/api/mobile"
    mobileApiEndpoint: "https://mobile.siju.tk/AtlantisJEE/api/mobile"
};

export const MY_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');