import { useEffect } from "react";

import { buildDocumentTitle } from "@/lib/documentTitle";

export function useDocumentTitle(pageTitle?: string): void {
  useEffect(() => {
    document.title = buildDocumentTitle(pageTitle);
  }, [pageTitle]);
}
