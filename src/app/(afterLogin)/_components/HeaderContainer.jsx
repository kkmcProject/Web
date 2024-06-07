import Headnav from "./Headnav";

export default function Container({ children }) {
  return (
    <div className="w-full">
      <header className="h-fit flex tablet:flex-col fixed w-full bg-white tablet:px-10 zero-to-tablet:px-5">
        <Headnav />
      </header>
      {children}
    </div>
  );
}
