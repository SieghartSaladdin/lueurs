export default function TopBar() {
  return (
    <div className="bg-black text-white text-center py-2 text-xs font-medium border-b border-gray-800 hidden md:block tracking-widest uppercase">
      <span className="cursor-pointer hover:text-gray-300 mx-3">Store Locator</span>
      <span className="mx-1 text-gray-600">|</span>
      <span className="cursor-pointer hover:text-gray-300 mx-3">Concierge</span>
      <span className="mx-1 text-gray-600">|</span>
      <span className="cursor-pointer hover:text-gray-300 mx-3">Account</span>
    </div>
  );
}
