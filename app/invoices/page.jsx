import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DataTable } from "@/components/data-table"
import data from './data.json'
import SearchBar from '@/components/custom/search-bar'

const rows = data.map((item, index) => ({
  id: item.invoice_id || `row-${index}`,
  carrier: item.carrier.name,
  broker: item.broker.name,
  route: `${item.load.stops[0].location} → ${item.load.stops[item.load.stops.length - 1].location}`,
  amount: `$${item.charges.total.toFixed(2)}`,
  due: item.due_date,
  status: item.status // "Reviewing", "Reviewing", "Approved", "Funded", "Paid", "Rejected"
}))

export const metadata = {
  title: "Invoices",
  description: "invoices",
  alternates: {
    canonical: "https://www.incashy.com",
  }
};



const InvoicesPage = () => {
  return (
    <div>
      <div className="py-4">
        <SearchBar />
      </div>

      <DataTable
        data={rows}
      />

    </div>
  )
}

export default InvoicesPage