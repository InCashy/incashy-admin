"use client"

import { use, useMemo } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import data from "../data.json"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
)
const ContactCard = ({ carrier }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Contact & Bank Info</CardTitle>
      <Button variant="outline" size="sm">Edit</Button>
    </CardHeader>

    <CardContent className="space-y-2">
      <p>{carrier.name}</p>
      <p>MC: {carrier.dot_number} | MC: {carrier.mc_number}</p>
      <Separator className="my-2" />
      <p>Email: {carrier.contact.email}</p>
      <p>Phone: {carrier.contact.phone}</p>
      <p>Address: {carrier.contact.address}</p>
      <Separator className="my-2" />
      <p>Bank: {carrier.bank_details.account_name}</p>
      <p>Routing: {carrier.bank_details.routing_number}</p>
      <p>Account: {carrier.bank_details.account_number}</p>
    </CardContent>
  </Card>
)

const ComplianceSection = ({ compliance }) => (
  <Card>
    <CardHeader>
      <CardTitle>Compliance</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <p>NOA Sent: {compliance.noa_sent ? <Badge status="yes"></Badge> : <Badge status="no"></Badge>}</p>
      <p>Insurance Verified: {compliance.insurance_verified ? <Badge status="yes"></Badge> : <Badge status="no"></Badge>}</p>
      <p>Insurance Expires: {compliance.insurance_expires}</p>
    </CardContent>
  </Card>
)

const PerformanceMetrics = ({ metrics }) => (
  <Card>
    <CardHeader>
      <CardTitle>Performance</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <InfoRow label="Total Loads" value={metrics.total_loads} />
      <InfoRow label="On-Time %" value={`${(metrics.on_time_rate * 100).toFixed(1)}%`} />
      <InfoRow label="Avg Pay Days" value={`${metrics.avg_payment_days} days`} />
      <InfoRow label="Total Paid" value={`$${metrics.total_paid.toLocaleString()}`} />
      <InfoRow label="Avg Invoice" value={`$${metrics.avg_invoice_size.toLocaleString()}`} />
      <InfoRow label="Disputes" value={metrics.disputes} />
    </CardContent>
  </Card>
)

const DocumentsList = ({ documents }) => (
  <Card>
    <CardHeader>
      <CardTitle>Documents</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {Object.entries(documents || {})
        .filter(([_, url]) => !!url)
        .map(([key, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline block"
          >
            {decodeURIComponent(url.split("/").pop() || key)}
          </a>
        ))}
    </CardContent>
  </Card>
)

const BrokersWorkedWith = ({ brokers }) => (
  <Card>
    <CardHeader className="flex justify-between items-center">
      <CardTitle>Brokers Worked With</CardTitle>
      <Link href={`/carriers/relations`} className="text-sm text-blue-600 underline">
        See more
      </Link>
    </CardHeader>
    <CardContent className="space-y-2">
      {brokers.slice(0, 5).map((broker, i) => (
        <div key={i}>
          <p className="font-medium">{broker.name}</p>
          <p className="text-sm text-muted-foreground">
            Loads: {broker.loads} | Total: ${broker.total_amount.toLocaleString()}
          </p>
        </div>
      ))}
    </CardContent>
  </Card>
)

const NotesSection = ({ notes }) => (
  <Card>
    <CardHeader>
      <CardTitle>Internal Notes</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes}</p>
    </CardContent>
  </Card>
)
const colorPairs = [
  { bg: "D9FFC9", text: "4C9A2A" },
  { bg: "C9E4FF", text: "1B6DC1" },
  { bg: "FFE5B4", text: "E67E22" },
  { bg: "FCD9FF", text: "B0329E" },
  { bg: "FFF5C9", text: "B7950B" },
  { bg: "E0C9FF", text: "8E44AD" },
  { bg: "C9FFEE", text: "16A085" },
  { bg: "FFD9D9", text: "C0392B" },
  { bg: "FFFFFF", text: "000000" },
];
function getColorPairForCompany(dotNumber) {
  const hash = [String(dotNumber)].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colorPairs[hash % colorPairs.length]
}
const CarrierProfilePage = ({ params }) => {
  const resolvedParams = use(params)
  const carrierId = resolvedParams.carrierId

  const carrier = data.carriers?.find((c) => c.dot_number === carrierId)
  if (!carrier) return notFound()

  const colorPair = useMemo(() => getColorPairForCompany(carrier.dot_number), [carrier.dot_number])
  const { bg, text } = colorPair

  const imageUrl = useMemo(() => {
    const name = encodeURIComponent(carrier.name)
    return `https://placehold.co/600x400/${bg}/${text}?font=montserrat&text=${name}`
  }, [bg, text, carrier.name])
  return (
    <div className="p-6 space-y-8">
      <div className="w-full mb-4">
        <img
          src={imageUrl}
          alt={`${carrier.name} Logo`}
          className="rounded-xl shadow-md object-cover w-full h-60"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {carrier.name}
          <Badge status={carrier.status}></Badge>
        </h1>
        <p className="text-muted-foreground text-sm">
          Onboarded: {carrier.onboarded_at} | Last Active: {carrier.last_activity}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContactCard carrier={carrier} />
        <ComplianceSection compliance={carrier.compliance} />
      </div>

      <PerformanceMetrics metrics={carrier.metrics} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentsList documents={carrier.documents} />
        <BrokersWorkedWith brokers={carrier.brokers_worked_with} />
      </div>

      <NotesSection notes={carrier.notes} />
    </div>
  )
}

export default CarrierProfilePage;
