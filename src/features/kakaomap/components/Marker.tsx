/**
 * @file Marker.tsx
 * @description 카카오 마커 내부 구현 컴포넌트
 *
 * MapMarker에서 위임받아 실제 kakao.maps.Marker 인스턴스를 관리합니다.
 * - useMemo: 렌더 중 동기적으로 마커 인스턴스 생성 (타이밍 문제 없음)
 * - useLayoutEffect: map 등록/해제 및 props setter 동기화
 * - useKakaoEvent: 이벤트 등록/해제 자동화
 * - createPortal: children을 CustomOverlay DOM에 주입
 * - forwardRef: 외부에서 마커 인스턴스에 직접 접근 가능
 */

import {
  forwardRef,
  type PropsWithChildren,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import type {
  KakaoCustomOverlay,
  KakaoLatLng,
  KakaoMap,
  KakaoMarker,
  KakaoMarkerImageOptions,
  KakaoSdkMarkerImage,
} from '../kakaoMap.types'
import { useKakaoEvent } from '../lib/useKakaoEvent'

export type MarkerImageProp = {
  src: string
  size: { width: number; height: number }
  options?: KakaoMarkerImageOptions
}

export type MarkerProps = {
  map: KakaoMap
  position: KakaoLatLng
  image?: MarkerImageProp
  title?: string
  draggable?: boolean
  clickable?: boolean
  zIndex?: number
  opacity?: number
  onClick?: (marker: KakaoMarker) => void
  onMouseOver?: (marker: KakaoMarker) => void
  onMouseOut?: (marker: KakaoMarker) => void
  onDragStart?: (marker: KakaoMarker) => void
  onDragEnd?: (marker: KakaoMarker) => void
  onCreate?: (marker: KakaoMarker) => void
  infoWindowOptions?: {
    disableAutoPan?: boolean
    removable?: boolean
    zIndex?: number
  }
}

function buildMarkerImage(image: MarkerImageProp): KakaoSdkMarkerImage {
  const { kakao } = window
  const size = new kakao.maps.Size(image.size.width, image.size.height)
  const options = image.options
    ? {
        ...image.options,
        offset: image.options.offset
          ? new kakao.maps.Point(image.options.offset.x, image.options.offset.y)
          : undefined,
        spriteOrigin: image.options.spriteOrigin
          ? new kakao.maps.Point(image.options.spriteOrigin.x, image.options.spriteOrigin.y)
          : undefined,
        spriteSize: image.options.spriteSize
          ? new kakao.maps.Size(image.options.spriteSize.width, image.options.spriteSize.height)
          : undefined,
      }
    : undefined
  return new kakao.maps.MarkerImage(image.src, size, options)
}

export const Marker = forwardRef<KakaoMarker, PropsWithChildren<MarkerProps>>(function Marker(
  {
    map,
    position,
    image,
    title,
    draggable,
    clickable,
    zIndex,
    opacity,
    onClick,
    onMouseOver,
    onMouseOut,
    onDragStart,
    onDragEnd,
    onCreate,
    children,
  },
  ref
) {
  const overlayRef = useRef<KakaoCustomOverlay | null>(null)
  const [overlayEl, setOverlayEl] = useState<HTMLDivElement | null>(null)

  const hasChildren = children != null

  // ── 마커 인스턴스 생성  ────────
  const marker = useMemo(
    () =>
      new window.kakao.maps.Marker({
        position,
        image: image ? buildMarkerImage(image) : undefined,
        title,
        draggable,
        clickable,
        zIndex,
        opacity,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // 마커 인스턴스를 ref로 외부에 노출
  useImperativeHandle(ref, () => marker, [marker])

  // ── map 등록/해제 ──────────────────────────────────────────
  useLayoutEffect(() => {
    marker.setMap(map)
    return () => marker.setMap(null)
  }, [map, marker])

  // ── onCreate 콜백 ──────────────────────────────────────────
  useLayoutEffect(() => {
    onCreate?.(marker)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker])

  // ── props 변경 → SDK setter 호출 ──────────────────────────
  useLayoutEffect(() => {
    marker.setPosition(position)
  }, [marker, position])

  useLayoutEffect(() => {
    if (!image) return
    marker.setImage(buildMarkerImage(image))
  }, [marker, image])

  useLayoutEffect(() => {
    if (title !== undefined) marker.setTitle(title)
  }, [marker, title])

  useLayoutEffect(() => {
    if (draggable !== undefined) marker.setDraggable(draggable)
  }, [marker, draggable])

  useLayoutEffect(() => {
    if (clickable !== undefined) marker.setClickable(clickable)
  }, [marker, clickable])

  useLayoutEffect(() => {
    if (zIndex !== undefined) marker.setZIndex(zIndex)
  }, [marker, zIndex])

  useLayoutEffect(() => {
    if (opacity !== undefined) marker.setOpacity(opacity)
  }, [marker, opacity])

  // ── 이벤트 자동 등록/해제 ─────────────────────────────────
  useKakaoEvent(marker, 'click', onClick ? () => onClick(marker) : undefined)
  useKakaoEvent(marker, 'mouseover', onMouseOver ? () => onMouseOver(marker) : undefined)
  useKakaoEvent(marker, 'mouseout', onMouseOut ? () => onMouseOut(marker) : undefined)
  useKakaoEvent(marker, 'dragstart', onDragStart ? () => onDragStart(marker) : undefined)
  useKakaoEvent(marker, 'dragend', onDragEnd ? () => onDragEnd(marker) : undefined)

  // ── children → CustomOverlay + createPortal ───────────────
  useLayoutEffect(() => {
    if (!hasChildren) return

    const { kakao } = window
    const container = document.createElement('div')

    const overlay = new kakao.maps.CustomOverlay({
      position,
      content: container,
      map,
      yAnchor: 1,
    })

    overlayRef.current = overlay
    setOverlayEl(container)

    return () => {
      overlay.setMap(null)
      overlayRef.current = null
      setOverlayEl(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, hasChildren])

  // overlay position 동기화
  useLayoutEffect(() => {
    overlayRef.current?.setPosition(position)
  }, [position])

  if (!overlayEl || !hasChildren) return null
  return createPortal(children, overlayEl)
})
