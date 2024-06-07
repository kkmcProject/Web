import SideBar from "./_components/SideBar";
import HeaderContainer from "./_components/HeaderContainer";
export default async function MainLayout({ children }) {

  return (
      <div className="flex flex-row w-full h-full">
        <HeaderContainer children={children} />
        <SideBar />
      </div>
  );
}
