/**
 * useAuth Hook
 * Manages authentication state with TanStack Query
 * Provides login, register, logout, and user profile management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services'
import toast from 'react-hot-toast'
import { useStrings } from '@/utils/localizations/useStrings'

export function useAuth() {
  const queryClient = useQueryClient()
  const Strings = useStrings()

  // Get current user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem('blocki_token'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user)
      toast.success(Strings.loginSuccess || '¡Bienvenido!')
    },
    onError: (error) => {
      const message = error.response?.data?.message || Strings.loginError || 'Error al iniciar sesión'
      toast.error(message)
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // After registration, set user data and show wallet info
      queryClient.setQueryData(['auth', 'user'], data.user)
      toast.success(Strings.registerSuccess || '¡Cuenta creada exitosamente!')

      // Return wallet data so component can show it
      return data.wallet
    },
    onError: (error) => {
      const message = error.response?.data?.message || Strings.registerError || 'Error al registrarse'
      toast.error(message)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear()
      toast.success(Strings.logoutSuccess || 'Sesión cerrada')
    },
  })

  // OAuth mutations
  const googleSignInMutation = useMutation({
    mutationFn: authService.googleSignIn,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user)
      toast.success(Strings.loginSuccess || '¡Bienvenido!')
    },
  })

  const githubSignInMutation = useMutation({
    mutationFn: authService.githubSignIn,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user)
      toast.success(Strings.loginSuccess || '¡Bienvenido!')
    },
  })

  return {
    // State
    user,
    isLoading,
    isAuthenticated: !!user,
    error,

    // Mutations
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    googleSignIn: googleSignInMutation.mutate,
    githubSignIn: githubSignInMutation.mutate,
  }
}
