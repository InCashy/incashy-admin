"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import data from "../data.json"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ProgressStepBar } from "@/components/ui/progress-step-bar"

const ContactCard = ({ title, entity }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
            <p className="font-medium">{entity.name}</p>
            {entity.mc_number && entity.dot_number && (
                <p>
                    MC: {entity.mc_number} | DOT: {entity.dot_number}
                </p>
            )}
            {entity.contact && (
                <>
                    <p>Email: {entity.contact.email}</p>
                    <p>Phone: {entity.contact.phone}</p>
                </>
            )}
            {entity.bank_details && (
                <>
                    <Separator className="my-2" />
                    <p className="text-sm text-muted-foreground">Bank:</p>
                    <p>
                        {entity.bank_details.account_name}
                        <br />
                        Routing: {entity.bank_details.routing_number}
                        <br />
                        Account: {entity.bank_details.account_number}
                    </p>
                </>
            )}
        </CardContent>
    </Card>
)

const LoadStops = ({ stops }) => {
    const filteredStops = (stops || []).filter((s) => s.type === "pickup" || s.type === "delivery")
    let counter = 1

    return (
        <>
            {["pickup", "delivery"].map((type) => {
                const stopsOfType = filteredStops.filter((s) => s.type === type)
                if (stopsOfType.length === 0) return null

                const label = type === "pickup" ? "Pickup Locations" : "Delivery Locations"

                return (
                    <div key={type}>
                        <p className="font-semibold text-muted-foreground">{label}</p>
                        <div className="space-y-2 mt-1">
                            {stopsOfType.map((stop) => {
                                const displayIndex = counter++
                                return (
                                    <div key={`${type}-${displayIndex}`} className="text-sm pl-6">
                                        <p className="font-medium">
                                            {displayIndex}.- {stop.location}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {stop.timeframe ? (
                                                <>
                                                    {new Date(stop.timeframe.start).toLocaleString()} -{" "}
                                                    {new Date(stop.timeframe.end).toLocaleString()}
                                                </>
                                            ) : (
                                                new Date(stop.date).toLocaleString()
                                            )}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </>
    )
}

const Charges = ({ charges }) => {
    const hasCharges =
        (charges?.line_haul ?? 0) > 0 || (charges?.fuel_surcharge ?? 0) > 0 || (charges?.detention ?? 0) > 0

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{hasCharges ? "Charges" : "No Charges"}</CardTitle>
            </CardHeader>
            {hasCharges && (
                <CardContent className="space-y-1">
                    {charges.line_haul > 0 && <p>Line Haul: ${charges.line_haul.toFixed(2)}</p>}
                    {charges.fuel_surcharge > 0 && <p>Fuel Surcharge: ${charges.fuel_surcharge.toFixed(2)}</p>}
                    {charges.detention > 0 && <p>Detention: ${charges.detention.toFixed(2)}</p>}
                    <Separator className="my-2" />
                    <p className="font-semibold">Total: ${charges.total?.toFixed(2) ?? "0.00"}</p>
                </CardContent>
            )}
        </Card>
    )
}

const FactoringDetails = ({ factoring }) => (
    <Card>
        <CardHeader>
            <CardTitle>Factoring</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
            <p>Factor ID: {factoring.factor_id}</p>
            <p>Purchase Date: {factoring.purchase_date}</p>
            <p>Advance Rate: {(factoring.advance_rate * 100).toFixed(0)}%</p>
            <p>Advance Amount: ${factoring.advance_amount.toFixed(2)}</p>
            <p>Reserve: ${factoring.reserve.toFixed(2)}</p>
            <p>Fee Rate: {(factoring.fee_rate * 100).toFixed(1)}%</p>
            <p>Factoring Fee: ${factoring.factoring_fee.toFixed(2)}</p>
            <p>
                Payment Received:{" "}
                <Badge
                    status={factoring.payment_received ? "yes" : "no"}>
                    {factoring.payment_received ? "Yes" : "No"}
                </Badge>
            </p>
        </CardContent>
    </Card>
)

const DocumentsList = ({ documents }) => (
<Card className="h-full">
  <CardHeader>
    <CardTitle>Documents</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    {Object.entries(documents)
      .filter(([_, url]) => !!url)
      .map(([key, url]) => {
        const rawFileName = url.split("/").pop() || key
        const decodedName = decodeURIComponent(rawFileName)
        const lastDotIndex = decodedName.lastIndexOf(".")
        const namePart = decodedName.substring(0, lastDotIndex)
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
        const extension = decodedName.substring(lastDotIndex)

        const formattedName = `${namePart}${extension}`

        return (
          <a
            key={key}
            className="underline block"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {formattedName}
          </a>
        )
      })}
  </CardContent>
</Card>


)

const InvoiceViewPage = ({ params }) => {
    const { invoiceId } = use(params)
    const invoice = data.find((inv) => inv.invoice_id === invoiceId)

    if (!invoice) return notFound()

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Invoice <span className="text-muted-foreground">{invoice.invoice_id}</span>
                    <Badge status={invoice.status} />
                </h1>
                <p className="text-muted-foreground text-sm">
                    Issued: {invoice.issued_date} | Due: {invoice.due_date} | Terms: {invoice.payment_terms}
                </p>
            </div>
            <ProgressStepBar currentStatus={invoice.status}></ProgressStepBar>
            {/* Top Info Section (Carrier + Broker) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContactCard title="Carrier" entity={invoice.carrier} />
                <ContactCard title="Broker" entity={invoice.broker} />
            </div>

            {/* Load Info + Charges/Documents */}
            <div className="md:flex gap-4">
                {/* Left: Load Info */}
                <div className="md:w-1/2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Load Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Load: {invoice.load.load_id}</p>
                            <LoadStops stops={invoice.load.stops} />
                            <Separator className="my-4" />
                            <div className="space-y-1">
                                <p>Equipment: {invoice.load.equipment}</p>
                                <p>Weight: {invoice.load.weight}</p>
                                <p>Commodity: {invoice.load.commodity}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Charges and Documents split evenly */}
                <div className="md:w-1/2 flex flex-col">
                    <div className="flex-1">
                        <div className="h-full">
                            <Charges charges={invoice.charges} />
                        </div>
                    </div>
                    <div className="flex-1 mt-4">
                        <div className="h-full">
                            <DocumentsList documents={invoice.documents} />
                        </div>
                    </div>
                </div>
            </div>


            {/* Factoring */}
            <FactoringDetails factoring={invoice.factoring} />
        </div>
    )
}

export default InvoiceViewPage
