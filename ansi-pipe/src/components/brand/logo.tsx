import Image from 'next/image'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <Image
        src="/icons/icon-192x192.svg"
        alt=""
        width={192}
        height={192}
        unoptimized
        priority
        className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
      />
      <span className="min-w-0 leading-tight">
        <span className="block text-sm font-bold tracking-tight text-foreground sm:text-base">
          ANSI Pipe
        </span>
        <span className="block text-[11px] text-muted-foreground sm:text-xs">
          Schedule Calculator
        </span>
      </span>
    </span>
  )
}
