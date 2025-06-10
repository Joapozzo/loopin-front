interface MenuItemsProps {
    item: object | any;
    isActive: boolean;
    onClick: (id: string) => void;
    isExpanded: boolean;
}

const MenuItem = ({ item, isActive, onClick, isExpanded }: MenuItemsProps) => {
    return (
        <>
            <button
                onClick={() => onClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-white text-[var(--violet)] shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
            >
                <span className={`transition-all duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"
                    }`}>
                    {item.icon}
                </span>

                {isExpanded && (
                    <>
                        <div className="flex-1 text-left">
                            <div className="font-medium">{item.label}</div>
                            {item.description && (
                                <div className={`text-xs ${isActive ? 'text-[var(--violet)]/70' : 'text-white/60'
                                    }`}>
                                    {item.description}
                                </div>
                            )}
                        </div>

                        {item.badge && (
                            <div className={`px-2 py-1 text-xs font-bold rounded-full text-white ${item.badgeColor || 'bg-[var(--violet)]'
                                }`}>
                                {item.badge}
                            </div>
                        )}
                    </>
                )}
            </button>
        </>
    )
}

export default MenuItem;