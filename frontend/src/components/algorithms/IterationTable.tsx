
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Iteration } from '@/lib/types'

interface Props {
  iterations: Iteration[]
}

export default function IterationTable({ iterations }: Props) {
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
                <TableHead>a</TableHead>
                <TableHead>b</TableHead>
                <TableHead>c</TableHead>
                <TableHead>f(c)</TableHead>
                <TableHead className="text-right">Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {iterations.map((row) => (
                <TableRow key={row.iteration}>
                  <TableCell className="font-medium font-mono text-xs">{row.iteration}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-600">{row.a.toPrecision(8)}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-600">{row.b.toPrecision(8)}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-zinc-900">{row.c.toPrecision(8)}</TableCell>
                  <TableCell className="font-mono text-xs text-zinc-600">{row.fc.toExponential(4)}</TableCell>
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
