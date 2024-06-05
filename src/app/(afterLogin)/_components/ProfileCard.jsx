// src/app/(afterLogin)/_components/ProfileCard.jsx

export default function ProfileCard({ title, content }) {
  return (
    <div className="profile-card flex flex-col justify-center items-start border border-gray-300 p-4 rounded-lg mb-10 bg-white w-96 h-36 shadow-lg">
      <p className="title m-0 text-xl font-bold">{title}</p>
      <p className="content m-0 text-2xl font-bold mt-2">{content}</p>
    </div>
  );
}

  