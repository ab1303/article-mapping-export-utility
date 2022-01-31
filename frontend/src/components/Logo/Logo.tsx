import React from 'react';

type Props = {
  inverted: boolean;
};

const Logo: React.FC<Props & React.SVGProps<SVGSVGElement>> = ({
  inverted,
  ...props
}) => (
  <svg
    height="32"
    viewBox="0 0 998 257"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="257" height="257" rx="128.5" fill="url(#paint0_linear)" />
    <path
      d="M69.558 133.985l87.592-86.9891c1.636-1.6251 4.27.3525 3.165 2.377l-32.601 59.7521c-.728 1.332.237 2.958 1.755 2.958h56.34c1.815 0 2.691 2.223 1.364 3.462l-98.7278 92.142c-1.7702 1.652-4.4051-.676-2.9839-2.636l46.7357-64.473c.958-1.322.014-3.174-1.619-3.174H70.9673c-1.7851 0-2.6759-2.161-1.4093-3.419z"
      fill="#fff"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="128.5"
        x2="128.5"
        y2="257"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7BCBD4" />
        <stop offset="1" stopColor="#29C6B7" />
      </linearGradient>
    </defs>
  </svg>
);

export default Logo;
