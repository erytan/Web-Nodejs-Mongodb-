import React, { memo } from 'react';

const Button = ({ name, handleOnClick, style, iconsBefore, iconAfter,fw }) => {
    return (
        <button
            type='button'
            className={style ? style : `px-4 py-2 rounded-md text-black border bg-red-50 px-[10px] text-semiblod ${fw ? 'w-full':'w-fit'}`}
            onClick={()=>{handleOnClick && handleOnClick()}}
        >
            {iconsBefore}
            <span>{name}</span>
            {iconAfter}
        </button>
    )
}
export default memo(Button)