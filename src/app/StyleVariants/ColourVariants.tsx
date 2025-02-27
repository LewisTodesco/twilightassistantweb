interface colourVariants {
  [key: string]: string;
}

const outlineColourVariants: colourVariants = {
  red: "outline-red-500",
  green: "outline-green-500",
  orange: "outline-orange-500",
  blue: "outline-blue-500",
  purple: "outline-purple-500",
  pink: "outline-pink-500",
  yellow: "outline-yellow-500",
  gray: "outline-gray-500",
  brown: "outline-amber-900",
};

const backgroundColourVariants: colourVariants = {
  red: "bg-red-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  gray: "bg-gray-500",
  brown: "bg-amber-900",
};

export default colourVariants;
export { outlineColourVariants, backgroundColourVariants };
