import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { evaluatorService } from '@/services/evaluatorService'

/**
 * Hook for fetching all evaluators
 */
export function useEvaluators(onlyActive = true) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['evaluators', onlyActive],
    queryFn: () => evaluatorService.getAllEvaluators(onlyActive),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Extract the array from the response
  // API returns { data: [...] } so we need to get data.data
  const evaluatorsArray = data?.data || data || []

  return {
    evaluators: Array.isArray(evaluatorsArray) ? evaluatorsArray : [],
    isLoading,
    error,
  }
}

/**
 * Hook for fetching single evaluator
 */
export function useEvaluator(id) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['evaluator', id],
    queryFn: () => evaluatorService.getEvaluatorById(id),
    enabled: !!id,
  })

  // Extract the object from the response
  // API might return { data: {...} } so we need to get data.data
  const evaluatorData = data?.data || data

  return {
    evaluator: evaluatorData,
    isLoading,
    error,
  }
}

/**
 * Hook for evaluator mutations (create, update, delete)
 */
export function useEvaluatorMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: evaluatorService.createEvaluator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluators'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => evaluatorService.updateEvaluator(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluators'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: evaluatorService.deleteEvaluator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluators'] })
    },
  })

  return {
    createEvaluator: createMutation.mutate,
    updateEvaluator: updateMutation.mutate,
    deleteEvaluator: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
