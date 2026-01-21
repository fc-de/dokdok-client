import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-heading1',
        'text-heading2',
        'text-heading3',
        'text-subtitle1',
        'text-subtitle2',
        'text-subtitle3',
        'text-subtitle4',
        'text-body1',
        'text-body2',
        'text-body3',
        'text-body4',
        'text-body5',
        'text-body6',
        'text-caption1',
        'text-caption2',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
