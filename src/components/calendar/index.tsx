import { range } from 'lodash';
import React from "react";
import './styles.less';
export interface IProps {
    month: number,// 月份
    day: number,// 日期
    onChange: (params: { month: number, day: number }) => any,//日期变化的回调
}

/**
 * 日历组件
 * @param props 
 * @returns 
 */
const CalendarComponent = ({ month, day, onChange }: IProps) => {
    const monthNames = [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月',
    ];
    return (<div className={'Calendar'}>
        <>
            {range(0, 6).map(m => (
                <div
                    className={`item month ${month === m ? `selected` : ''}`}
                    key={m}
                    onClick={() => onChange({ month: m, day })}
                >
                    {monthNames[m]}
                </div>
            ))}
            <div className={`item month`} />
            {range(6, 12).map(m => (
                <div
                    className={`item month ${month === m ? `selected` : ''}`}
                    key={m}
                    onClick={() => onChange({ month: m, day })}
                >
                    {monthNames[m]}
                </div>
            ))}
            <div className={`item month`} />
        </>


        {range(1, 32).map(d => (
            <div
                className={`item ${day === d ? 'selected' : ''}`}
                key={d}
                onClick={() => onChange({ month, day: d })}
            >
                {d}
            </div>
        ))}
    </div>)
}

export default CalendarComponent;