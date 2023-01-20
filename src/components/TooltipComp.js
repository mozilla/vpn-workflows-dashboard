import React from "react";
import {Tooltip} from 'react-tooltip'

const TooltipComp = ({ id, Icon, title, bgColor }) => {
    return (
        <>
            <p data-tip data-for={id} data-tooltip-content={title}>
                <Icon />
            </p>
            <Tooltip id={id} backgroundColor={bgColor}>
                <span className="text-sm font-medium" >{title}</span>
            </Tooltip>
        </>
    )

}

export default TooltipComp