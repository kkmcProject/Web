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
//   return <div>Admin Page: You have admin access.</div>;
// }

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
    <div className="container flex flex-row justify-start items-start p-8 min-h-screen">
      <div className="profile-section flex-1 min-w-[300px] max-w-[500px] p-10 mt-36">
        <h1 className="section-title text-2xl font-bold mb-4">직원 profile</h1>
        <ProfileCard title="이름" content={userDetails.name} />
        <ProfileCard title="직급" content={userDetails.position} />
        <ProfileCard title="작업반" content={userDetails.class} />
      </div>
      <div className="profile-container flex-1 min-w-[300px] max-w-[500px] p-10 mt-36">
        <h1 className="section-title text-2xl font-bold mb-0">직원 프로필 수정</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <label className="mt-9 text-1xl">이름</label>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="@username123"
          />
          <label className="mt-9">직급</label>
          <input
            type="text"
            name="position"
            value={userDetails.position}
            onChange={handleInputChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            placeholder="@username123"
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
  );
}



// 'use client';
// import { useSession } from 'next-auth/react';
// import { useState, useEffect } from 'react';
// import ProfileCard from '../_components/ProfileCard';


// export default function ChangeInfoPage() {
//   const { data: me, status } = useSession();
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserRole = async (userId) => {
//       console.log("Fetching role for user ID:", userId);  // 디버깅용 로그
//       try {
//         const response = await fetch('/api/getRole', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ id: userId }),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           console.log("Fetched role:", data.role);  // 디버깅용 로그
//           setRole(data.role);
//         } else {
//           console.error('Error fetching role:', data.message);
//         }
//       } catch (error) {
//         console.error('Failed to fetch user role:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (status === 'authenticated') {
//       const userId = me?.user?.result;
//       console.log("User ID:", userId);  // 디버깅용 로그
//       if (userId) {
//         fetchUserRole(userId);
//       } else {
//         console.error("User ID is not available in session");
//         setLoading(false);
//       }
//     } else if (status !== 'loading') {
//       setLoading(false);
//     }
//   }, [status, me]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (role === 'admin') {
//     return <AdminPage />;
//   } else if (role === 'user' || role === 'manager') {
//     return <UserPage userId={me?.user?.result} />;
//   } else {
//     return <div>No role assigned</div>;
//   }
// }

// // function AdminPage() {
// //   return <div>Admin Page: You have admin access.</div>;
// // }

// // function UserPage({ userId }) {
// //   return <div className='w-96 h-96 bg-red-600'>User Page for user ID: {userId}</div>;
// // }


// // // 직원 프로필 수정 페이지 컴포넌트
// function UserPage({ userId }) {
//   const [userData, setUserData] = useState({
//     name: '',
//     position: '',
//     email: '',
//     team: [''],
//     bio: ''
//   });

//   useEffect(() => {
//     async function fetchUserData() {
//       const response = await fetch(`/api/user?id=${userId}`);
//       const data = await response.json();
//       setUserData(data);
//     }
//     fetchUserData();
//   }, [userId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData({ ...userData, [name]: value });
//   };

//   const handleTeamChange = (index, value) => {
//     const newTeam = [...userData.team];
//     newTeam[index] = value;
//     setUserData({ ...userData, team: newTeam });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const response = await fetch(`/api/user?id=${userId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(userData)
//     });
//     const result = await response.json();
//     console.log(result);
//   };

//   return (
//     <div className="container mt-40">
//       <div className="profile-section">
//         <h1 className="section-title">직원 profile</h1>
//         <ProfileCard title="이름" content={userData.name} />
//         <ProfileCard title="직급" content={userData.position} />
//         <ProfileCard title="작업반" content={userData.team.join(', ')} />
//       </div>
//       <div className="profile-container">
//         <h1 className="section-title">직원 프로필 수정</h1>
//         <form onSubmit={handleSubmit}>
//           <label>이름</label>
//           <input
//             type="text"
//             name="name"
//             value={userData.name}
//             onChange={handleInputChange}
//             placeholder="@username123"
//           />
//           <label>직급</label>
//           <input
//             type="text"
//             name="position"
//             value={userData.position}
//             onChange={handleInputChange}
//             placeholder="@username123"
//           />
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={userData.email}
//             onChange={handleInputChange}
//             placeholder="email@domain.com"
//           />
//           <label>소속 작업반</label>
//           {userData.team.map((teamMember, index) => (
//             <input
//               key={index}
//               type="text"
//               value={teamMember}
//               onChange={(e) => handleTeamChange(index, e.target.value)}
//               placeholder={`website${index + 1}.net`}
//             />
//           ))}
//           <button type="button" onClick={() => setUserData({ ...userData, team: [...userData.team, ''] })}>추가</button>
//           <label>소개</label>
//           <textarea
//             name="bio"
//             value={userData.bio}
//             onChange={handleInputChange}
//             placeholder="I am a designer based in Philadelphia, making great software at Figma."
//           ></textarea>
//           <button type="submit">변경 사항 저장</button>
//         </form>
//       </div>
//       <style jsx>{`
//         .container {
//           display: flex;
//           padding: 2rem;
//         }
//         .profile-section {
//           flex: 1;
//           padding: 1rem;
//         }
//         .profile-container {
//           flex: 2;
//           flex-direction: column;
//           align-items: center;
//           padding: 2rem;
//         }
//         .section-title {
//           font-size: 2rem;
//           font-weight: bold;
//           margin-bottom: 1rem;
//         }
//         form {
//           display: flex;
//           flex-direction: column;
//           width: 100%;
//           max-width: 500px;
//         }
//         label {
//           margin-top: 1rem;
//         }
//         input, textarea {
//           width: 100%;
//           padding: 0.5rem;
//           margin-top: 0.5rem;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//         }
//         button {
//           margin-top: 1rem;
//           padding: 0.5rem;
//           background-color: #0070f3;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         button[type="button"] {
//           background-color: #eaeaea;
//           color: #000;
//         }
//       `}</style>
//     </div>
//   );
// }
// // 관리자 페이지 컴포넌트
// function AdminPage() {
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [teams, setTeams] = useState([]);
//   const [members, setMembers] = useState({});
//   const [placeholderText] = useState("새로운 작업반을 생성해 주세요. 작업반의 이름을 지정할 수 있고, 누를 시 해당 작업반의 특징이 보여집니다.");

//   const handleTeamClick = (team) => {
//     if (members[team].length === 0) {
//       const defaultMembers = ['인원수', '특화작물', '기계수'];
//       const newMembers = { ...members, [team]: defaultMembers };
//       setMembers(newMembers);
//     }
//     setSelectedTeam(team);
//   };

//   const handleAddTeam = () => {
//     const newTeamName = `새 작업반 ${teams.length + 1}`;
//     const defaultMembers = ['인원수', '특화작물', '기계수'];
//     setTeams([...teams, newTeamName]);
//     setMembers({ ...members, [newTeamName]: defaultMembers });
//     setSelectedTeam(newTeamName);
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
//     setSelectedTeam(value);
//   };

//   const handleAddMember = (team) => {
//     const newMembers = { ...members };
//     newMembers[team] = [...newMembers[team], ''];
//     setMembers(newMembers);
//   };

//   const handleMemberChange = (team, index, value) => {
//     const newMembers = { ...members };
//     newMembers[team][index] = value;
//     setMembers(newMembers);
//   };

//   const handleSave = () => {
//     console.log('Saved:', { teams, members });
//   };

//   return (
//     <div className="container">
//       <div className="sidebar">
//         <h1 className="sidebar-title">작업반 관리</h1>
//         {teams.length === 0 && (
//           <div className="team-input-container">
//             <input
//               type="text"
//               value=""
//               placeholder={placeholderText}
//               readOnly
//               className="team-input placeholder"
//             />
//           </div>
//         )}
//         {teams.map((team, index) => (
//           <div key={index} className="team-input-container">
//             <input
//               type="text"
//               value={team}
//               onChange={(e) => handleTeamNameChange(index, e.target.value)}
//               onClick={() => handleTeamClick(team)}
//               placeholder="작업반 이름 수정"
//               className="team-input"
//             />
//           </div>
//         ))}
//         <button type="button" onClick={handleAddTeam} className="add-button">+ Add another</button>
//       </div>
//       {selectedTeam && (
//         <div className="details">
//           <h1>{selectedTeam}</h1>
//           {members[selectedTeam]?.map((member, index) => (
//             <input
//               key={index}
//               type="text"
//               value={member}
//               onChange={(e) => handleMemberChange(selectedTeam, index, e.target.value)}
//               placeholder="내용 추가"
//               className="member-input"
//             />
//           ))}
//           <button type="button" onClick={() => handleAddMember(selectedTeam)} className="add-button">+ Add another</button>
//           <button type="button" onClick={handleSave} className="save-button">저장</button>
//         </div>
//       )}
//       <style jsx>{`
//         .container {
//           display: flex;
//           padding: 2rem;
//         }
//         .sidebar {
//           flex: 1;
//           padding: 1rem;
//         }
//         .sidebar-title {
//           font-size: 2.5rem; /* 글자 크기 설정 */
//           font-weight: bold; /* 글자 굵게 설정 */
//           margin-bottom: 1rem; /* 제목과 입력 필드 사이의 간격 */
//         }
//         .team-input-container {
//           margin-bottom: 1rem;
//         }
//         .team-input {
//           width: 100%;
//           padding: 1rem;
//           border: 1px solid #000;
//           border-radius: 4px;
//         }
//         .team-input::placeholder {
//           font-size : 1.5rem;
//           color: #000; /* 검정색으로 설정 */
//         }
//         .details {
//           flex: 2;
//           padding: 1rem;
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//         }
//         .details h1 {
//           font-size: 2rem;
//           font-weight: bold;
//         }
//         .member-input {
//           width: 100%;
//           padding: 1rem;
//           margin-top: 1rem;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//         }
//         .add-button {
//           margin-top: 0.3rem;
//           padding: 0.5rem;
//           background-color: transparent;
//           color: #0070f3;
//           border: none;
//           cursor: pointer;
//           font-size: 1.25rem; /* Add another 텍스트 크기 설정 */
//         }
//         .save-button {
//           margin-top: 1rem;
//           padding: 0.5rem;
//           background-color: #0070f3;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//       `}</style>
//     </div>
//   );
// }
