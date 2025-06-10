interface ButtonFilterCategoryProps {
    icon: string;
}

export default function ButtonFilterCategory({  icon }: ButtonFilterCategoryProps) {
    return (
      <button className="text-2xl py-2 px-5 bg-[var(--violet-50)] rounded-lg flex items-center justify-center cursor-pointer hover:text-4xl transition-all duration-300 ease-in-out">
        {icon}
      </button>
    );
}