/**
 * 시안 v6의 꽃 일러스트 SVG 6종.
 * index를 받아서 인덱스에 맞는 일러스트와 그라디언트 배경을 표시.
 */

interface FlowerIllustrationProps {
  index: number;
  className?: string;
}

const GRADIENTS = [
  'linear-gradient(135deg, #E5C5BB 0%, #D9B7A0 50%, #B89882 100%)',
  'linear-gradient(135deg, #E8DFC8 0%, #C9B98A 50%, #8FA68C 100%)',
  'linear-gradient(135deg, #E5EDE3 0%, #C5B8A0 50%, #2D3F2E 100%)',
  'linear-gradient(135deg, #E5C5BB 0%, #C9A0A0 50%, #8B5A6B 100%)',
  'linear-gradient(135deg, #B5C2A8 0%, #8FA68C 50%, #4A5F4A 100%)',
  'linear-gradient(135deg, #E8DFC8 0%, #B5A88E 50%, #6B5F4D 100%)',
];

export function FlowerIllustration({ index, className = '' }: FlowerIllustrationProps) {
  const idx = index % 6;
  const gradient = GRADIENTS[idx] || GRADIENTS[0];

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ backgroundImage: gradient }}
    >
      <svg
        viewBox="0 0 600 800"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id={`hg-${idx}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 인덱스에 따라 다른 일러스트 */}
        {idx === 0 && (
          // 핑크 꽃 (PRADA - 5송이)
          <g opacity="0.9">
            <circle cx="300" cy="280" r="55" fill="#E5C5BB" />
            <circle cx="360" cy="340" r="44" fill="#D9B7A0" />
            <circle cx="240" cy="370" r="48" fill="#F0DFD3" />
            <circle cx="330" cy="430" r="40" fill="#C9A899" />
            <circle cx="270" cy="490" r="46" fill="#E5C5BB" />
            <path d="M300 500 Q280 620 300 760" stroke="#4A5F4A" strokeWidth="3" fill="none" />
            <path d="M300 560 L240 600" stroke="#4A5F4A" strokeWidth="2" fill="none" />
            <path d="M300 620 L350 660" stroke="#4A5F4A" strokeWidth="2" fill="none" />
            <ellipse cx="240" cy="600" rx="20" ry="9" fill="#4A5F4A" opacity="0.7" />
            <ellipse cx="350" cy="660" rx="20" ry="9" fill="#4A5F4A" opacity="0.7" />
            <circle cx="200" cy="320" r="22" fill="#E5C5BB" opacity="0.7" />
            <circle cx="400" cy="290" r="18" fill="#F0DFD3" opacity="0.8" />
          </g>
        )}

        {idx === 1 && (
          // 호텔 - 큰 타원형 + 작은 꽃송이
          <g opacity="0.9">
            <ellipse cx="300" cy="350" rx="160" ry="80" fill="#8FA68C" opacity="0.5" />
            <circle cx="240" cy="320" r="38" fill="#E8DFC8" />
            <circle cx="360" cy="310" r="42" fill="#F1F0EA" />
            <circle cx="300" cy="380" r="46" fill="#E8DFC8" />
            <circle cx="200" cy="380" r="32" fill="#C9B98A" opacity="0.8" />
            <circle cx="400" cy="370" r="36" fill="#E8DFC8" opacity="0.9" />
            <path d="M300 420 Q290 580 300 760" stroke="#4A5F4A" strokeWidth="3" fill="none" />
            <path d="M300 480 L210 540" stroke="#4A5F4A" strokeWidth="2" fill="none" />
            <path d="M300 540 L390 600" stroke="#4A5F4A" strokeWidth="2" fill="none" />
            <ellipse cx="210" cy="540" rx="22" ry="10" fill="#4A5F4A" opacity="0.6" />
            <ellipse cx="390" cy="600" rx="22" ry="10" fill="#4A5F4A" opacity="0.6" />
          </g>
        )}

        {idx === 2 && (
          // 웨딩 - 다크 그린 (영상용)
          <g opacity="0.9">
            <circle cx="280" cy="320" r="60" fill="#E5EDE3" opacity="0.9" />
            <circle cx="350" cy="380" r="50" fill="#C5B8A0" opacity="0.8" />
            <circle cx="230" cy="400" r="44" fill="#E5EDE3" opacity="0.9" />
            <circle cx="320" cy="460" r="42" fill="#A8B59A" opacity="0.8" />
            <path d="M300 500 Q280 660 300 780" stroke="#1A2818" strokeWidth="3" fill="none" />
            <path d="M300 580 L220 640" stroke="#1A2818" strokeWidth="2" fill="none" />
            <ellipse cx="220" cy="640" rx="22" ry="10" fill="#1A2818" opacity="0.7" />
          </g>
        )}

        {idx === 3 && (
          // 파인 다이닝 - 분홍빛 깊은
          <g opacity="0.9">
            <circle cx="280" cy="290" r="50" fill="#E5C5BB" />
            <circle cx="350" cy="350" r="42" fill="#C9A0A0" />
            <circle cx="220" cy="370" r="46" fill="#F0DFD3" />
            <circle cx="310" cy="430" r="38" fill="#8B5A6B" opacity="0.7" />
            <circle cx="260" cy="490" r="44" fill="#E5C5BB" />
            <path d="M290 500 Q275 620 290 760" stroke="#4A2A35" strokeWidth="3" fill="none" />
            <ellipse cx="230" cy="590" rx="20" ry="9" fill="#4A2A35" opacity="0.6" />
            <ellipse cx="340" cy="640" rx="20" ry="9" fill="#4A2A35" opacity="0.6" />
          </g>
        )}

        {idx === 4 && (
          // 세이지 그린 (영상용)
          <g opacity="0.9">
            <ellipse cx="300" cy="350" rx="170" ry="90" fill="#8FA68C" opacity="0.4" />
            <circle cx="250" cy="320" r="40" fill="#B5C2A8" />
            <circle cx="350" cy="310" r="44" fill="#D5DDC9" />
            <circle cx="300" cy="380" r="48" fill="#B5C2A8" />
            <path d="M300 420 Q290 580 300 760" stroke="#2D3F2E" strokeWidth="3" fill="none" />
          </g>
        )}

        {idx === 5 && (
          // Hermès - 따뜻한 베이지/브라운
          <g opacity="0.9">
            <circle cx="290" cy="280" r="52" fill="#E8DFC8" />
            <circle cx="350" cy="340" r="44" fill="#C9B98A" />
            <circle cx="230" cy="360" r="46" fill="#F1F0EA" />
            <circle cx="320" cy="420" r="40" fill="#B5A88E" />
            <circle cx="270" cy="480" r="44" fill="#E8DFC8" />
            <path d="M290 490 Q275 620 290 770" stroke="#6B5F4D" strokeWidth="3" fill="none" />
            <ellipse cx="230" cy="590" rx="22" ry="10" fill="#6B5F4D" opacity="0.7" />
            <ellipse cx="350" cy="650" rx="22" ry="10" fill="#6B5F4D" opacity="0.7" />
          </g>
        )}

        <rect width="600" height="800" fill={`url(#hg-${idx})`} />
      </svg>
    </div>
  );
}
