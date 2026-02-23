import { File, Upload } from 'lucide-react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'
import { TextButton } from '@/shared/ui/TextButton'

interface DropzoneProps {
  /** 최대 파일 크기 (MB 단위) */
  maxSizeInMB: number
  /** 허용할 파일 타입 (예: "audio/*", ".mp3,.wav") */
  accept?: string
  /** 파일 변경 시 호출되는 콜백 */
  onFileChange?: (file: File | null) => void
  /** 파일 크기 초과 시 호출되는 콜백 */
  onSizeExceeded?: (file: File, maxSizeInMB: number) => void
}

export interface DropzoneHandle {
  triggerFileSelect: () => void
}

const Dropzone = forwardRef<DropzoneHandle, DropzoneProps>(
  ({ maxSizeInMB, accept = 'audio/*', onFileChange, onSizeExceeded }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      triggerFileSelect: () => {
        fileInputRef.current?.click()
      },
    }))

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024

    const validateAndSetFile = (file: File | null) => {
      if (!file) {
        setSelectedFile(null)
        onFileChange?.(null)
        return
      }

      // 파일 크기 검증
      if (file.size > maxSizeInBytes) {
        onSizeExceeded?.(file, maxSizeInMB)
        return
      }

      setSelectedFile(file)
      onFileChange?.(file)
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null
      validateAndSetFile(file)
    }

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0] || null
      validateAndSetFile(file)
    }

    const handleRemoveFile = () => {
      setSelectedFile(null)
      onFileChange?.(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes}B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`
      return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
    }

    const hasFile = selectedFile !== null

    return (
      <div className="w-full h-full">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'w-full h-full rounded-base border transition-colors',
            'flex flex-col items-center justify-center gap-small p-large',
            hasFile ? 'border-grey-500' : 'border-grey-300',
            isDragging && 'border-purple-300 bg-purple-50'
          )}
        >
          {!hasFile ? (
            <>
              <Upload size={24} className="text-grey-600" />
              <p className="text-grey-600 typo-body3 text-center">
                PC에서 첨부하거나 파일을 끌어오세요
              </p>
            </>
          ) : (
            <>
              <File size={24} className="text-black" />
              <div className="flex flex-col items-center gap-xtiny typo-caption1 text-balck">
                <p>{selectedFile.name}</p>
                <p>{formatFileSize(selectedFile.size)}</p>
              </div>
              <TextButton onClick={handleRemoveFile} className="text-accent-300">
                삭제
              </TextButton>
            </>
          )}
        </div>
      </div>
    )
  }
)

Dropzone.displayName = 'Dropzone'

export default Dropzone
