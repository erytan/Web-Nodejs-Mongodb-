import React, { memo } from 'react'
import clsx from 'clsx'

const InputForm = ({
    label,
    disabled,
    register,
    errors,
    id,
    validate,
    type = 'text',
    placeholder,
    fullWidth,
    defaultValue,
}) => {
    return (
        <div className='flex flex-col h-[78px] gap-2'>
            <div>
            {label && <label htmlFor={id}>{label}</label>}
                <input
                style={{margin:'1px 20px'}}
                type={type}
                id={id}
                {...register(id, validate)}
                disabled={disabled}
                placeholder={placeholder}
                className={clsx('form-input my-auto',defaultValue={defaultValue},fullWidth)}
            />
            {errors[id]}
            </div>
           
        </div>
        
    )
}
export default InputForm