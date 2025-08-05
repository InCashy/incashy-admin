"use client"
import { useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


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
// Hash function to get deterministic index
function getColorPairForCompany(dotNumber) {
    const hash = [String(dotNumber)].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colorPairs[hash % colorPairs.length]
}
const CompanyCard = ({ company, carrier, broker }) => {
    const colorPair = useMemo(() => getColorPairForCompany(company.dot_number), [company.dot_number])
    const { bg, text } = colorPair

    const imageUrl = useMemo(() => {
        const name = encodeURIComponent(company.name)
        return `https://placehold.co/600x400/${bg}/${text}?font=montserrat&text=${name}`
    }, [bg, text, company.name])

    return (
        <Card>
            <CardContent>
                <img
                    src={imageUrl}
                    alt="company Image"
                    className="h-46 w-full object-cover mb-4 rounded-md"
                />
            </CardContent>

            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    {company.name}
                    <Badge onlyIcon status={company.status} />
                </CardTitle>
                <CardDescription>
                    DOT#{company.dot_number} • MC#{company.mc_number}
                </CardDescription>
            </CardHeader>

            <CardFooter>
                {carrier ? (
                    <Button asChild variant="outline" className="w-full">
                        <Link href={`/carriers/${company.dot_number}`}>View Carrier</Link>
                    </Button>
                ) : broker ? (
                    <Button asChild variant="outline" className="w-full">
                        <Link href={`/brokers/${company.dot_number}`}>View Broker</Link>
                    </Button>
                ) : (
                    <Button disabled variant="outline" className="w-full">
                        Unknown
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}


export default CompanyCard
