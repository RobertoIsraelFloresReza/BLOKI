import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DeFindexService {
  private apiKey: string;
  private apiUrl: string;
  private vaultUsdc: string;
  private minLockTime: number;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DEFINDEX_API_KEY') || '';
    this.apiUrl = this.configService.get<string>('DEFINDEX_API_URL') || 'https://api.defindex.io';
    this.vaultUsdc = this.configService.get<string>('DEFINDEX_VAULT_USDC') || '';
    this.minLockTime = this.configService.get<number>('DEFINDEX_MIN_LOCK_TIME') || 604800;
  }

  /**
   * Get vault APY from DeFindex API
   */
  async getVaultAPY(vaultAddress?: string): Promise<number> {
    if (!this.apiKey) {
      console.warn('DeFindex API key not configured, using mock APY');
      return 8.5; // Mock APY
    }

    try {
      const response = await axios.get(`${this.apiUrl}/vaults`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      // Find vault and return APY
      const vault = vaultAddress
        ? response.data.find((v: any) => v.address === vaultAddress)
        : response.data[0]; // First vault if no address specified

      return vault?.apy || 8.5;
    } catch (error) {
      console.error('Failed to fetch DeFindex APY:', error.message);
      return 8.5; // Fallback to mock
    }
  }

  /**
   * Estimate yield for given amount and duration
   */
  async estimateYield(
    amount: number,
    durationDays: number,
  ): Promise<{
    totalYield: number;
    sellerYield: number;
    buyerYield: number;
    protocolYield: number;
    apy: number;
  }> {
    const apy = await this.getVaultAPY();

    // Calculate total yield: amount * APY * (duration / 365)
    const totalYield = amount * (apy / 100) * (durationDays / 365);

    // Distribution: 50/40/10
    const sellerYield = totalYield * 0.5;
    const buyerYield = totalYield * 0.4;
    const protocolYield = totalYield * 0.1;

    return {
      totalYield,
      sellerYield,
      buyerYield,
      protocolYield,
      apy,
    };
  }

  /**
   * Get available vaults from DeFindex API
   */
  async getVaults(): Promise<any[]> {
    if (!this.apiKey) {
      console.warn('DeFindex API key not configured, using mock vaults');
      return [
        {
          address: this.vaultUsdc || 'MOCK_VAULT',
          asset: 'USDC',
          apy: 8.5,
          tvl: 1000000,
        },
      ];
    }

    try {
      const response = await axios.get(`${this.apiUrl}/vaults`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch DeFindex vaults:', error.message);
      // Fallback to mock
      return [
        {
          address: this.vaultUsdc || 'MOCK_VAULT',
          asset: 'USDC',
          apy: 8.5,
          tvl: 1000000,
        },
      ];
    }
  }
}
