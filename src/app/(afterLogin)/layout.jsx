// import SideBar from "./_components/SideBar";
// import HeaderContainer from "./_components/HeaderContainer";

// export default function MainLayout({ children }) {
//   // const { data: me } = useSession(); // 사용자 정보 불러오기
//   return (
//     <div className="flex flex-row w-full h-full">
//       <HeaderContainer children={children} />
//       <SideBar />
//       {/*<div>내 정보는 {me && me.user.result}</div>*/}
//     </div>
//   );
// }

import SideBar from "./_components/SideBar";
import HeaderContainer from "./_components/HeaderContainer";
<<<<<<< HEAD
export default async function MainLayout({ children }) {

=======
import { auth } from "@/auth";
export default async function MainLayout({ children }) {
  const asdf = await auth();
  console.log('유저정보는', asdf.user.result);
>>>>>>> origin/hsb_4
  return (
    <div className="flex flex-row w-full h-full">
      <HeaderContainer children={children} />
      <SideBar />
    </div>
  );
}
