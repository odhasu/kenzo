export function BackgroundEffects() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Container */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 1, mixBlendMode: "normal", overflow: "hidden" }}
      >
        {/* Base layer: #18181b */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 0, background: "#18181b" }}
        >
          {/* Radial glow */}
          <div
            className="absolute"
            style={{
              top: "-10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "120%",
              height: "80%",
              background:
                "radial-gradient(ellipse at top, rgba(110,110,110,0.09), rgba(38,38,38,0.3) 40%, rgba(0,0,0,1) 74%)",
            }}
          />

          {/* Noise texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='5.6' numOctaves='3' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0.2 0.34 0.52 0.74'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='black' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "28px 28px",
              backgroundRepeat: "repeat",
              opacity: 0.82,
              imageRendering: "crisp-edges" as React.CSSProperties["imageRendering"],
            }}
          />

          {/* Saturation blend layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "rgb(72, 72, 72)",
              mixBlendMode: "saturation",
              opacity: 0.18,
            }}
          />
        </div>

        {/* 7-column grid overlay */}
        <div
          className="absolute inset-0 w-full h-full grid grid-cols-7"
          style={{ zIndex: 1 }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const borderRight =
              i < 3
                ? "1px solid rgba(255,255,255,0.05)"
                : undefined;
            const borderLeft =
              i > 3
                ? "1px solid rgba(255,255,255,0.05)"
                : undefined;
            return (
              <div
                key={i}
                className="relative h-full overflow-hidden"
                style={{ borderRight, borderLeft }}
              >
                {/* Curtain fill */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: i === 0 || i === 6 ? "75%" : i === 1 || i === 5 ? "65%" : i === 2 || i === 4 ? "55%" : "45%",
                    background: "black",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 -20px 60px -10px rgba(0,0,0,0.8)",
                  }}
                />
                {/* 4th column has extra gradient overlay */}
                {i === 3 && (
                  <div
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{
                      top: "20%",
                      height: "30%",
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom fade */}
        <div
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            height: "34%",
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 66%, rgba(0,0,0,0) 100%)",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
