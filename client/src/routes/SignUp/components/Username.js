import React, { useState } from 'react'

export const Username = (props) => {
    const [value, setValue] = useState(props.valueUser)

    return(
        <>
            <input 
                type="text"
                placeholder="Username"
                onChange={e => setValue(e.target.value)}
                value={value}
                ></input>
        </>
    )
}