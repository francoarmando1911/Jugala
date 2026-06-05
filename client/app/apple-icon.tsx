import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0a0f0d",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 800,
            fontStyle: "italic",
            fontFamily: "Arial",
            color: "#a3e635",
            lineHeight: 1,
            marginTop: -8,
          }}
        >
          J
        </span>
      </div>
    ),
    { ...size }
  );
}
