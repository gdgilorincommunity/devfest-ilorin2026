import { isValidElement } from 'react'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { MoveUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
        black:
          'rounded-full bg-black text-white transition-transform duration-300 hover:scale-105',
        gradient:
          'rounded-full text-white transition-transform duration-300 hover:scale-105 bg-[radial-gradient(85.98%_85.98%_at_50%_17.07%,#3186FF_52%,#6D97FF_76%,#A9A8FF_100%)]',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        pill: 'h-[48px] min-w-[152px] justify-center gap-2 px-5 py-3 text-sm font-bold lg:h-[55px] lg:min-w-[176px] lg:gap-[10px] lg:px-[22px] lg:py-[20px] lg:text-[16px]',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    compoundVariants: [
      { variant: ['black', 'gradient'], className: 'rounded-full' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    showArrow?: boolean
  }

function Button({
  className,
  variant = 'default',
  size = 'default',
  showArrow = false,
  nativeButton,
  render,
  children,
  ...props
}: ButtonProps) {
  const isButtonRender =
    render === undefined || (isValidElement(render) && render.type === 'button')
  const resolvedNativeButton = nativeButton ?? isButtonRender

  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      nativeButton={resolvedNativeButton}
      render={render}
      {...props}
    >
      {children}
      {showArrow && (
        <span className="flex h-[22px] w-[28px] items-center justify-center rounded-full bg-white lg:h-[26px] lg:w-[32px]">
          <MoveUpRight
            className={cn(
              'size-2.5',
              variant === 'gradient' ? 'text-[#3186FF]' : 'text-black',
            )}
          />
        </span>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
