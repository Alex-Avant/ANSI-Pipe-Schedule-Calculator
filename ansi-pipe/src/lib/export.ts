import type { PipeEntry, PipeCalculations } from '@/types'

export async function exportToPdf(
  pipe: PipeEntry,
  calculations: PipeCalculations
): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.text('ANSI Pipe Schedule Report', 14, 22)

  doc.setFontSize(11)
  doc.text(`Pipe Size: ${pipe.pipeSize}  |  Schedule: ${pipe.schedule}`, 14, 32)

  const rows = [
    ['Outside Diameter', `${pipe.outsideDiameter.inch}"`, `${pipe.outsideDiameter.mm} mm`],
    ['Wall Thickness', `${pipe.wallThickness.inch}"`, `${pipe.wallThickness.mm} mm`],
    ['Inside Diameter', `${calculations.insideDiameter.inch}"`, `${calculations.insideDiameter.mm} mm`],
    ['Flow Area', `${calculations.flowArea.squareInch} in²`, `${calculations.flowArea.squareMm} mm²`],
    ['Weight per Foot', `${pipe.weight.lbPerFt} lb/ft`, `${pipe.weight.kgPerM} kg/m`],
    ['Total Length', `${calculations.totalLength} ft`, `${+(calculations.totalLength * 0.3048).toFixed(2)} m`],
    ['Total Weight', `${calculations.weightPerLength.lb} lb`, `${calculations.weightPerLength.kg} kg`],
  ]

  autoTable(doc, {
    startY: 40,
    head: [['Parameter', 'Imperial', 'Metric']],
    body: rows,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 41, 41] },
  })

  doc.save(`pipe_${pipe.pipeSize}_sch${pipe.schedule}.pdf`)
}

export async function exportToExcel(
  pipe: PipeEntry,
  calculations: PipeCalculations
): Promise<void> {
  const XLSX = await import('xlsx')

  const data = [
    { Parameter: 'Pipe Size', Imperial: pipe.pipeSize, Metric: '' },
    { Parameter: 'Schedule', Imperial: pipe.schedule, Metric: '' },
    { Parameter: 'Outside Diameter', Imperial: `${pipe.outsideDiameter.inch}"`, Metric: `${pipe.outsideDiameter.mm} mm` },
    { Parameter: 'Wall Thickness', Imperial: `${pipe.wallThickness.inch}"`, Metric: `${pipe.wallThickness.mm} mm` },
    { Parameter: 'Inside Diameter', Imperial: `${calculations.insideDiameter.inch}"`, Metric: `${calculations.insideDiameter.mm} mm` },
    { Parameter: 'Flow Area', Imperial: `${calculations.flowArea.squareInch} in²`, Metric: `${calculations.flowArea.squareMm} mm²` },
    { Parameter: 'Weight per Foot', Imperial: `${pipe.weight.lbPerFt} lb/ft`, Metric: `${pipe.weight.kgPerM} kg/m` },
    { Parameter: 'Total Length', Imperial: `${calculations.totalLength} ft`, Metric: `${+(calculations.totalLength * 0.3048).toFixed(2)} m` },
    { Parameter: 'Total Weight', Imperial: `${calculations.weightPerLength.lb} lb`, Metric: `${calculations.weightPerLength.kg} kg` },
  ]

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, 'Pipe Data')
  XLSX.writeFile(wb, `pipe_${pipe.pipeSize}_sch${pipe.schedule}.xlsx`)
}

export async function copyResultsToClipboard(
  pipe: PipeEntry,
  calculations: PipeCalculations
): Promise<void> {
  const text = `ANSI Pipe Schedule
Pipe Size: ${pipe.pipeSize}
Schedule: ${pipe.schedule}
Outside Diameter: ${pipe.outsideDiameter.inch}" (${pipe.outsideDiameter.mm} mm)
Wall Thickness: ${pipe.wallThickness.inch}" (${pipe.wallThickness.mm} mm)
Inside Diameter: ${calculations.insideDiameter.inch}" (${calculations.insideDiameter.mm} mm)
Flow Area: ${calculations.flowArea.squareInch} in² (${calculations.flowArea.squareMm} mm²)
Weight per Foot: ${pipe.weight.lbPerFt} lb/ft (${pipe.weight.kgPerM} kg/m)
Total Length: ${calculations.totalLength} ft
Total Weight: ${calculations.weightPerLength.lb} lb (${calculations.weightPerLength.kg} kg)`

  await navigator.clipboard.writeText(text)
}

export async function shareAsImage(
  elementId: string,
  filename: string = 'pipe-result.png'
): Promise<void> {
  const html2canvas = (await import('html2canvas')).default
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function shareResults(
  pipe: PipeEntry,
  calculations: PipeCalculations
): Promise<boolean> {
  const text = `ANSI Pipe: ${pipe.pipeSize}" Schedule ${pipe.schedule}
OD: ${pipe.outsideDiameter.inch}" | WT: ${pipe.wallThickness.inch}"
ID: ${calculations.insideDiameter.inch}" | Weight: ${pipe.weight.lbPerFt} lb/ft`

  if (navigator.share) {
    await navigator.share({ title: 'Pipe Schedule Result', text })
    return true
  } else {
    await copyResultsToClipboard(pipe, calculations)
    return false
  }
}
