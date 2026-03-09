import { cryptoPairs } from "@/data/mockData";

export function generateStaticParams() {
  return cryptoPairs.map((pair) => ({
    pair: pair.id,
  }));
}

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
