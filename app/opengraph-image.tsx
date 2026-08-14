import { ImageResponse } from "next/og";

export const alt = "Edward McCann Architecture";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The dark share card from the applications board: wordmark, the sectors line,
 * and the two-city dateline. Drawn rather than photographed so it stays legible
 * at preview scale.
 */
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#161412",
          color: "#F5F2ED",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontSize: 30, letterSpacing: 8, fontWeight: 500 }}>
            EDWARD McCANN
          </span>
          <span style={{ fontSize: 20, letterSpacing: 10, color: "#A39B8D" }}>
            ARCHITECTURE
          </span>
        </div>

        <div style={{ display: "flex", fontSize: 52, lineHeight: 1.3, maxWidth: 780 }}>
          Houses, places to eat and drink, objects and public work.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#A39B8D" }}>
          <span>LONDON E8 — CAPE TOWN</span>
          <span>EDWARDMCCANN.STUDIO</span>
        </div>
      </div>
    ),
    size,
  );
}
