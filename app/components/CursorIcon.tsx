export const CursorIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
    >
      {/* Diamond top-right */}
      <rect
        fill="white"
        x="22.6"
        y="1.6"
        width="4.9"
        height="4.9"
        transform="rotate(-44.1 25.1 4.05)"
      />

      {/* Chain / zigzag polygon */}
      <polygon
        fill="white"
        points="31.5 28.4 28 31.8 24.6 28.3 21.2 24.8 17.8 21.2 14.4 17.7 11.1 14.2 7.6 10.6 4.1 14 .8 10.5 4.3 7.1 .9 3.6 4.4 .2 7.8 3.7 11.3 .4 14.7 3.9 11.2 7.2 14.6 10.8 18 14.3 21.3 17.8 24.7 21.4 28.1 24.9 31.5 28.4"
      />

      {/* Diamond middle-left */}
      <rect
        fill="white"
        x="1.6"
        y="15"
        width="4.9"
        height="4.9"
        transform="rotate(-44.1 4.05 17.45)"
      />

      {/* Diamond bottom-left */}
      <rect
        fill="white"
        x="1.5"
        y="22"
        width="4.9"
        height="4.9"
        transform="rotate(-43.8 3.95 24.45)"
      />

      {/* Diamond top-center */}
      <rect
        fill="white"
        x="15.7"
        y="1.5"
        width="4.9"
        height="4.9"
        transform="rotate(-43.8 18.15 3.95)"
      />
    </svg>
);
