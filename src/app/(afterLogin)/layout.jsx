import SideBar from "./_components/SideBar";
import HeaderContainer from "./_components/HeaderContainer";

export default function MainLayout({ children }) {
  // const { data: me } = useSession(); // 사용자 정보 불러오기
  return (
    <div className="flex flex-row w-full h-full overflow-x-hidden">
      <HeaderContainer children={children} />
      <SideBar />
      {/*<div>내 정보는 {me && me.user.result}</div>*/}
    </div>
  );
}
