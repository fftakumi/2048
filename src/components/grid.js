import React, {useState, useEffect, useRef} from "react";
import Square from "./square";

const Grid = (props) => {
    const pack = (ary, dir) => {
        const packed = ary.map((value => ([...value])))
        let pre = []
        while (JSON.stringify(packed) !== JSON.stringify(pre)) {
            pre = packed.map((value => ([...value])))
            for (let row = 0; row < packed.length; row++) {
                for (let col = 0; col < packed[0].length; col++) {
                    if (!(0 <= row + dir.row && row + dir.row < packed.length && 0 <= col + dir.col && col + dir.col < packed[0].length)) {
                        continue
                    }
                    if (packed[row + dir.row][col + dir.col] === 0) {
                        packed[row + dir.row][col + dir.col] = packed[row][col]
                        packed[row][col] = 0
                    }
                }
            }
        }
        return packed
    }

    const add = (ary, dir) => {
        const _ary = ary.map((value => ([...value])))
        for (let row = 0; row < _ary.length; row++) {
            for (let col = 0; col < _ary.length; col++) {
                if (!(0 <= row + dir.row && row + dir.row < _ary.length && 0 <= col + dir.col && col + dir.col < _ary[0].length)) {
                    continue
                }
                if (_ary[row + dir.row][col + dir.col] === _ary[row][col]) {
                    _ary[row + dir.row][col + dir.col] += _ary[row][col]
                    _ary[row][col] = 0
                }
            }
        }
        return _ary
    }

    const addRandomValue = (ary) => {
        const zeroIndex = []
        ary.map((_value, i) => {
            _value.map((__value, j) => {
                if (__value === 0) {
                    zeroIndex.push([i, j])
                }
            })
        })
        if (zeroIndex.length === 0) {
            return ary
        }
        const randomIndex = zeroIndex[Math.floor(Math.random() * zeroIndex.length)]
        ary[randomIndex[0]][randomIndex[1]] = 2
        return ary
    }
    //------------------------
    //--------State-----------
    //------------------------
    const [size, setSize] = useState({
        col: 4,
        row: 4
    })

    const initialNum = 2
    let _array = new Array(size.col)
    for (let i = 0; i < size.col; i++) {
        _array[i] = new Array(size.row).fill(0)
    }
    for (let i = 0; i < initialNum; i++) {
        _array = addRandomValue(_array)
    }

    const valuesRef = useRef(_array)
    const [values, setValues] = useState(_array)

    const pack2 = (ary, dir) => {
        const packed = ary.map((value => ([...value])))
        let pre = []
        while (JSON.stringify(packed) !== JSON.stringify(pre)) {
            pre = packed.map((value => ([...value])))
            for (let row = 0; row < packed.length; row++) {
                for (let col = 0; col < packed[0].length; col++) {
                    if (!(0 <= row + dir.row && row + dir.row < packed.length && 0 <= col + dir.col && col + dir.col < packed[0].length)) {
                        continue
                    }
                    if (packed[row + dir.row][col + dir.col].value === 0) {
                        packed[row + dir.row][col + dir.col].value = packed[row][col].value
                        packed[row][col].value = 0
                        packed[row][col].destination = [row, col]
                        packed[row + dir.row][col + dir.col].destination = [row + dir.row, col + dir.col]
                    }
                }
            }
        }
        return packed
    }

    const up2 = (ary) => {
        const _ary = ary.map((_, row) => {
            return _.map((value, col) => {
                return {destination: [row, col], pre:[row, col], value:value, preValue:value}
            })
        })
        for (let row = 0; row < _ary.length; row++) {
            for(let col = 0; col < _ary[0].length; col++) {
                for (let i = 0; i <= row; i++) {
                    if (row - i > 0) {
                        if ((_ary[row - i - 1][col].value === 0) || (_ary[row - i][col].value === _ary[row - i - 1][col].value && (_ary[row - i][col].value === _ary[row - i][col].preValue || _ary[row - i][col].preValue === 0) && _ary[row - i - 1][col].value === _ary[row - i - 1][col].preValue)) {
                            _ary[row - i][col].destination = [row - i - 1, col]
                            _ary[row - i - 1][col].value += _ary[row - i][col].value
                            _ary[row - i][col].value = 0
                        }
                    }
                }
            }
        }
        return _ary
    }

    const add2 = (ary, dir) => {
        const _ary = ary.map((_, row) => {
            return _.map((value, col) => {
                return {destination: [row, col], pre:[row, col], value:value, preValue:value}
            })
        })

        for (let row = dir.row < 0? 0 : _ary.length - 1;                   //dir.row === -1 => row = 0 dir.row === 1 => row = _ary.length
             dir.row < 0?  row < _ary.length : row >= 0;                //dir.row === -1 => row < length dir.row === 1 => row > 0
             dir.row < 0? row++ : row--                                       //dir.row === -1 => row++ dir.row === 1 => row--
        ) {
            for(let col = dir.col < 0? 0 : _ary[0].length - 1;
                dir.col < 0?  col < _ary[0].length : col >= 0;
                dir.col < 0? col++ : col--) {
                for (let i = 0;
                     (dir.row < 0? i < row * Math.abs(dir.row) : i < (_ary.length - row) * Math.abs(dir.row)) || (dir.col < 0? i < col * Math.abs(dir.col) : i < (_ary[0].length - col) * Math.abs(dir.col));   //dir.row === -1 => i <= row dir.row === 1 => i <= _ary.length - row
                     i++) {
                    if (dir.row < 0? row - dir.row * i > 0 : row + i < _ary.length - 1) {
                        if ((_ary[row + dir.row * (i + 1)][col].value === 0) || (_ary[row + dir.row * i][col].value === _ary[row + dir.row * (i + 1)][col].value && (_ary[row + dir.row * i][col].value === _ary[row + dir.row * i][col].preValue || _ary[row + dir.row * i][col].preValue === 0) && _ary[row + dir.row * (i + 1)][col].value === _ary[row + dir.row * (i + 1)][col].preValue)) {
                            _ary[row + dir.row * i][col].destination = [row + dir.row * (i + 1), col]
                            _ary[row + dir.row * (i + 1)][col].value += _ary[row + dir.row * i][col].value
                            _ary[row + dir.row * i][col].value = 0
                        }
                    }
                }
            }
        }
        return _ary
    }

    const left2 = (ary) => {
        const _ary = ary.map((_, row) => {
            return _.map((value, col) => {
                return {destination: [row, col], pre:[row, col], value:value, preValue:value}
            })
        })
        for (let row = 0; row < _ary.length; row++) {
            for(let col = 0; col < _ary[0].length; col++) {
                for (let i = 0; i <= col; i++) {
                    if (col - i > 0) {
                        if ((_ary[row][col - i - 1].value === 0) || (_ary[row][col - i].value === _ary[row][col - i - 1].value && (_ary[row][col - i].value === _ary[row][col - i].preValue || _ary[row][col - i].preValue === 0) && _ary[row][col - i - 1].value === _ary[row][col - i - 1].preValue)) {
                            _ary[row][col - i].destination = [row, col - i - 1]
                            _ary[row][col - i - 1].value += _ary[row][col - i].value
                            _ary[row][col - i].value = 0
                        }
                    }
                }
            }
        }
        return _ary
    }

    const els = useRef([])


    useEffect(() => {
        const update = (value) => {
            valuesRef.current = value
            setValues(value)
        }

        const up = () => {
            // let packed = pack(valuesRef.current, {row: -1, col: 0})
            // let added = add(packed, {row: -1, col: 0})
            // packed = pack(added, {row: -1, col: 0})
            // packed = addRandomValue(packed)
            let packed = add2(valuesRef.current, {row: -1, col: 0})
            packed = packed.map(_array => {
                return _array.map(__array => {
                    return  __array.value
                })
            })
            packed = addRandomValue(packed)
            update(packed)
        }

        const left = () => {
            let packed = left2(valuesRef.current)
            packed = packed.map(_array => {
                return _array.map(__array => {
                    return  __array.value
                })
            })
            packed = addRandomValue(packed)
            update(packed)
        }

        const down = () => {
            // let packed = pack(valuesRef.current, {row: 1, col: 0})
            // let added = add(packed, {row: 1, col: 0})
            // packed = pack(added, {row: 1, col: 0})
            // packed = addRandomValue(packed)
            // update(packed)
            let packed = add2(valuesRef.current, {row: 1, col: 0})
            packed = packed.map(_array => {
                return _array.map(__array => {
                    return  __array.value
                })
            })

            packed = addRandomValue(packed)
            update(packed)
        }

        const right = () => {
            let packed = pack(valuesRef.current, {row: 0, col: 1})
            let added = add(packed, {row: 0, col: 1})
            packed = pack(added, {row: 0, col: 1})
            packed = addRandomValue(packed)
            update(packed)
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

        window.addEventListener('keydown', handleKeyDown)


    }, [])

    const test = () => {
        console.log("unmount")
    }
    return (
        <>
            <div className='grid-container'>
                {values.map((_value, i) => {
                    return _value.map((__value, j) => {
                        return <Square
                            key={`col:${i}row:${j}value:${__value}`}
                            value={__value} pos={{col: j, row: i}}
                            unmountFunc={test}
                            ref={els.current[i*size.row + j*size.col]}
                        />
                    })
                })}
            </div>
        </>
    )
}

export default Grid