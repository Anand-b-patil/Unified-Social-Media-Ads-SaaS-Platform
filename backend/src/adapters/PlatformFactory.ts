import { PlatformType } from '../../../shared/types/platform';
import { BasePlatformAdapter } from './BasePlatformAdapter';
import { MetaAdapter } from './MetaAdapter';
import { GoogleAdsAdapter } from './GoogleAdsAdapter';
import { TikTokAdapter } from './TikTokAdapter';
import { LinkedInAdapter } from './LinkedInAdapter';

export class PlatformFactory {
  static createAdapter(platformType: PlatformType, accessToken: string, refreshToken?: string): BasePlatformAdapter {
    switch (platformType) {
      case 'meta':
        return new MetaAdapter(accessToken, refreshToken);
      case 'google_ads':
        return new GoogleAdsAdapter(accessToken, refreshToken);
      case 'tiktok':
        return new TikTokAdapter(accessToken, refreshToken);
      case 'linkedin':
        return new LinkedInAdapter(accessToken, refreshToken);
      default:
        throw new Error(`Unsupported platform: ${platformType}`);
    }
  }

  static isValidPlatform(platformType: string): boolean {
    return ['meta', 'google_ads', 'tiktok', 'linkedin'].includes(platformType);
  }

  static getPlatformNames(): Record<PlatformType, string> {
    return {
      meta: 'Meta (Facebook/Instagram)',
      google_ads: 'Google Ads',
      tiktok: 'TikTok Ads',
      linkedin: 'LinkedIn Ads',
    };
  }
}
