import { Suspense } from "react";
import ReturnContent from "@/components/ReturnContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReturnContent />
    </Suspense>
  );
}
