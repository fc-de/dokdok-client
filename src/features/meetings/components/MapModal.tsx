import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/shared/ui'

interface MapModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locationName: string
}

export function MapModal({ open, onOpenChange, locationName }: MapModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent variant="normal">
        <ModalHeader>
          <ModalTitle>{locationName}</ModalTitle>
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
