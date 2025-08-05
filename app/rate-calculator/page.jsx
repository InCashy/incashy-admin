"use client"

import { useState } from "react"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function RateCalculator() {
    const [loadType, setLoadType] = useState("van")
    const [weight, setWeight] = useState(30000)
    const [driverPay, setDriverPay] = useState(0.50)
    const [team, setTeam] = useState(false)
    const [miles, setMiles] = useState(500)
    const [fuelSurchargeOn, setFuelSurchargeOn] = useState(false)
    const [isPartial, setIsPartial] = useState(false)
    const [reeferTemp, setReeferTemp] = useState(40) // °F
    const [hazmat, setHazmat] = useState(false)
    const [expedited, setExpedited] = useState(false)
    const [multiStop, setMultiStop] = useState(false)
    const [tollFee, setTollFee] = useState(0)
    const [region, setRegion] = useState("midwest")

    const base = 1.75
    const loadTypeModifiers = {
        van: 0.15,
        reefer: 0.55,
        flatbed: 0.45,
        tanker: 0.40,
        stepdeck: 0.50,
        hopper: 0.35,
    }
    const typeAdd = loadTypeModifiers[loadType] ?? 0.15

    let weightAdd = 0
    if (weight > 35000) weightAdd = 0.15
    else if (weight > 15000) weightAdd = 0
    else weightAdd = -0.15

    const teamAdd = team ? 0.20 : 0
    const partialDeduct = isPartial ? -0.25 : 0

    let reeferTempAdd = 0
    if (loadType === "reefer") {
        if (reeferTemp < 20) reeferTempAdd = 0.25
        else if (reeferTemp < 40) reeferTempAdd = 0.10
    }

    const hazmatAdd = hazmat ? 0.30 : 0
    const expeditedAdd = expedited ? 0.40 : 0
    const multiStopAdd = multiStop ? 0.10 : 0

    const regionMultipliers = {
        west: 1.05,
        east: 1.03,
        midwest: 1.0,
        south: 1.02,
    }
    const regionMultiplier = regionMultipliers[region] ?? 1.0

    const rawRateUnadjusted =
        base +
        typeAdd +
        weightAdd +
        teamAdd +
        driverPay +
        partialDeduct +
        reeferTempAdd +
        hazmatAdd +
        expeditedAdd +
        multiStopAdd

    const rawRate = rawRateUnadjusted * regionMultiplier

    const fuelSurchargePercentage = fuelSurchargeOn ? 0.20 : 0
    const surcharge = rawRate * fuelSurchargePercentage
    const ratePerMile = rawRate + surcharge
    const totalRate = (ratePerMile * miles + tollFee).toFixed(2)

    return (
        <div className="p-5">
            {/* Grid with two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Column - Inputs */}
                <section className="space-y-6 p-8 rounded-lg shadow-lg border border-border bg-background">
                    {/* Load Type */}
                    <div>
                        <Label
                            htmlFor="load-type"
                            className="mb-2 block text-sm font-medium text-muted-foreground cursor-pointer"
                        >
                            Load Type
                        </Label>
                        <Select
                            id="load-type"
                            value={loadType}
                            onValueChange={setLoadType}
                        >
                            <SelectTrigger className="w-full h-12 rounded-md border border-border focus:ring-2 focus:ring-primary focus:ring-offset-1">
                                <SelectValue placeholder="Select load type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="van">Van</SelectItem>
                                <SelectItem value="reefer">Reefer</SelectItem>
                                <SelectItem value="flatbed">Flatbed</SelectItem>
                                <SelectItem value="tanker">Tanker</SelectItem>
                                <SelectItem value="stepdeck">Step Deck</SelectItem>
                                <SelectItem value="hopper">Hopper</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Reefer Temp - Only if Reefer */}
                    {loadType === "reefer" && (
                        <div>
                            <Label
                                htmlFor="reefer-temp-slider"
                                className="mb-2 block text-sm font-medium text-muted-foreground cursor-pointer"
                            >
                                Reefer Temp: <span className="font-semibold text-primary">{reeferTemp}°F</span>
                            </Label>
                            <Slider
                                id="reefer-temp-slider"
                                min={-20}
                                max={60}
                                step={1}
                                value={[reeferTemp]}
                                onValueChange={([v]) => setReeferTemp(v)}
                                className="w-full"
                            />
                        </div>
                    )}
                    {/* Weight */}
                    <div>
                        <Label
                            htmlFor="weight-slider"
                            className="mb-2 block text-sm font-medium text-muted-foreground cursor-pointer"
                        >
                            Weight: <span className="font-semibold text-primary">{weight} lbs</span>
                        </Label>
                        <Slider
                            id="weight-slider"
                            min={5000}
                            max={60000}
                            step={500}
                            value={[weight]}
                            onValueChange={([v]) => setWeight(v)}
                            className="w-full"
                        />
                    </div>

                    {/* Driver Pay */}
                    <div>
                        <Label
                            htmlFor="driver-pay-slider"
                            className="mb-2 block text-sm font-medium text-muted-foreground cursor-pointer"
                        >
                            Driver Pay: <span className="font-semibold text-primary">${driverPay.toFixed(2)} /mile</span>
                        </Label>
                        <Slider
                            id="driver-pay-slider"
                            min={0.3}
                            max={1.0}
                            step={0.05}
                            value={[driverPay]}
                            onValueChange={([v]) => setDriverPay(v)}
                            className="w-full"
                        />
                    </div>

                    {/* Miles */}
                    <div>
                        <Label
                            htmlFor="miles-slider"
                            className="mb-2 block text-sm font-medium text-muted-foreground cursor-pointer"
                        >
                            Miles: <span className="font-semibold text-primary">{miles} mi</span>
                        </Label>
                        <Slider
                            id="miles-slider"
                            min={50}
                            max={3000}
                            step={50}
                            value={[miles]}
                            onValueChange={([v]) => setMiles(v)}
                            className="w-full"
                        />
                    </div>

                    {/* Team Load */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="team-checkbox"
                            checked={team}
                            onCheckedChange={setTeam}
                        />
                        <Label htmlFor="team-checkbox" className="cursor-pointer text-sm font-medium">
                            Team Load?
                        </Label>
                    </div>

                    {/* Fuel Surcharge */}
                    <div className="flex items-center gap-3">
                        <Switch
                            id="fuel-switch"
                            checked={fuelSurchargeOn}
                            onCheckedChange={setFuelSurchargeOn}
                        />
                        <Label htmlFor="fuel-switch" className="cursor-pointer text-sm font-medium">
                            Fuel Surcharge? ({(fuelSurchargePercentage * 100).toFixed(0)}%)
                        </Label>
                    </div>

                    {/* Partial Load */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="partial-checkbox"
                            checked={isPartial}
                            onCheckedChange={setIsPartial}
                        />
                        <Label htmlFor="partial-checkbox" className="cursor-pointer text-sm font-medium">
                            Partial Load?
                        </Label>
                    </div>

                    {/* Hazmat */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="hazmat-checkbox"
                            checked={hazmat}
                            onCheckedChange={setHazmat}
                        />
                        <Label htmlFor="hazmat-checkbox" className="cursor-pointer text-sm font-medium">
                            Hazmat Load?
                        </Label>
                    </div>

                    {/* Expedited */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="expedited-checkbox"
                            checked={expedited}
                            onCheckedChange={setExpedited}
                        />
                        <Label htmlFor="expedited-checkbox" className="cursor-pointer text-sm font-medium">
                            Expedited Delivery?
                        </Label>
                    </div>

                    {/* Multi-Stop */}
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="multistop-checkbox"
                            checked={multiStop}
                            onCheckedChange={setMultiStop}
                        />
                        <Label htmlFor="multistop-checkbox" className="cursor-pointer text-sm font-medium">
                            Multi-Stop Route?
                        </Label>
                    </div>

                    {/* Toll Fees */}
                    <div>
                        <Label
                            htmlFor="toll-fee"
                            className="mb-2 block text-sm font-medium text-muted-foreground cursor-pointer"
                        >
                            Toll Fees ($)
                        </Label>
                        <Input
                            id="toll-fee"
                            type="number"
                            min={0}
                            step={1}
                            value={tollFee}
                            onChange={(e) => setTollFee(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    {/* Region */}
                    <div>
                        <Label
                            htmlFor="region-select"
                            className="mb-2 block text-sm font-medium text-muted-foreground cursor-pointer"
                        >
                            Region
                        </Label>
                        <Select
                            id="region-select"
                            value={region}
                            onValueChange={setRegion}
                        >
                            <SelectTrigger className="w-full h-12 rounded-md border border-border focus:ring-2 focus:ring-primary focus:ring-offset-1">
                                <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="west">West Coast</SelectItem>
                                <SelectItem value="east">East Coast</SelectItem>
                                <SelectItem value="midwest">Midwest</SelectItem>
                                <SelectItem value="south">South</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </section>

                {/* Right Column - Breakdown */}
                <section className="p-6 rounded-lg shadow-lg border border-border bg-neutral-950 sticky top-5 max-h-[95vh] overflow-auto">
                    <h2 className="text-2xl font-semibold mb-4 text-primary tracking-wide">💡 Rate Breakdown</h2>
                    <div className=" text-sm">
                        <div className="flex justify-between items-center border-1 border-neutral-800 rounded-md px-4 py-2 transition-colors hover:bg-neutral-800">
                            <span className="text-muted-foreground font-medium">Base Operating Cost</span>
                            <span className="font-semibold">${base.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center  rounded-md px-4 py-2 transition-colors hover:bg-green-950">
                            <span className="text-green-400 font-medium">Load Type Modifier</span>
                            <span className="font-semibold text-green-400">+{typeAdd.toFixed(2)}</span>
                        </div>

                        {loadType === "reefer" && (
                            <div className={`flex justify-between items-center  rounded-md px-4 py-2 transition-colors ${reeferTempAdd == 0 ? "hover:bg-neutral-800" : "hover:bg-green-950"}`}>
                                <span className={`font-medium ${reeferTempAdd == 0 ? "text-muted-foreground" : "text-green-400"}`}> Reefer Temp Surcharge</span>
                                <span className={`font-medium ${reeferTempAdd == 0 ? "text-muted-foreground" : "text-green-400"}`}>{reeferTempAdd == 0 ? "" : "+"}{reeferTempAdd.toFixed(2)}</span>
                            </div>
                        )}

                        <div className={`flex justify-between items-center rounded-md px-4 py-2 transition-colors
                                    ${weightAdd < 0 ? "hover:bg-red-950" :
                                weightAdd > 0 ? "hover:bg-green-950" : "hover:bg-neutral-800 border-neutral-800"}`}>
                            <span className={`font-medium 
                            ${weightAdd < 0 ? "text-red-400"
                                    : weightAdd > 0 ? "text-green-400" : "text-muted-foreground"}`}>
                                Weight Modifier
                            </span>
                            <span className={`font-semibold ${weightAdd < 0
                                ? "text-red-400"
                                : weightAdd > 0 ? "text-green-400" : "text-muted-foreground"}`}>

                                {weightAdd > 0 ? "+" : ""}

                                {weightAdd.toFixed(2)}

                            </span>
                        </div>


                        <div className={`flex justify-between items-center  rounded-md px-4 py-2 transition-colors ${teamAdd > 0 ? "hover:bg-green-950": "hover:bg-neutral-800"}`}>
                            <span className={`font-medium ${teamAdd > 0 ? "text-green-400" : "text-muted-foreground"}`}>Team Modifier</span>
                            <span className={`font-semibold ${teamAdd > 0 ? "text-green-400" : "text-muted-foreground"}`}>{teamAdd > 0 ? "+" : ""}{teamAdd.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center  rounded-md px-4 py-2 transition-colors hover:bg-green-950">
                            <span className="text-green-400 font-medium">Driver Pay</span>
                            <span className="font-semibold text-green-400">+{driverPay.toFixed(2)}</span>
                        </div>

                        {isPartial && (
                            <div className="flex justify-between items-center rounded-md px-4 py-2 transition-colors hover:bg-red-950">
                                <span className="text-red-400 font-medium">Partial Load Discount</span>
                                <span className="font-semibold text-red-400">{partialDeduct.toFixed(2)}</span>
                            </div>
                        )}

                        {hazmat && (
                            <div className="flex justify-between items-center  rounded-md px-4 py-2 transition-colors hover:bg-green-950">
                                <span className="text-green-400 font-medium">Hazmat Surcharge</span>
                                <span className="font-semibold text-green-400">+{hazmatAdd.toFixed(2)}</span>
                            </div>
                        )}

                        {expedited && (
                            <div className="flex justify-between items-center  rounded-md px-4 py-2 transition-colors hover:bg-green-950">
                                <span className="text-green-400 font-medium">Expedited Delivery Surcharge</span>
                                <span className="font-semibold text-green-400">+{expeditedAdd.toFixed(2)}</span>
                            </div>
                        )}

                        {multiStop && (
                            <div className="flex justify-between items-center  rounded-md px-4 py-2 transition-colors hover:bg-green-950">
                                <span className="text-green-400 font-medium">Multi-Stop Surcharge</span>
                                <span className="font-semibold text-green-400">+{multiStopAdd.toFixed(2)}</span>
                            </div>
                        )}

                        {fuelSurchargeOn && (
                            <div className="flex justify-between items-center  rounded-md px-4 py-2 transition-colors hover:bg-green-950">
                                <span className="text-green-400 font-medium">
                                    Fuel Surcharge ({(fuelSurchargePercentage * 100).toFixed(0)}%)
                                </span>
                                <span className="font-semibold text-green-400">+{surcharge.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center border-1 border-neutral-800  rounded-md px-4 py-2 transition-colors hover:bg-neutral-800">
                            <span className="text-muted-foreground font-medium">Toll Fees (flat)</span>
                            <span className="font-semibold">${tollFee.toFixed(2)}</span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border mt-6 pt-6" />

                        <div className="flex justify-between items-center text-base font-semibold">
                            <span>Rate per Mile (incl. fuel surcharge)</span>
                            <span>${ratePerMile.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-lg font-bold text-primary mt-2">
                            <span>Total Rate (incl. tolls)</span>
                            <span>${totalRate}</span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
