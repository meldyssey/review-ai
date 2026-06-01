---
name: scaffold-nextjs-project
description: review-ai Next.js 프로젝트의 초기 파일 구조와 설정을 생성한다. package.json, tsconfig, tailwind, shadcn/ui 초기화, 디렉토리 구조, 공통 타입 정의를 포함한다.
---

# Next.js 프로젝트 스캐폴딩

## 생성할 파일 목록

```
package.json
tsconfig.json
next.config.mjs
tailwind.config.ts
postcss.config.mjs
components.json          ← shadcn/ui 설정
.env.local.example
app/
  layout.tsx
  page.tsx
  globals.css
components/
  ui/                    ← shadcn add 명령어로 자동 생성됨
lib/
  utils.ts               ← shadcn cn 헬퍼
types/
  index.ts
```

## package.json

```json
{
  "name": "review-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "openai": "^4.52.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "postcss": "^8",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.5"
  }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## next.config.mjs

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
```

## tailwind.config.ts — shadcn/ui 호환 설정

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

## postcss.config.mjs

```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

## components.json — shadcn/ui 프로젝트 설정

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## .env.local.example

```
OPENAI_API_KEY=your-openai-api-key-here
```

## app/globals.css — shadcn CSS 변수 포함

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## lib/utils.ts — shadcn cn 헬퍼

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## app/layout.tsx

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 리뷰 작성기',
  description: '간단한 내용으로 완성도 높은 리뷰를 작성하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-background min-h-screen">{children}</body>
    </html>
  )
}
```

## app/page.tsx (초기 플레이스홀더)

```typescript
export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 리뷰 작성기</h1>
    </main>
  )
}
```

## types/index.ts

```typescript
export type Platform = '쿠팡' | '네이버' | '11번가' | 'G마켓' | '올리브영'

export interface ReviewFormData {
  platform: Platform
  productName: string
  category: string
  pros: string
  cons: string
  tags: string[]
}

export interface GenerateReviewRequest extends ReviewFormData {}

export interface GenerateReviewResponse {
  review: string
}

export interface ReviewHistoryItem {
  id: string
  createdAt: string
  platform: Platform
  productName: string
  review: string
}

export const PLATFORMS: Platform[] = ['쿠팡', '네이버', '11번가', 'G마켓', '올리브영']

export const REVIEW_TAGS: string[] = [
  '가성비 좋은', '배송 빠른', '품질 우수한', '디자인 예쁜',
  '내구성 좋은', '사용하기 편한', '가격 대비 만족', '재구매 의사 있는',
  '포장 꼼꼼한', '사이즈 정확한',
]
```

## shadcn 컴포넌트 설치 — npm install 이후 실행

파일 생성 후 아래 두 명령어를 순서대로 실행한다:

```bash
npm install
npx shadcn@latest add button input textarea card badge label
```

이 명령어가 `components/ui/` 아래에 Button, Input, Textarea, Card, Badge, Label 컴포넌트 파일을 자동 생성한다. `ui-builder`는 이 파일들이 존재한다고 가정하고 import한다.
