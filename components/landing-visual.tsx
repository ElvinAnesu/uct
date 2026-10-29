const lines = [
  { label: "Afrikaans", term: "Massabalans" },
  { label: "IsiXhosa", term: "Ubunzima obulungeleleneyo" },
  { label: "Sesotho", term: "Tekanyo ya boima" },
  { label: "Sesotho SA", term: "Tekanyo ya boima" },
  { label: "Swahili", term: "Usawa wa uzito" },
];

export function LandingVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[460px]" aria-hidden="true">
      <svg viewBox="0 0 480 420" className="h-auto w-full">
        <ellipse cx="240" cy="214" rx="188" ry="150" fill="#e6edf5" />
        <g style={{ animation: "am-float 5.5s ease-in-out infinite" }}>
          <path
            d="M78 286 V168 H118 V132 H168 V168 H214"
            fill="none"
            stroke="#10233f"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeDasharray="280"
            style={{ animation: "am-draw 2.8s ease forwards" }}
          />
          <circle cx="214" cy="168" r="5" fill="#10233f" />
          <rect x="148" y="86" width="250" height="248" rx="22" fill="#fffdf9" stroke="#d9d0c4" />
          <rect x="148" y="86" width="250" height="54" rx="22" fill="#10233f" />
          <rect x="148" y="118" width="250" height="22" fill="#10233f" />
          <text x="172" y="120" fill="#fffdf9" fontSize="15" fontFamily="system-ui, sans-serif" fontWeight="650">
            Mass balance
          </text>
          <text x="172" y="176" fill="#8a8176" fontSize="12" fontFamily="system-ui, sans-serif">
            English
          </text>
          <text x="172" y="202" fill="#1c1915" fontSize="18" fontFamily="system-ui, sans-serif" fontWeight="650">
            Mass balance
          </text>
          <line x1="172" y1="224" x2="366" y2="224" stroke="#efeae2" />
          {lines.map((line, index) => (
            <g
              key={line.label}
              style={{ animation: `am-cycle 14s ${index * 2.8}s infinite`, opacity: index === 0 ? 1 : 0 }}
            >
              <text x="172" y="258" fill="#8a8176" fontSize="12" fontFamily="system-ui, sans-serif">
                {line.label}
              </text>
              <text x="172" y="286" fill="#10233f" fontSize="15" fontFamily="system-ui, sans-serif" fontWeight="600">
                {line.term}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
