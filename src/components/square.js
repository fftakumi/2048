import React, {useState, useEffect} from "react";

const Square = (props) => {
    const [value, setValue] = useState(props.value)
    const [pos, setPos] = useState(props.pos)

    useEffect(() => {
    },[value])

    const size = {
        width: 100,
        height: 100
    }

    return (
        <>
            <div className='square'
            style={{
                width: size.width,
                height: size.height,
                top: size.height * pos.row,
                left: size.width * pos.col
            }}>
                <div className='value'>
                    {value}
                </div>
            </div>
        </>
    )
}

export default Square