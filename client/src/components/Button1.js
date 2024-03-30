import React, { memo } from 'react';

const Button = ({ children, handleOnClick, style,fw,type='button' }) => {
    return (
        <button
            type={type}
            className={style ? style : `px-4 py-2 rounded-md text-black border bg-red-50 px-[10px] text-semiblod ${fw ? 'w-full':'w-fit'}`}
            onClick={()=>{handleOnClick && handleOnClick()}}
        >
           {children}
        </button>
    )
}
export default memo(Button)