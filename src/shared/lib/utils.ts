import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'xxtiny',
        'xtiny',
        'tiny',
        'xsmall',
        'small',
        'base',
        'medium',
        'large',
        'xlarge',
        'layout-max',
        'layout-padding',
        'gnb-height',
      ],
      color: [
        'black',
        'white',
        'grey-900',
        'grey-800',
        'grey-700',
        'grey-600',
        'grey-500',
        'grey-400',
        'grey-300',
        'grey-200',
        'grey-100',
        'dark-100',
        'primary-400',
        'primary-300',
        'primary-200',
        'primary-150',
        'primary-100',
        'accent-300',
        'accent-200',
        'accent-100',
        'yellow-300',
        'yellow-200',
        'yellow-100',
        'blue-200',
        'blue-100',
        'purple-200',
        'purple-100',
      ],
      radius: ['tiny', 'small', 'base', 'medium'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
