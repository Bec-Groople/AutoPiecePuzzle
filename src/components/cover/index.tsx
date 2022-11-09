import React from "react"
import { flatten } from 'lodash'
import { COLS, flip, PieceItemLayout, PieceShapes, rotate } from "../../puzzleUtil.ts";

export interface IProps {
    solution: PieceItemLayout[],// 拼图的解法
    itemMasks: any[];//每块拼图可能的拼法列表
}

/**
 * 拼图填充效果预览组件
 * @param props 
 * @returns 
 */
const CoverComponent = ({ solution, itemMasks }: IProps) => {

    const colors = [
        '#6B7280',
        '#EF4444',
        '#F59E0B',
        '#10B981',
        '#3B82F6',
        '#6366F1',
        '#8B5CF6',
        '#EC4899',
    ];

    const firstXCols = itemMasks?.map(masks => masks.map(mask => mask[0].indexOf('x')));
    const itemDirections = PieceShapes?.map((item, i) => {
        const masks = [
            item,
        ]
        // rotate
        for (let i = 1; i < 4; ++i) {
            masks.push(rotate(masks[i - 1]))
        }
        for (let i = 4; i < 8; ++i) {
            masks.push(flip(masks[i - 4]))
        }
        const originMaskString = masks.map(mask => mask.join('\n'))
        const itemMaskStrings = itemMasks[i].map(mask => mask.join('\n'))
        return itemMaskStrings.map(itemMaskString => originMaskString.indexOf(itemMaskString))
    });
    return (
        <div className="SolutionView">
            {PieceShapes.map((item, i) => {
                const { pieceIndex, shapeIndex } = solution[i]
                const row = Math.floor(pieceIndex / COLS)
                const col = pieceIndex % COLS
                const firstXCol = firstXCols[i][shapeIndex]
                const direction = itemDirections[i][shapeIndex]

                const hwDiff = item.length - item[0].length
                const needDiff = (direction === 1 || direction === 3 || direction === 4 || direction === 6)
                return (
                    <div
                        key={i}
                        className="SolutionViewItem"
                        style={{
                            top: row * 50,
                            left: (col - firstXCol) * 50,
                            width: item[0].length * 50,
                            height: item.length * 50,
                            transform: [
                                `translate3d(${needDiff ? hwDiff * 25 : 0}px, ${needDiff ? hwDiff * -25 : 0}px, 0px)`,
                                `rotate3d(1, 1, 0, ${Math.floor(direction / 4) * 180}deg)`,
                                `rotate3d(0, 0, 1, -${direction % 4 * 90}deg)`,
                            ].join(' '),
                        }}
                        data-direction={direction}
                    >
                        {flatten(
                            item.map((s, r) => s.split('').map(
                                (_1, c) => (
                                    <div
                                        key={`${r}_${c}`}
                                        className="SolutionViewCell"
                                        style={item[r][c] === 'x' ? { backgroundColor: colors[i] } : {}}
                                    />
                                )),
                            ),
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default CoverComponent; 
