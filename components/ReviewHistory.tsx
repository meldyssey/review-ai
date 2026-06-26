"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReviewHistoryItem } from "@/types";
import { PLATFORMS } from "@/types";

type DateFilter = "전체" | "오늘" | "이번 주" | "이번 달";

const DATE_FILTERS: DateFilter[] = ["전체", "오늘", "이번 주", "이번 달"];

function getStartOfDay() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getStartOfWeek() {
  const date = new Date();
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 월요일 기준
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getStartOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export default function ReviewHistory({
  items,
  selectedId,
  onSelect,
}: {
  items: ReviewHistoryItem[];
  selectedId?: string;
  onSelect?: (item: ReviewHistoryItem) => void;
}) {
  const [platformFilter, setPlatformFilter] = useState<string>("전체");
  const [dateFilter, setDateFilter] = useState<DateFilter>("전체");

  const filtered = items.filter((item) => {
    if (platformFilter !== "전체" && item.platform !== platformFilter)
      return false;

    if (dateFilter !== "전체") {
      const ts = Number(item.id);
      if (dateFilter === "오늘" && ts < getStartOfDay()) return false;
      if (dateFilter === "이번 주" && ts < getStartOfWeek()) return false;
      if (dateFilter === "이번 달" && ts < getStartOfMonth()) return false;
    }

    return true;
  });

  return (
    <div>
      <h2 className="text-base font-semibold mb-3">이전 리뷰</h2>

      <div className="flex items-center flex-wrap mb-4 justify-between">
        <div className="flex gap-1.5">
          {["전체", ...PLATFORMS].map((p) => (
            <Button
              key={p}
              type="button"
              size="sm"
              variant={platformFilter === p ? "default" : "outline"}
              onClick={() => setPlatformFilter(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {DATE_FILTERS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          해당하는 리뷰가 없습니다.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
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
                    <span
                      className={`text-sm ${isSelected ? "font-bold" : "font-medium"}`}
                    >
                      {item.productName}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {item.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.review}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
