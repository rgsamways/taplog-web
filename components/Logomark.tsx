export default function Logomark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <path d="M12,62 C12,18.8 84,18.8 84,62" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeOpacity="0.20" strokeLinecap="round"/>
      <path d="M22,62 C22,27.2 74,27.2 74,62" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeOpacity="0.45" strokeLinecap="round"/>
      <path d="M32,62 C32,35.8 64,35.8 64,62" fill="none" stroke="#1D9E75" strokeWidth="3.5" strokeOpacity="1.00" strokeLinecap="round"/>
      <rect x="36" y="52" width="24" height="32" rx="5" ry="5" fill="#1D9E75"/>
      <rect x="39" y="55" width="18" height="14" rx="2.5" ry="2.5" fill="#0F6E56"/>
      <rect x="41" y="58" width="10" height="1.5" rx="0.75" fill="#5DCAA5" opacity="1.00"/>
      <rect x="41" y="61.5" width="7" height="1.5" rx="0.75" fill="#5DCAA5" opacity="0.60"/>
      <rect x="41" y="65" width="9" height="1.5" rx="0.75" fill="#5DCAA5" opacity="0.35"/>
      <rect x="44" y="78" width="8" height="2" rx="1" fill="#0F6E56"/>
      <circle cx="48" cy="38" r="4" fill="#5DCAA5"/>
    </svg>
  )
}
