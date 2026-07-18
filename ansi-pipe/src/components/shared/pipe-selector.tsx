'use client'

import { usePipeStore } from '@/store'
import { Select, type SelectOption } from '@/components/ui/select'

export function PipeSelector() {
  const { availableSizes, selectedSize, setPipeSize } = usePipeStore()

  const options: SelectOption[] = availableSizes.map((size) => ({
    label: `NPS ${size}"`,
    value: size,
  }))

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Pipe Size
      </label>
      <Select
        options={options}
        placeholder="Select pipe size..."
        value={selectedSize || ''}
        onChange={setPipeSize}
      />
    </div>
  )
}
