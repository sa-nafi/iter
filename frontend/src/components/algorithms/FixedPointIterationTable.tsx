import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { FixedPointIteration } from '@/lib/types'

interface Props {
  iterations: FixedPointIteration[]
}

export default function FixedPointIterationTable({ iterations }: Props) {
  if (!iterations || iterations.length === 0) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Iteration Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Iter</TableHead>
                <TableHead>xᵢ</TableHead>
                <TableHead>g(xᵢ) / xᵢ₊₁</TableHead>
                <TableHead className="text-right">Error |xᵢ₊₁ - xᵢ|</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iterations.map((row) => (
                <TableRow key={row.iteration}>
                  <TableCell className="font-medium font-mono text-xs">{row.iteration}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-600">{row.xi.toPrecision(8)}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-zinc-900">{row.gxi.toPrecision(8)}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-zinc-600">{row.error.toExponential(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
