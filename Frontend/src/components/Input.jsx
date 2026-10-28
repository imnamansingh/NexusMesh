import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input