import React from 'react'

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  (props, ref) => (
    <label ref={ref} {...props} className={`text-sm font-medium text-slate-700 ${props.className ?? ''}`} />
  )
)
Label.displayName = 'Label'