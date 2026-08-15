import { Logo } from '@/components/brand/logo'

export function Footer() {
  return (
    <footer className="border-t border-border pt-8 pb-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo className="scale-90" />

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span className="text-muted-foreground/40">Social</span>
          <span className="text-muted-foreground/40">Contact</span>
        </div>

        <p className="text-xs text-muted-foreground/40">
          &copy; {new Date().getFullYear()} — All rights reserved
        </p>
      </div>
    </footer>
  )
}
