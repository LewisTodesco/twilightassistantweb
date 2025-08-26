interface styleVariants {
  [key: string]: string;
}

const outlineColourVariants: styleVariants = {
  red: "outline-red-500",
  green: "outline-green-500",
  orange: "outline-orange-500",
  blue: "outline-blue-500",
  purple: "outline-purple-500",
  pink: "outline-pink-500",
  yellow: "outline-yellow-500",
  gray: "outline-gray-500",
  brown: "outline-amber-900",
  default: "",
};

const backgroundColourVariants: styleVariants = {
  red: "bg-red-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  gray: "bg-gray-500",
  brown: "bg-amber-900",
  default: "",
};

const blurVariants: styleVariants = {
  none: "blur-none",
  small: "blur-sm",
  large: "blur-lg",
};

const gridVariants: styleVariants = {
  3: "grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 w-full gap-6 z-1",
  4: "grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 w-full gap-6 z-1",
  5: "grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 w-full gap-6 z-1",
  6: "grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 w-full gap-6 z-1",
  7: "grid xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 w-full gap-6 z-1",
  8: "grid xl:grid-cols-8 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 w-full gap-6 z-1",
};

export default styleVariants;
export {
  outlineColourVariants,
  backgroundColourVariants,
  blurVariants,
  gridVariants,
};
