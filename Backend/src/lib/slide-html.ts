const PX_PATTERN = /\b\d+(\.\d+)?px\b/i;
const ROOT_TAG_PATTERN = /<([a-z0-9-]+)([^>]*\sdata-slide-root=["']true["'][^>]*)>/i;
const ROOT_CLASS_OVERFLOW_PATTERN = /\boverflow-hidden\b/i;
const ROOT_STYLE_OVERFLOW_PATTERN = /overflow\s*:\s*hidden/i;
const ROOT_DATA_ATTR_PATTERN = /\sdata-slide-root=["']true["']/i;
const BODY_TAG_PATTERN = /<body([^>]*)>/i;
const NORMALIZATION_STYLE_MARKER = "data-slide-preview-normalize";
const NORMALIZATION_STYLE_BLOCK = `<style ${NORMALIZATION_STYLE_MARKER}>
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  background: transparent !important;
}
body {
  display: block !important;
}
[data-slide-root="true"] {
  margin: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  overflow: hidden !important;
}
</style>`;

function stripMarkdownFences(htmlDocument: string) {
  return htmlDocument
    .trim()
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function ensureHtmlShell(htmlDocument: string) {
  if (/<html[\s>]/i.test(htmlDocument)) {
    return htmlDocument;
  }

  return [
    "<!DOCTYPE html>",
    "<html>",
    "<head></head>",
    "<body>",
    htmlDocument,
    "</body>",
    "</html>",
  ].join("");
}

function ensureRootMarker(htmlDocument: string) {
  if (ROOT_DATA_ATTR_PATTERN.test(htmlDocument)) {
    return htmlDocument;
  }

  if (BODY_TAG_PATTERN.test(htmlDocument)) {
    return htmlDocument.replace(BODY_TAG_PATTERN, (_match, attributes) => `<body${attributes} data-slide-root="true">`);
  }

  return htmlDocument.replace(/<html([^>]*)>/i, `<html$1><body data-slide-root="true">`);
}

function ensureRootOverflow(htmlDocument: string) {
  const rootMatch = ROOT_TAG_PATTERN.exec(htmlDocument);

  if (!rootMatch) {
    return htmlDocument;
  }

  const [fullMatch, tagName, attributes] = rootMatch;
  const hasOverflowHidden =
    ROOT_STYLE_OVERFLOW_PATTERN.test(attributes) || ROOT_CLASS_OVERFLOW_PATTERN.test(attributes);

  if (hasOverflowHidden) {
    return htmlDocument;
  }

  let nextAttributes = attributes;

  if (/style=["']/i.test(nextAttributes)) {
    nextAttributes = nextAttributes.replace(/style=(["'])(.*?)\1/i, (_match, quote: string, value: string) => {
      const trimmedValue = value.trim();
      const suffix = trimmedValue.endsWith(";") || trimmedValue.length === 0 ? "" : ";";
      return `style=${quote}${trimmedValue}${suffix} overflow:hidden;${quote}`;
    });
  } else if (/class=["']/i.test(nextAttributes)) {
    nextAttributes = nextAttributes.replace(/class=(["'])(.*?)\1/i, (_match, quote: string, value: string) => {
      const normalizedValue = value.trim();
      return `class=${quote}${normalizedValue ? `${normalizedValue} ` : ""}overflow-hidden${quote}`;
    });
  } else {
    nextAttributes = `${nextAttributes} style="overflow:hidden;"`;
  }

  return htmlDocument.replace(fullMatch, `<${tagName}${nextAttributes}>`);
}

function injectNormalizationStyles(htmlDocument: string) {
  if (htmlDocument.includes(NORMALIZATION_STYLE_MARKER)) {
    return htmlDocument;
  }

  if (/<\/head>/i.test(htmlDocument)) {
    return htmlDocument.replace(/<\/head>/i, `${NORMALIZATION_STYLE_BLOCK}</head>`);
  }

  if (/<head[^>]*>/i.test(htmlDocument)) {
    return htmlDocument.replace(/<head[^>]*>/i, (match) => `${match}${NORMALIZATION_STYLE_BLOCK}`);
  }

  return htmlDocument.replace(/<html([^>]*)>/i, `<html$1><head>${NORMALIZATION_STYLE_BLOCK}</head>`);
}

export function normalizeSlideHtmlDocument(htmlDocument: string) {
  let normalized = stripMarkdownFences(htmlDocument);
  normalized = ensureHtmlShell(normalized);
  normalized = ensureRootMarker(normalized);
  normalized = ensureRootOverflow(normalized);
  normalized = injectNormalizationStyles(normalized);
  return normalized;
}

export function validateSlideHtmlDocument(htmlDocument: string) {
  const normalized = normalizeSlideHtmlDocument(htmlDocument);

  if (!normalized.trim()) {
    throw new Error("Generated HTML was empty.");
  }

  if (!/<html[\s>]/i.test(normalized)) {
    throw new Error("Generated slide must be a full HTML document.");
  }

  if (!ROOT_DATA_ATTR_PATTERN.test(normalized)) {
    throw new Error('Generated slide must include a root node with data-slide-root="true".');
  }

  const rootMatch = ROOT_TAG_PATTERN.exec(normalized);
  const rootAttributes = rootMatch?.[2] ?? "";
  const rootHasOverflowHidden =
    ROOT_STYLE_OVERFLOW_PATTERN.test(rootAttributes) || ROOT_CLASS_OVERFLOW_PATTERN.test(rootAttributes);

  if (!rootHasOverflowHidden) {
    throw new Error("Generated slide must include overflow: hidden on the root slide container.");
  }

  if (PX_PATTERN.test(normalized)) {
    throw new Error("Generated slide uses px units, which are not allowed for slide layout.");
  }

  return normalized;
}

export function createSlideDownloadFilename(title: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "slide"}.png`;
}
