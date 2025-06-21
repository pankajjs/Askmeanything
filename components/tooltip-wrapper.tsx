"use client"

import React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const ToolTipWrapper = ({
    children, content}:{children: React.ReactNode, content: React.ReactNode
    }) => {
    return <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
        {content}
        </TooltipContent>
    </Tooltip>
}