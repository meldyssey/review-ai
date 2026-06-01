import { Button } from '@/components/ui/button'
import { REVIEW_TAGS } from '@/types'

interface Props {
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

export default function TagSelector({ selectedTags, onChange }: Props) {
  const toggle = (tag: string) => {
    onChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    )
  }

  return (
    <div>
      <p className="text-sm font-medium mb-2">태그 선택 (선택사항)</p>
      <div className="flex flex-wrap gap-2">
        {REVIEW_TAGS.map((tag) => (
          <Button
            key={tag}
            type="button"
            variant={selectedTags.includes(tag) ? 'secondary' : 'outline'}
            size="sm"
            className="rounded-full text-xs"
            onClick={() => toggle(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  )
}
