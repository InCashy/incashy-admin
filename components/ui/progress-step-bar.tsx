"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  XCircle,
} from "lucide-react"
import {
  IconCircleDashed,
  IconLoader2,
  IconCircleCheckFilled,
  IconCash,
  IconCircleXFilled,
} from "@tabler/icons-react"

type StatusType = "received" | "reviewing" | "approved" | "rejected" | "funded" | "paid"

interface ProgressStepProps {
  currentStatus: StatusType
}

const stepIcons: Record<StatusType, React.ReactNode> = {
  received: <IconCircleDashed size={16} />,
  reviewing: <IconLoader2 size={16} />,
  approved: <IconCircleCheckFilled size={16} />,
  funded: <IconCash size={16} />,
  paid: <IconCash size={16} />,
  rejected: <IconCircleXFilled size={16} />,
}

export function ProgressStepBar({ currentStatus }: ProgressStepProps) {
  const flow: StatusType[] = ["received", "reviewing", "approved", "funded", "paid"]
  const rejectedAt = currentStatus === "rejected" ? flow.indexOf("approved") : -1
  const currentIndex = rejectedAt >= 0 ? rejectedAt : flow.indexOf(currentStatus)
  const isRejected = currentStatus === "rejected"
  const isComplete = currentStatus === "paid"

  return (
    <div className="flex items-center w-full px-4 select-none">
      {flow.map((step, index) => {
        const pastRejection = isRejected && index > rejectedAt
        const isRejectedStep = isRejected && step === "approved"
        const isCompleted = (!isRejected && (isComplete || index < currentIndex)) || (isRejected && index < currentIndex)
        const isActive = !isComplete && index === currentIndex && !isRejectedStep
        const isLast = index === flow.length - 1

        // Simplify connector color
        let connectorColor = "bg-muted"
        if (isRejected && index >= rejectedAt) connectorColor = "bg-red-600"
        else if (isComplete || index < currentIndex) connectorColor = "bg-green-600"
        else if (index === currentIndex) connectorColor = "bg-white animate-pulse"

        // Animate line after active step
        const slidingLineClass = !isComplete && index === currentIndex && !isRejected
          ? "bg-gradient-to-r from-white via-[#0a0a0a] via-[#0a0a0a] to-white bg-[length:200%_100%] animate-slideLeftToRight"
          : ""

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center w-20 flex-shrink-0">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  (isRejectedStep || pastRejection) ? "bg-red-600 text-white"
                    : isCompleted ? "bg-green-600 text-white"
                    : isActive ? "bg-white text-black"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {(isRejectedStep || pastRejection) ? (
                  <XCircle size={16} />
                ) : isCompleted && step === "paid" ? (
                  <IconCash size={16} />
                ) : isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : isActive && step === "reviewing" ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : isActive ? (
                  stepIcons[step]
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-2 capitalize">
                {isRejectedStep ? "rejected" : step}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  "flex-grow h-[2px] mx-2 transition-all duration-900",
                  isComplete ? "bg-green-600" : (slidingLineClass || connectorColor)
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
