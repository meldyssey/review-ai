import { Button } from '@/components/ui/button'
import type { Platform } from '@/types'

interface Props {
  platforms: Platform[]
  selected: Platform
  onChange: (p: Platform) => void
}

export default function PlatformSelector({ platforms, selected, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">플랫폼 선택</p>
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <Button
            key={p}
            type="button"
            variant={selected === p ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => onChange(p)}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  )
}
