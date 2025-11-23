import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/**
 * Redstone Oracle Client for Stellar/Soroban
 *
 * Note: As of now, Redstone SDK for Soroban is in development.
 * This implementation uses Redstone's HTTP API as a fallback.
 *
 * Official Redstone Soroban docs: https://docs.redstone.finance/docs/smart-contract-devs/get-started/soroban
 */

export interface RedstonePrice {
  value: number;
  timestamp: number;
  provider: string;
}

export interface RedstonePriceData {
  asset: string;
  price: number;
  timestamp: number;
  confidence: number;
  source: string;
}

@Injectable()
export class RedstoneClient {
  private readonly logger = new Logger(RedstoneClient.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly cacheTTL: number;

  // Redstone data feed IDs
  private readonly FEED_IDS = {
    XLM: 'XLM',
    USDC: 'USDC',
    BTC: 'BTC',
    ETH: 'ETH',
  };

  constructor(private configService: ConfigService) {
    // Redstone API configuration
    this.apiUrl = this.configService.get<string>('REDSTONE_API_URL') || 'https://api.redstone.finance';
    this.apiKey = this.configService.get<string>('REDSTONE_API_KEY') || '';
    this.cacheTTL = this.configService.get<number>('REDSTONE_CACHE_TTL') || 3600;
  }

  /**
   * Fetch price from Redstone Oracle
   * Uses Redstone's HTTP API to get latest price data
   */
  async getPrice(asset: string): Promise<RedstonePriceData> {
    try {
      this.logger.debug(`Fetching price for ${asset} from Redstone`);

      // Get feed ID
      const feedId = this.FEED_IDS[asset] || asset;

      // Fetch from Redstone API
      const response = await axios.get(
        `${this.apiUrl}/prices`,
        {
          params: {
            symbols: feedId,
            provider: 'redstone-primary-prod',
          },
          headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {},
          timeout: 5000,
        }
      );

      if (!response.data || !response.data[feedId]) {
        throw new Error(`No price data available for ${asset}`);
      }

      const data = response.data[feedId];
      const price = data.value;
      const timestamp = data.timestamp || Math.floor(Date.now() / 1000);

      // Convert to 7 decimals for Soroban
      const priceWith7Decimals = Math.floor(price * 10000000);

      this.logger.log(`Price fetched for ${asset}: $${price} (${priceWith7Decimals} with 7 decimals)`);

      return {
        asset,
        price: priceWith7Decimals,
        timestamp,
        confidence: 100, // 1% default confidence
        source: 'redstone-primary-prod',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${asset}:`, error.message);

      // Fallback to mock data for development/testing
      if (this.configService.get('NODE_ENV') === 'development') {
        this.logger.warn(`Using mock price data for ${asset}`);
        return this.getMockPrice(asset);
      }

      throw error;
    }
  }

  /**
   * Fetch multiple prices at once
   */
  async getPrices(assets: string[]): Promise<RedstonePriceData[]> {
    const promises = assets.map(asset => this.getPrice(asset));
    return Promise.all(promises);
  }

  /**
   * Mock price data for development/testing
   */
  private getMockPrice(asset: string): RedstonePriceData {
    const mockPrices: Record<string, number> = {
      XLM: 0.12,    // $0.12
      USDC: 1.0,    // $1.00
      BTC: 45000,   // $45,000
      ETH: 2500,    // $2,500
    };

    const price = mockPrices[asset] || 1.0;
    const priceWith7Decimals = Math.floor(price * 10000000);

    return {
      asset,
      price: priceWith7Decimals,
      timestamp: Math.floor(Date.now() / 1000),
      confidence: 100,
      source: 'mock',
    };
  }

  /**
   * Get available data feeds
   */
  getAvailableFeeds(): string[] {
    return Object.keys(this.FEED_IDS);
  }

  /**
   * Validate asset symbol
   */
  isValidAsset(asset: string): boolean {
    return this.FEED_IDS.hasOwnProperty(asset);
  }
}
