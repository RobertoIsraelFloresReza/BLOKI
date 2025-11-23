/**
 * useZK Hook
 * Manages Zero-Knowledge proof generation and verification
 */

import { useMutation } from '@tanstack/react-query'
import { zkService } from '@/services'
import toast from 'react-hot-toast'

export function useZK() {
  // Generate KYC proof
  const generateKYCProofMutation = useMutation({
    mutationFn: ({ kycId, kycStatus, userSecret }) =>
      zkService.generateKYCProof(kycId, kycStatus, userSecret),
    onSuccess: () => {
      console.log('✅ ZK Proof generated')
      toast.success('ZK Proof generated successfully')
    },
    onError: (error) => {
      console.error('❌ Proof generation failed:', error)
      toast.error(error.response?.data?.message || 'Failed to generate proof')
    },
  })

  // Verify KYC proof
  const verifyKYCMutation = useMutation({
    mutationFn: ({ proof, publicSignals }) =>
      zkService.verifyKYCProof(proof, publicSignals),
    onSuccess: (data) => {
      console.log('✅ Proof verification result:', data)
      if (data.success) {
        toast.success('KYC verified anonymously on-chain!')
      } else {
        toast.error('Proof verification failed')
      }
    },
    onError: (error) => {
      console.error('❌ Verification failed:', error)
      toast.error(error.response?.data?.message || 'Verification failed')
    },
  })

  return {
    generateKYCProof: generateKYCProofMutation.mutate,
    generateKYCProofAsync: generateKYCProofMutation.mutateAsync,
    isGeneratingProof: generateKYCProofMutation.isPending,

    verifyKYCProof: verifyKYCMutation.mutate,
    verifyKYCProofAsync: verifyKYCMutation.mutateAsync,
    isVerifying: verifyKYCMutation.isPending,
  }
}
