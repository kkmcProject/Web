'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import ProfileCard from '../_components/ProfileCard';

export default function ChangeInfoPage() {
  const { data: me, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (userId) => {
      console.log("Fetching role and data for user ID:", userId);  // 디버깅용 로그
      try {
        const response = await fetch('/api/getRole', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: userId }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Fetched data:", data);  // 디버깅용 로그
          setRole(data.role);
          setUserData(data);
        } else {
          console.error('Error fetching data:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      const userId = me?.user?.result;
      console.log("User ID:", userId);  // 디버깅용 로그
      if (userId) {
        fetchUserData(userId);
      } else {
        console.error("User ID is not available in session");
        setLoading(false);
      }
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, me]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (role === 'admin') {
    return <AdminPage />;
  } else if (role === 'user' || role === 'manager') {
    return <UserPage userData={userData} />;
  } else {
    return <div>No role assigned</div>;
  }
}

// function AdminPage() {
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [teams, setTeams] = useState([]);
//   const [members, setMembers] = useState({});

//   const handleTeamClick = (team) => {
//     if (!members[team]) {
//       const defaultMembers = { 인원수: '', 특화작물: '', 기계수: '' };
//       setMembers({ ...members, [team]: defaultMembers });
//     }
//     setSelectedTeam(team);
//   };

//   const handleAddTeam = () => {
//     const newTeamName = `새 작업반 ${teams.length + 1}`;
//     setTeams([...teams, newTeamName]);
//     handleTeamClick(newTeamName);
//   };

//   const handleDeleteTeam = (team) => {
//     setTeams(teams.filter(t => t !== team));
//     const newMembers = { ...members };
//     delete newMembers[team];
//     setMembers(newMembers);
//     if (selectedTeam === team) {
//       setSelectedTeam(null);
//     }
//   };

//   const handleTeamNameChange = (index, value) => {
//     const newTeams = teams.slice();
//     const oldTeamName = newTeams[index];
//     newTeams[index] = value;
//     const newMembers = { ...members };
//     newMembers[value] = newMembers[oldTeamName];
//     delete newMembers[oldTeamName];
//     setTeams(newTeams);
//     setMembers(newMembers);
//     if (selectedTeam === oldTeamName) {
//       setSelectedTeam(value);
//     }
//   };

//   const handleMemberChange = (team, key, value) => {
//     const newMembers = { ...members };
//     newMembers[team][key] = value;
//     setMembers(newMembers);
//   };

//   const handleSave = () => {
//     console.log('Saved:', { teams, members });
//   };

//   return (
//     <div className="container flex flex-row p-8 min-h-screen">
//       <div className="sidebar flex-1 min-w-[300px] max-w-[500px] p-10">
//         <h1 className="text-2xl font-bold mb-4">작업반 관리</h1>
//         {teams.map((team, index) => (
//           <div key={index} className="mb-4">
//             <input
//               type="text"
//               value={team}
//               onChange={(e) => handleTeamNameChange(index, e.target.value)}
//               onClick={() => handleTeamClick(team)}
//               className="w-full p-2 border border-gray-300 rounded mb-2"
//               placeholder="작업반 이름 수정"
//             />
//             <button
//               type="button"
//               onClick={() => handleDeleteTeam(team)}
//               className="bg-red-500 text-white p-2 rounded"
//             >
//               삭제
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={handleAddTeam}
//           className="bg-blue-500 text-white p-2 rounded mt-4"
//         >
//           + 작업반 추가
//         </button>
//       </div>
//       {selectedTeam && (
//         <div className="details flex-2 p-10">
//           <h1 className="text-2xl font-bold mb-4">{selectedTeam}</h1>
//           {Object.keys(members[selectedTeam]).map((key) => (
//             <div key={key} className="mb-4">
//               <label className="block mb-2">{key}</label>
//               <input
//                 type="text"
//                 value={members[selectedTeam][key]}
//                 onChange={(e) => handleMemberChange(selectedTeam, key, e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded"
//                 placeholder={`${key} 수정`}
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={handleSave}
//             className="bg-green-500 text-white p-2 rounded mt-4"
//           >
//             저장
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
//마스터 관리
function AdminPage() {
  const [selectedTeam, setSelectedTeam] = useState(null);
    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState({});
  
    const handleTeamClick = (team) => {
      if (!members[team]) {
        const defaultMembers = { 인원수: '', 특화작물: '', 기계수: '' };
        setMembers({ ...members, [team]: defaultMembers });
      }
      setSelectedTeam(team);
    };
  
    const handleAddTeam = () => {
      const newTeamName = `새 작업반 ${teams.length + 1}`;
      setTeams([...teams, newTeamName]);
      handleTeamClick(newTeamName);
    };
  
    const handleDeleteTeam = (team) => {
      setTeams(teams.filter(t => t !== team));
      const newMembers = { ...members };
      delete newMembers[team];
      setMembers(newMembers);
      if (selectedTeam === team) {
        setSelectedTeam(null);
      }
    };
  
    const handleTeamNameChange = (index, value) => {
      const newTeams = teams.slice();
      const oldTeamName = newTeams[index];
      newTeams[index] = value;
      const newMembers = { ...members };
      newMembers[value] = newMembers[oldTeamName];
      delete newMembers[oldTeamName];
      setTeams(newTeams);
      setMembers(newMembers);
      if (selectedTeam === oldTeamName) {
        setSelectedTeam(value);
      }
    };
  
    const handleMemberChange = (team, key, value) => {
      const newMembers = { ...members };
      newMembers[team][key] = value;
      setMembers(newMembers);
    };
  
    const handleSave = () => {
      console.log('Saved:', { teams, members });
    };
  
    return (
      <div className="container flex flex-auto  justify-start items-stretch  p-16 min-h-screen">
        <div className="sidebar flex-1 min-w-[300px] max-w-[500px] p-8">
          <h1 className="text-2xl font-bold mt-24 mb-4">작업반 관리</h1>
          {teams.map((team, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                value={team}
                onChange={(e) => handleTeamNameChange(index, e.target.value)}
                onClick={() => handleTeamClick(team)}
                className="w-full p-2 border border-gray-300 rounded mt-2 mb-2"
                placeholder="작업반 이름 수정"
              />
              <button
                type="button"
                onClick={() => handleDeleteTeam(team)}
                className="bg-red-500 text-white p-2 rounded"
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTeam}
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            + 작업반 추가
          </button>
        </div>
        {selectedTeam && (
          <div className="details flex-2 p-16">
            <h1 className="text-2xl font-bold mt-16 mb-4">{selectedTeam}</h1>
            {Object.keys(members[selectedTeam]).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2">{key}</label>
                <input
                  type="text"
                  value={members[selectedTeam][key]}
                  onChange={(e) => handleMemberChange(selectedTeam, key, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={`${key} 수정`}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              저장
            </button>
          </div>
        )}
      </div>
    );
    }



function UserPage({ userData }) {
  const [userDetails, setUserDetails] = useState(userData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/getRole', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div className="w-full flex flex-row justify-start p-8 tablet:mt-36 zero-to-tablet:mt-8">
      <div className="p-10 zero-to-tablet:hidden">
        <h1 className="text-2xl font-bold mb-4">직원 profile</h1>
        <ProfileCard title="이름" content={userDetails.name} />
        <ProfileCard title="직급" content={userDetails.position} />
        <ProfileCard title="작업반" content={userDetails.class} />
      </div>
      <div className="w-full flex p-10 justify-center min-w-96">
        <div className='w-2/3'>
          <h1 className="text-2xl font-bold whitespace-nowrap">직원 프로필 수정</h1>
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <label className="mt-9 text-1xl">이름</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="@이름"
          />
          <label className="mt-9">직급</label>
          <input
            type="text"
            name="position"
            value={userDetails.position}
            onChange={handleInputChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="@직급"
          />
          <label className="mt-9">ID</label>
          <input
            type="text"
            name="id"
            value={userDetails.id}
            readOnly
            className="w-full p-2 mt-2 border border-gray-300 rounded"
          />
          <label className="mt-9">소속 작업반</label>
          <input
            type="text"
            name="class"
            value={userDetails.class}
            onChange={handleInputChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="작업반 이름"
          />
         
          <button type="submit" className="mt-9 p-2 bg-blue-500 text-white rounded cursor-pointer">
            변경 사항 저장
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}
