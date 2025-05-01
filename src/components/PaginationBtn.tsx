interface BtnProps {
  onClick: () => void;
  children:React.ReactNode;
  disabled?:boolean;
}

export default function PaginationBtn({onClick, children, disabled}: BtnProps) {
  return (
    <button onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-black hover:bg-blue-600 text-white rounded-sm shadow-lg transition-colors duration-300 
    ${disabled ? "cursor-not-allowed bg-gray-300" : " "}`}>
      {children}
    </button>
  );
}