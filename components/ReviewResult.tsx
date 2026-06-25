"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { ReviewHistoryItem } from "@/types";

interface Props {
  item: ReviewHistoryItem;
  onSave?: (text: string) => void;
}

export default function ReviewResult({ item, onSave }: Props) {
  const [editText, setEditText] = useState(item.review);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditText(item.review);
  }, [item.id]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [editText]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editText);
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <Card className="ring-primary">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{item.platform}</Badge>
          <span className="text-sm font-bold">{item.productName}</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {item.createdAt}
          </span>
        </div>
        <div className="flex gap-2 justify-end mb-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? "복사됨 ✓" : "복사"}
          </Button>
          {onSave && (
            <Button size="sm" onClick={() => onSave(editText)}>
              저장
            </Button>
          )}
        </div>
        <Textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="text-sm leading-relaxed resize-none overflow-hidden"
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {[...editText].length}자
        </p>
      </CardContent>
    </Card>
  );
}
