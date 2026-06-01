import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Props {
  pros: string
  cons: string
  onProsChange: (v: string) => void
  onConsChange: (v: string) => void
}

export default function ReviewInput({ pros, cons, onProsChange, onConsChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pros">좋은 점</Label>
        <Textarea
          id="pros"
          value={pros}
          onChange={(e) => onProsChange(e.target.value)}
          placeholder="사용해보면서 좋았던 점을 자유롭게 작성하세요"
          rows={3}
          className="resize-none"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cons">아쉬운 점</Label>
        <Textarea
          id="cons"
          value={cons}
          onChange={(e) => onConsChange(e.target.value)}
          placeholder="아쉬웠던 점이나 개선되었으면 하는 점을 작성하세요"
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  )
}
