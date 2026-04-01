const PX_PATTERN = /\b\d+(\.\d+)?px\b/i;
const OVERFLOW_HIDDEN_PATTERN = /overflow\s*:\s*hidden/i;

export function validateSlideHtmlDocument(htmlDocument: string) {
  if (!htmlDocument.trim()) {
    throw new Error("Generated HTML was empty.");
  }

  if (!htmlDocument.includes("<html")) {
    throw new Error("Generated slide must be a full HTML document.");
  }

  if (!htmlDocument.includes('data-slide-root="true"')) {
    throw new Error('Generated slide must include a root node with data-slide-root="true".');
  }

  if (!OVERFLOW_HIDDEN_PATTERN.test(htmlDocument)) {
    throw new Error("Generated slide must include overflow: hidden on the root slide container.");
  }

  if (PX_PATTERN.test(htmlDocument)) {
    throw new Error("Generated slide uses px units, which are not allowed for slide layout.");
  }
}

export function createSlideDownloadFilename(title: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "slide"}.png`;
}
