
import { Button } from '@/components/ui/button'
import { FileText, Image as ImageIcon } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { BisectionResult } from '@/lib/bisection'
import type { BisectionParams } from './BisectionConfig'

interface Props {
  result: BisectionResult
  params: BisectionParams
}

export default function ExportActions({ result, params }: Props) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('Bisection Method Results', 14, 22)
    
    doc.setFontSize(11)
    doc.text(`Function: f(x) = ${params.funcStr}`, 14, 32)
    doc.text(`Interval: [${params.aStr}, ${params.bStr}]`, 14, 38)
    doc.text(`Tolerance: ${params.toleranceStr}`, 14, 44)
    doc.text(`Estimated Root: ${result.root !== null ? result.root.toPrecision(8) : 'N/A'}`, 14, 50)
    
    const tableData = result.iterations.map(i => [
      i.iteration,
      i.a.toPrecision(8),
      i.b.toPrecision(8),
      i.c.toPrecision(8),
      i.fc.toExponential(4),
      i.error.toExponential(4)
    ])
    
    autoTable(doc, {
      startY: 60,
      head: [['Iter', 'a', 'b', 'c', 'f(c)', 'Error']],
      body: tableData,
      theme: 'grid',
      styles: { font: 'courier', fontSize: 9 },
      headStyles: { fillColor: [17, 17, 17] }
    })
    
    doc.save(`bisection-results-${Date.now()}.pdf`)
  }

  const handleDownloadGraph = () => {
    // We target the function plot div
    const el = document.getElementById('function-plot') as any
    if (el) {
      // @ts-ignore
      import('plotly.js-dist-min').then(Plotly => {
        Plotly.default.downloadImage(el, { format: 'png', width: 800, height: 600, filename: `bisection-graph-${Date.now()}` })
      }).catch(err => console.error("Failed to export graph", err))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="bg-white">
        <FileText className="w-4 h-4 mr-2" />
        Download PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownloadGraph} className="bg-white">
        <ImageIcon className="w-4 h-4 mr-2" />
        Download Graph
      </Button>
    </div>
  )
}
