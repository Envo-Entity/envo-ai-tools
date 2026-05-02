import { Barlow, Barlow_Condensed } from "next/font/google";
import { ClickToScriptLanding } from "@/components/click-to-script-landing";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-click-body",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-click-display",
});

export default function HomePage() {
  return (
    <div className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <ClickToScriptLanding />
    </div>
  );
}
