type Props = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
};

export default function Button({ children, variant = "primary" }: Props) {
  const base =
    "px-5 py-2 rounded-lg font-semibold transition-all duration-200";

  const styles = {
    primary: "bg-white text-indigo-600 hover:bg-gray-100",
    ghost: "border border-white text-white hover:bg-white/10",
  };

  return <button className={`${base} ${styles[variant]}`}>{children}</button>;
}
