"use client";

import { useState, useEffect, useRef } from "react";
import PlatformSelector from "@/components/PlatformSelector";
import ProductForm from "@/components/ProductForm";
import ReviewInput from "@/components/ReviewInput";
import TagSelector from "@/components/TagSelector";
import ReviewResult from "@/components/ReviewResult";
import ReviewHistory from "@/components/ReviewHistory";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Platform, ReviewHistoryItem } from "@/types";
import { PLATFORMS } from "@/types";
import { getReviewHistory, saveReviewToHistory, updateReviewTextInHistory } from "@/lib/review-history";

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("쿠팡");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>();
  const reviewResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getReviewHistory());
  }, []);

  const selectedItem = history.find((h) => h.id === selectedHistoryId);

  const handleSelectHistory = (item: ReviewHistoryItem) => {
    setPlatform(item.platform);
    setProductName(item.productName);
    setCategory(item.category ?? "");
    setPros(item.pros ?? "");
    setCons(item.cons ?? "");
    setTags(item.tags ?? []);
    setSelectedHistoryId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveReview = (text: string) => {
    if (!selectedHistoryId) return;
    const updated = updateReviewTextInHistory(selectedHistoryId, text);
    setHistory(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || (!pros.trim() && !cons.trim())) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, productName, category, pros, cons, tags }),
      });

      if (!res.ok) throw new Error("리뷰 생성에 실패했습니다");

      const data = await res.json();
      const updated = saveReviewToHistory({ platform, productName, category, pros, cons, tags, review: data.review });
      setHistory(updated);
      setSelectedHistoryId(updated[0].id);

      setTimeout(() => {
        reviewResultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 리뷰 작성기</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PlatformSelector platforms={PLATFORMS} selected={platform} onChange={setPlatform} />
        <ProductForm
          productName={productName}
          category={category}
          onProductNameChange={setProductName}
          onCategoryChange={setCategory}
        />
        <ReviewInput pros={pros} cons={cons} onProsChange={setPros} onConsChange={setCons} />
        <TagSelector selectedTags={tags} onChange={setTags} />
        <Button type="submit" disabled={isLoading || !productName.trim()} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              리뷰 생성 중...
            </>
          ) : (
            "리뷰 생성하기"
          )}
        </Button>
      </form>

      {selectedItem && (
        <div ref={reviewResultRef} className="mt-6">
          <ReviewResult item={selectedItem} onSave={handleSaveReview} />
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <ReviewHistory
            items={history}
            selectedId={selectedHistoryId}
            onSelect={handleSelectHistory}
          />
        </div>
      )}
    </main>
  );
}
