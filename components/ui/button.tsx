import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    const baseClass = 'font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    const variantClass = variant === 'outline'
      ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
      : 'bg-blue-600 text-white hover:bg-blue-700'
    const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm'
      : size === 'lg' ? 'px-6 py-3 text-base'
      : 'px-4 py-2 text-sm'
    return (
      <button
        ref={ref}
        className={`${baseClass} ${variantClass} ${sizeClass} ${className ?? ''}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'