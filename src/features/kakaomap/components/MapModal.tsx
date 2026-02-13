import type { MeetingLocation } from '@/features/meetings/meetings.types'
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/shared/ui'

interface MapModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: MeetingLocation
}

export default function MapModal({ open, onOpenChange, location }: MapModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent variant="normal">
        <ModalHeader>
          <ModalTitle>{location.name}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex items-center justify-center h-full text-grey-600 typo-body2">
            지도 API 연동 예정
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
