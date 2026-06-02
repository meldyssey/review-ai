"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  review: string;
}

export default function ReviewResult({ review }: Props) {
  const [copied, setCopied] = useState(false);
  const [curReview, setCurReview] = useState(review);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(curReview);
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleReset = () => setCurReview(review);

  const isModified = curReview !== review;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [curReview]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">생성된 리뷰</CardTitle>
            {isModified && (
              <span className="text-xs text-muted-foreground">수정됨</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isModified && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                초기화
              </Button>
            )}
            <Button size="sm" onClick={handleCopy}>
              {copied ? "복사됨 ✓" : "복사"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          ref={textareaRef}
          value={curReview}
          onChange={(e) => setCurReview(e.target.value)}
          className="text-sm leading-relaxed resize-none overflow-hidden"
          aria-label="생성된 리뷰 내용"
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {[...curReview].length}자
        </p>
      </CardContent>
    </Card>
  );
}
