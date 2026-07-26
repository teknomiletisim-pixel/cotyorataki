import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbbf24",
          fontFamily: "Georgia, serif",
        }}
      >
        <span
          style={{
            fontSize: 92,
            fontWeight: 700,
            color: "#000000",
            letterSpacing: "-0.02em",
          }}
        >
          CT
        </span>
      </div>
    ),
    { ...size }
  );
}
