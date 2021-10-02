import React, {useState, useEffect, useRef} from "react";
import Square from "./square";

const Grid = (props) => {

    const addRandomValue = (ary) => {
        const zeroIndex = []
        ary.map((_value, i) => {
            _value.map((__value, j) => {
                if (__value.value === 0) {
                    zeroIndex.push([i, j])
                }
            })
        })
        if (zeroIndex.length === 0) {
            return ary
        }
        const randomIndex = zeroIndex[Math.floor(Math.random() * zeroIndex.length)]
        ary[randomIndex[0]][randomIndex[1]].value = 2
        return ary
    }
    //------------------------
    //--------State-----------
    //------------------------
    const [size, setSize] = useState({
        col: 4,
        row: 4
    })


    const init = (initialNum) => {
        let _ary = [...Array(size.row)].map(() => Array(size.col).fill(0))
        for (let row = 0; row < size.row; row++) {
            for (let col = 0; col < size.col; col++) {
                _ary[row][col] = {destination: [row, col], pre: [row, col], value: 0, preValue: 0}
            }
        }
        for (let i = 0; i < initialNum; i++) {
            _ary = addRandomValue(_ary)
        }
        return _ary
    }

    const array = init(2)
    const valuesRef = useRef(array)
    const [values, setValues] = useState(array)


    const add = (ary, dir) => {
        const _ary = ary.concat()
        _ary.forEach(_value => {
            _value.forEach(__value => {
                __value.preValue = __value.value
                __value.destination = __value.pre
            })
        })

        for (let row = dir.row < 0 ? 0 : _ary.length - 1;                   //dir.row === -1 => row = 0 dir.row === 1 => row = _ary.length
             dir.row < 0 ? row < _ary.length : row >= 0;                //dir.row === -1 => row < length dir.row === 1 => row > 0
             dir.row < 0 ? row++ : row--                                       //dir.row === -1 => row++ dir.row === 1 => row--
        ) {
            for (let col = dir.col < 0 ? 0 : _ary[0].length - 1;
                 dir.col < 0 ? col < _ary[0].length : col >= 0;
                 dir.col < 0 ? col++ : col--) {
                for (let i = 0;
                     (dir.row < 0 ? i < row * Math.abs(dir.row) : i < (_ary.length - 1 - row) * Math.abs(dir.row)) ||
                     (dir.col < 0 ? i < col * Math.abs(dir.col) : i < (_ary[0].length - 1 - col) * Math.abs(dir.col));   //dir.row === -1 => i <= row dir.row === 1 => i <= _ary.length - row
                     i++) {
                    let ahead_row = row + dir.row * (i + 1)
                    let ahead_col = col + dir.col * (i + 1)
                    let now_row = row + dir.row * i
                    let now_col = col + dir.col * i
                    if ((dir.row < 0 ? now_row >= 0 : row - i <= _ary.length - 1) &&
                        (dir.col < 0 ? now_col >= 0 : col - i <= _ary[0].length - 1)) { //indexからはみ出ないように
                        if ((_ary[ahead_row][ahead_col].value === 0) ||
                            (
                                _ary[now_row][now_col].value === _ary[ahead_row][ahead_col].value &&
                                (_ary[now_row][now_col].value === _ary[now_row][now_col].preValue || _ary[now_row][now_col].preValue === 0) &&
                                _ary[ahead_row][ahead_col].value === _ary[ahead_row][ahead_col].preValue
                            )) {
                            _ary[row][col].destination = [ahead_row, ahead_col]
                            _ary[ahead_row][ahead_col].value += _ary[now_row][now_col].value
                            _ary[now_row][now_col].value = 0
                        }
                    }
                }
            }
        }
        return _ary
    }


    const els = useRef([])


    useEffect(() => {
        const update = (dir) => {
            let packed = add(valuesRef.current, dir)
            packed = addRandomValue(packed)
            console.log(packed)
            valuesRef.current = packed
            setValues(packed)
        }

        const up = () => {
            update({row: -1, col: 0})
        }

        const left = () => {
            update({row: 0, col: -1})
        }

        const down = () => {
            update({row: 1, col: 0})
        }

        const right = () => {
            update({row: 0, col: 1})
        }

        const handleKeyDown = (e) => {
            // eslint-disable-next-line default-case
            switch (e.key) {
                case 'ArrowUp':
                    up()
                    break
                case 'ArrowLeft':
                    left()
                    break
                case 'ArrowDown':
                    down()
                    break
                case 'ArrowRight':
                    right()
                    break
            }
        }
        window.addEventListener('keydown', handleKeyDown, true)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }

    }, [])

    return (
        <>
            <div className="background">
                <div className='grid-container'>
                    {values.map((_value, row) => {
                        return _value.map((__value, col) => {
                            if (__value.value !== 0 || __value.preValue !== 0) {
                                return (
                                    <Square
                                        key={`${__value.value},${__value.preValue},${__value.destination},${__value.pre}`}
                                        value={__value.value}
                                        preValue={__value.preValue}
                                        pos={{row: row, col: col}}
                                        pos2={{row: __value.destination[0], col: __value.destination[1]}}
                                        ref={els.current[row * size.row + col * size.col]}
                                    />)
                            } else {
                                return <></>
                            }
                        })
                    })}
                </div>
            </div>
        </>
    )
}

export default Grid