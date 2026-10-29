import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    ...props
}, ref){
    const id = useId()
    return (
        <div className="w-full">
            {label && <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </label>
            }
            <input
            type={type}
            ref={ref}
            {...props}
            id={id}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-400/10"
            />
        </div>
    )
})

export default Input