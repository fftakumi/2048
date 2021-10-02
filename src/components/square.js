import React, {useState, useEffect, useRef, useCallback} from "react";

const Square = (props) => {
    const ref = useRef(null)
    const [pos, setPos] = useState(props.pos)
    const [value, setValue] = useState(props.preValue)

    let size = {
        width: 100,
        height: 100
    }

    let zIndex = 1

    const addedAnimation = () => {
        ref.current.style.width = "150px"
        ref.current.style.height = "150px"
        setTimeout(() => {
            ref.current.style.width = "100px"
            ref.current.style.height = "100px"
            setTimeout(()=>{
                setValue(props.value)
            },500)
        })
    }

    useEffect(() => {
        setValue(props.value)
        setPos(props.pos2)
        if (props.value > props.preValue) {
            ref.current.style.zIndex = "10"
        }

    },[])

    return (
        <>
            <div className='square'
            style={{
                width: size.width,
                height: size.height,
                top: size.height * pos.row,
                left: size.width * pos.col,
                zIndex: zIndex
            }}
            ref={ref}
            id={`row${pos.row}col${pos.col}`}>
                <div className='value'>
                    {value}
                </div>
            </div>

        </>
    )
}

export default Square