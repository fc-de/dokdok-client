import { Toaster, type ToasterProps } from 'sonner'

const Sonner = ({ ...props }: ToasterProps) => {
  return (
    <Toaster
      position="bottom-center"
      gap={12}
      visibleToasts={3}
      offset={48}
      icons={{ error: <></> }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'inset-x-0 mx-auto w-fit max-w-[360px] text-center px-base py-xsmall rounded-base typo-subtitle5',
        },
      }}
      {...props}
    />
  )
}

export { Sonner }
