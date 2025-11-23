import { Controller, Post, Body } from '@nestjs/common';
import { ZKService } from './zk.service';

@Controller('zk')
export class ZKController {
  constructor(private readonly zkService: ZKService) {}

  @Post('generate-kyc-proof')
  async generateKYCProof(@Body() body: { kycId: string; kycStatus: number; userSecret: string }) {
    return this.zkService.generateKYCProof(body.kycId, body.kycStatus, body.userSecret);
  }

  @Post('verify-kyc')
  async verifyKYC(@Body() body: { proof: any; publicSignals: any }) {
    const valid = await this.zkService.verifyProof(body.proof, body.publicSignals);

    if (!valid) {
      return { success: false, message: 'Invalid proof' };
    }

    const txHash = await this.zkService.submitProofOnChain('kyc', body.proof, body.publicSignals);

    return { success: true, transactionHash: txHash };
  }
}
