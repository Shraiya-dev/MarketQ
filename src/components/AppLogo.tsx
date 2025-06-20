
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center group" aria-label="Axcess.io Home">
      <svg
        viewBox="0 0 800 266" // Aspect ratio from the provided logo image
        xmlns="http://www.w3.org/2000/svg"
        className="text-sidebar-foreground group-hover:text-accent transition-colors h-10 w-auto" // Updated to h-10 (40px)
      >
        <g transform="translate(5, -17) scale(12.5)">
          {/*
            Original path: M2 4 L14 12 L2 20 L7 20 L14 15 L22 12 L14 9 L7 4 Z
            This path has a visual bounding box from (2,4) to (22,20) (width 20, height 16).
            Scale factor 12.5 makes it 250 wide (20*12.5) and 200 high (16*12.5).
            transform="translate(5, -17)" aims to position this scaled X mark:
            - Top-left visual point (2,4) becomes:
              x: (2 * 12.5) + 5 = 25 + 5 = 30
              y: (4 * 12.5) - 17 = 50 - 17 = 33
            - Bottom-right visual point (22,20) becomes:
              x: (22 * 12.5) + 5 = 275 + 5 = 280
              y: (20 * 12.5) - 17 = 250 - 17 = 233
            So the X mark occupies SVG coords (30,33) to (280,233).
            This centers the 200-unit high X mark within the 266-unit viewBox height ((266-200)/2 = 33).
          */}
          <path d="M2 4 L14 12 L2 20 L7 20 L14 15 L22 12 L14 9 L7 4 Z" fill="currentColor"/>
        </g>
        <text
          x="310" // Positioned to the right of the X mark (which ends at x=280)
          y="170" // Baseline of the text, chosen to visually center text with the X mark.
                  // X mark center is y = (33+233)/2 = 133.
          fontFamily="Outfit, sans-serif"
          fontSize="110" // Font size in SVG coordinate units
          fontWeight="500" // Medium weight, similar to Outfit-Medium
          fill="currentColor"
          letterSpacing="0.5"
        >
          axcess.io
        </text>
      </svg>
    </Link>
  );
}
