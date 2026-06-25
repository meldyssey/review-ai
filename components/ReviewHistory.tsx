import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReviewHistoryItem } from "@/types";

interface Props {
  items: ReviewHistoryItem[];
  selectedId?: string;
  onSelect?: (item: ReviewHistoryItem) => void;
}

export default function ReviewHistory({ items, selectedId, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">이전 리뷰</h2>
      <div className="space-y-2">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <Card
              key={item.id}
              onClick={() => onSelect?.(item)}
              className={`transition-colors cursor-pointer hover:bg-accent ${isSelected ? "ring-2 ring-primary" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="secondary">{item.platform}</Badge>
                  <span className={`text-sm ${isSelected ? "font-bold" : "font-medium"}`}>
                    {item.productName}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">{item.createdAt}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.review}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
