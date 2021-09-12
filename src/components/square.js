import React, {useState, useEffect, useRef, useCallback} from "react";

const Square = (props) => {
    const ref = useRef(null)
    const [pos, setPos] = useState(props.pos)

    const size = {
        width: 100,
        height: 100
    }

    useEffect(() => {

    },[])

    return (
        <>
            <div className='square'
            style={{
                width: size.width,
                height: size.height,
                top: size.height * pos.row,
                left: size.width * pos.col
            }}
            ref={ref}
            id={`row${pos.row}col${pos.col}`}>
                <div className='value'>
                    {props.value}
                </div>
            </div>

        </>
    )
}

export default Square