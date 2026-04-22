/**
 * Platform Factory - Dynamically creates platform adapters
 */

const MetaAdapter = require('./MetaAdapter');
const GoogleAdsAdapter = require('./GoogleAdsAdapter');
const TikTokAdapter = require('./TikTokAdapter');
const LinkedInAdapter = require('./LinkedInAdapter');

class PlatformFactory {
  static createAdapter(platformType, accessToken, refreshToken = null) {
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

  static isValidPlatform(platformType) {
    return ['meta', 'google_ads', 'tiktok', 'linkedin'].includes(platformType);
  }

  static getPlatformNames() {
    return {
      meta: 'Meta (Facebook/Instagram)',
      google_ads: 'Google Ads',
      tiktok: 'TikTok Ads',
      linkedin: 'LinkedIn Ads',
    };
  }
}

module.exports = PlatformFactory;
