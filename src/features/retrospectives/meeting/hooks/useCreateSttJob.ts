import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'

import type { ApiError } from '@/api'

import { createSttJob } from '../retrospectives.api'
import type { CreateSttJobParams, SttJobResponse } from '../retrospectives.types'

/**
 * STT Job 생성 (AI 요약 트리거) mutation 훅
 *
 * - 동기 API이므로 mutation pending 동안 로딩 오버레이 표시
 * - cancel() 호출 시 진행 중인 HTTP 요청 중단
 * - 컴포넌트 언마운트 시 자동 취소
 */
export const useCreateSttJob = () => {
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = null
    }
  }, [])

  const mutation = useMutation<SttJobResponse, ApiError, CreateSttJobParams>({
    mutationFn: (params: CreateSttJobParams) => {
      abortControllerRef.current?.abort()

      const controller = new AbortController()
      abortControllerRef.current = controller

      return createSttJob(params, controller.signal).finally(() => {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      })
    },
  })

  const { reset } = mutation

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    reset()
  }, [reset])

  return { ...mutation, cancel }
}
