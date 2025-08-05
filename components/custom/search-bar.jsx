"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState } from "react"

export default function SearchBar() {
  const [value, setValue] = useState("")

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Search icon */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="w-5 h-5" />
      </span>

      {/* Input */}
      <Input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-12 pr-10 py-5 text-base rounded-full shadow-sm bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring transition"
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
