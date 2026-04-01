import { chromium, type Browser } from "playwright";

const aspectRatioViewportMap: Record<string, { width: number; height: number }> = {
  "16:9": { width: 1600, height: 900 },
  "9:16": { width: 900, height: 1600 },
  "1:1": { width: 1200, height: 1200 },
  "4:5": { width: 1200, height: 1500 },
  "3:4": { width: 1200, height: 1600 },
  "4:3": { width: 1600, height: 1200 },
};

let browserPromise: Promise<Browser> | null = null;

function getViewport(aspectRatio: string) {
  return aspectRatioViewportMap[aspectRatio] ?? aspectRatioViewportMap["4:5"];
}

async function getBrowser() {
  browserPromise ??= chromium.launch({
    headless: true,
  });

  return browserPromise;
}

export async function renderSlideToPng(input: { htmlDocument: string; aspectRatio: string }) {
  const browser = await getBrowser();
  const viewport = getViewport(input.aspectRatio);
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
  });

  try {
    await page.setContent(input.htmlDocument, {
      waitUntil: "networkidle",
    });
    const root = page.locator('[data-slide-root="true"]');
    await root.waitFor();
    return await root.screenshot({
      type: "png",
    });
  } finally {
    await page.close();
  }
}
