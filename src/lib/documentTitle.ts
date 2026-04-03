const appName = "Recipe Book";

export function buildDocumentTitle(pageTitle?: string): string {
  if (pageTitle === undefined || pageTitle.trim().length === 0) {
    return appName;
  }

  return `${pageTitle} - ${appName}`;
}
