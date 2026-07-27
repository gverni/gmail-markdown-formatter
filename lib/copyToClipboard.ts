export const PREVIEW_CONTENT_ID = "preview-content";

export async function copyHtmlFromPreviewElement(
  previewElement: HTMLElement | null,
): Promise<void> {
  if (!previewElement) {
    throw new Error("Preview element not found");
  }

  const htmlContent = previewElement.innerHTML;

  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([htmlContent], { type: "text/html" }),
      "text/plain": new Blob([previewElement.innerText], { type: "text/plain" }),
    }),
  ]);
}
