import type { Metadata } from "next";
import { Suspense } from "react";
import { IndexTable } from "@/components/IndexTable";
import { byNumber, sectors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Index",
  description:
    "The complete archive of Edward McCann Architecture: 27 works, with place, year, type and status declared for each.",
};

export default function IndexPage() {
  return (
    <Suspense fallback={null}>
      <IndexTable projects={byNumber} sectors={sectors} />
    </Suspense>
  );
}
