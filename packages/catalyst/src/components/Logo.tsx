import clsx from "clsx";

type Props = {
  className?: string;
};

export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 443.41"
      className={clsx("w-16", className)}
    >
      <polygon
        className="fill-red-600"
        points="384 0 128 0 0 221.7 128 443.4 384 443.4 512 221.7 384 0"
      />
      <path
        className="fill-gray-100"
        d="M382,108.39l-12.7-12.71A153.7,153.7,0,0,0,220.87,55.91l-17.35,4.65A153.67,153.67,0,0,0,94.86,169.23l-4.65,17.35A153.68,153.68,0,0,0,130,335l12.7,12.7a153.7,153.7,0,0,0,148.45,39.77l17.35-4.64A153.68,153.68,0,0,0,417.14,274.18l4.65-17.35A153.68,153.68,0,0,0,382,108.39Z"
      />
      <polygon
        className="fill-red-600"
        points="342.96 271.91 342.96 171.5 256 121.29 169.04 171.5 169.04 271.91 256 322.11 342.96 271.91"
      />
    </svg>
  );
};
