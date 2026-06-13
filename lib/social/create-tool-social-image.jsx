import { ImageResponse } from "next/og";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageContentType = "image/png";

export function createToolSocialImage({ eyebrow, title, detail, accent }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#161616",
          color: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(#525252 1px, transparent 1px), linear-gradient(90deg, #525252 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 620,
            height: 620,
            right: -150,
            top: -250,
            borderRadius: 999,
            background: accent,
            filter: "blur(90px)",
            opacity: 0.28,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "58px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #525252",
                borderRadius: 8,
                fontSize: 15,
              }}
            >
              G
            </div>
            <span style={{ fontSize: 20, fontWeight: 700 }}>Geiger Studios</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
            <span
              style={{
                color: "#a3a3a3",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
            <span
              style={{
                marginTop: 20,
                fontSize: 66,
                fontWeight: 750,
                letterSpacing: "-0.045em",
                lineHeight: 1.04,
              }}
            >
              {title}
            </span>
            <span
              style={{
                marginTop: 24,
                color: "#b8b8b8",
                fontSize: 24,
                lineHeight: 1.45,
              }}
            >
              {detail}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#a3a3a3",
              fontSize: 18,
            }}
          >
            <span>Private browser processing</span>
            <span>geiger.studio/tools</span>
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}

