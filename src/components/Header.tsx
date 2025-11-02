import React from "react"

type Props = {
    useAI: boolean
    onToggle: () => void
}
const Header: React.FC<Props> = ({}) => (
  <div className="w-full gap-10 text-center flex items-center justify-center">
    <div className="flex-1 h-px bg-gray-200"></div>
    <h2 className="text-[10px] text-[rgba(0,0,0,0.5)] tracking-[20px]">
      答案之书
    </h2>
    <div className="flex-1 h-px bg-gray-200"></div>
  </div>
);

export default Header;

