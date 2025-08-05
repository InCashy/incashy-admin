"use client"

import React, { useEffect, useState } from "react"
import { ProgressStepBar } from "@/components/ui/progress-step-bar"

const cycleOne = [
  "received",
  "reviewing",
  "approved",
  "funded",
  "paid",
]

const cycleTwo = [
  "received",
  "reviewing",
  "rejected",
]

const Page = () => {
  const [currentCycle, setCurrentCycle] = useState(1) // 1 or 2
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const statuses = currentCycle === 1 ? cycleOne : cycleTwo

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= statuses.length) {
          // Switch cycle and reset index to 0
          setCurrentCycle(currentCycle === 1 ? 2 : 1)
          return 0
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [currentCycle])

  const currentStatus = currentCycle === 1 ? cycleOne[currentIndex] : cycleTwo[currentIndex]

  return (
    <main className="flex flex-col justify-center items-center h-full text-center p-8 flex-grow">
      <ProgressStepBar currentStatus={currentStatus} />
    </main>
  )
}

export default Page
