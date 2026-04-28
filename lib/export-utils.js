export function downloadCsv({ series, totals, blocks, meta }) {
  const lines = []
  lines.push(`# Arasaka — Campus Operating Layer`)
  lines.push(`# Range: ${meta.range} · Block: ${meta.block} · Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('# KPI totals')
  lines.push('metric,value')
  Object.entries(totals).forEach(([k, v]) => lines.push(`${k},${v}`))
  lines.push('')
  lines.push('# Time series')
  lines.push('time,hvac,lighting,ev,water,rvm,solar,total,baseline,net')
  series.forEach((p) => {
    lines.push(
      [p.t, p.hvac, p.lighting, p.ev, p.water, p.rvm, p.solar, p.total, p.baseline, p.net].join(','),
    )
  })
  lines.push('')
  lines.push('# Per-block summary')
  lines.push('id,name,kind,total,solar,baseline,savings,savings_pct,co2,status')
  blocks.forEach((b) => {
    lines.push(
      [b.id, b.name, b.kind, b.total, b.solar, b.baseline, b.savings, b.savingsPct, b.co2, b.status].join(','),
    )
  })
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `arasaka-${meta.range}-${meta.block}-${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadPdf({ series, totals, blocks, meta }) {
  // Lazy-load to keep first paint fast
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 40
  const w = doc.internal.pageSize.getWidth()

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('Arasaka', margin, margin + 10)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(80)
  doc.text('Campus Operating Layer — Console Export', margin, margin + 28)

  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(
    `Range: ${meta.range.toUpperCase()}  ·  Block: ${meta.block}  ·  Generated: ${new Date().toLocaleString('en-IN')}`,
    margin,
    margin + 44,
  )

  doc.setDrawColor(40, 122, 76)
  doc.setLineWidth(2)
  doc.line(margin, margin + 56, w - margin, margin + 56)

  doc.setTextColor(20)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('KPI summary', margin, margin + 80)

  autoTable(doc, {
    startY: margin + 90,
    head: [['Metric', 'Value']],
    body: [
      ['Total consumption', `${totals.total.toLocaleString()} kWh`],
      ['Baseline', `${totals.baseline.toLocaleString()} kWh`],
      ['Savings vs baseline', `${totals.savings.toLocaleString()} kWh (${totals.savingsPct}%)`],
      ['Solar generated', `${totals.solar.toLocaleString()} kWh`],
      ['CO₂ avoided', `${totals.co2.toLocaleString()} kg`],
    ],
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [20, 20, 20], textColor: 255, halign: 'left' },
    alternateRowStyles: { fillColor: [248, 248, 244] },
    margin: { left: margin, right: margin },
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Per-block performance', margin, doc.lastAutoTable.finalY + 28)

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 38,
    head: [['Block', 'Kind', 'Total kWh', 'Solar kWh', 'Savings %', 'CO₂ kg', 'Status']],
    body: blocks.map((b) => [
      b.name,
      b.kind,
      b.total.toLocaleString(),
      b.solar.toLocaleString(),
      `${b.savingsPct}%`,
      b.co2.toLocaleString(),
      b.status.toUpperCase(),
    ]),
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [20, 20, 20], textColor: 255 },
    margin: { left: margin, right: margin },
  })

  doc.addPage()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(`Time-series · ${meta.range.toUpperCase()}`, margin, margin + 10)
  autoTable(doc, {
    startY: margin + 22,
    head: [['Time', 'HVAC', 'Lighting', 'EV', 'Water', 'RVM', 'Solar', 'Total', 'Baseline']],
    body: series.map((p) => [
      p.t,
      p.hvac,
      p.lighting,
      p.ev,
      p.water,
      p.rvm,
      p.solar,
      p.total,
      p.baseline,
    ]),
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [20, 20, 20], textColor: 255 },
    margin: { left: margin, right: margin },
  })

  doc.setFontSize(8)
  doc.setTextColor(140)
  const pages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.text(
      `Arasaka · v0.1 · Page ${i} of ${pages}`,
      margin,
      doc.internal.pageSize.getHeight() - 16,
    )
  }

  doc.save(`arasaka-${meta.range}-${meta.block}-${Date.now()}.pdf`)
}
