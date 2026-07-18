'use client'

import { usePipeStore } from '@/store'
import { Select, type SelectOption } from '@/components/ui/select'

export function ScheduleSelector() {
  const { availableSchedules, selectedSize, selectedSchedule, setSchedule } =
    usePipeStore()

  const options: SelectOption[] = availableSchedules.map((sch) => ({
    label: `Schedule ${sch}`,
    value: sch,
  }))

  function handleSelect(value: string) {
    setSchedule(value)
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Schedule
      </label>
      <Select
        options={options}
        placeholder={
          selectedSize
            ? availableSchedules.length > 0
              ? 'Select schedule...'
              : 'No schedules available'
            : 'Select pipe size first'
        }
        value={selectedSchedule || ''}
        onChange={handleSelect}
        disabled={!selectedSize || availableSchedules.length === 0}
      />
    </div>
  )
}
