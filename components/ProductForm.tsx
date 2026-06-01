import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  productName: string
  category: string
  onProductNameChange: (v: string) => void
  onCategoryChange: (v: string) => void
}

export default function ProductForm({ productName, category, onProductNameChange, onCategoryChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="productName">상품명 *</Label>
        <Input
          id="productName"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="예: 삼성 갤럭시 버즈2"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category">카테고리</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="예: 무선이어폰"
        />
      </div>
    </div>
  )
}
