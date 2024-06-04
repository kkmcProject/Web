'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import ProfileCard from '../_components/ProfileCard';


export default function ChangeInfoPage() {
  const { data: me, status } = useSession();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async (userId) => {
      console.log("Fetching role for user ID:", userId);  // 디버깅용 로그
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
          console.log("Fetched role:", data.role);  // 디버깅용 로그
          setRole(data.role);
        } else {
          console.error('Error fetching role:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      const userId = me?.user?.result;
      console.log("User ID:", userId);  // 디버깅용 로그
      if (userId) {
        fetchUserRole(userId);
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
    return <UserPage userId={me?.user?.result} />;
  } else {
    return <div>No role assigned</div>;
  }
}

// function AdminPage() {
//   return <div>Admin Page: You have admin access.</div>;
// }

// function UserPage({ userId }) {
//   return <div className='w-96 h-96 bg-red-600'>User Page for user ID: {userId}</div>;
// }


// // 직원 프로필 수정 페이지 컴포넌트
function UserPage({ userId }) {
  const [userData, setUserData] = useState({
    name: '',
    position: '',
    email: '',
    team: [''],
    bio: ''
  });

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch(`/api/user?id=${userId}`);
      const data = await response.json();
      setUserData(data);
    }
    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleTeamChange = (index, value) => {
    const newTeam = [...userData.team];
    newTeam[index] = value;
    setUserData({ ...userData, team: newTeam });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/user?id=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div className="container">
      <div className="profile-section">
        <h1 className="section-title">직원 profile</h1>
        <ProfileCard title="이름" content={userData.name} />
        <ProfileCard title="직급" content={userData.position} />
        <ProfileCard title="작업반" content={userData.team.join(', ')} />
      </div>
      <div className="profile-container">
        <h1 className="section-title">직원 프로필 수정</h1>
        <form onSubmit={handleSubmit}>
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            placeholder="@username123"
          />
          <label>직급</label>
          <input
            type="text"
            name="position"
            value={userData.position}
            onChange={handleInputChange}
            placeholder="@username123"
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            placeholder="email@domain.com"
          />
          <label>소속 작업반</label>
          {userData.team.map((teamMember, index) => (
            <input
              key={index}
              type="text"
              value={teamMember}
              onChange={(e) => handleTeamChange(index, e.target.value)}
              placeholder={`website${index + 1}.net`}
            />
          ))}
          <button type="button" onClick={() => setUserData({ ...userData, team: [...userData.team, ''] })}>추가</button>
          <label>소개</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
            placeholder="I am a designer based in Philadelphia, making great software at Figma."
          ></textarea>
          <button type="submit">변경 사항 저장</button>
        </form>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          padding: 2rem;
        }
        .profile-section {
          flex: 1;
          padding: 1rem;
        }
        .profile-container {
          flex: 2;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
        }
        .section-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        form {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 500px;
        }
        label {
          margin-top: 1rem;
        }
        input, textarea {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          margin-top: 1rem;
          padding: 0.5rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button[type="button"] {
          background-color: #eaeaea;
          color: #000;
        }
      `}</style>
    </div>
  );
}
// 관리자 페이지 컴포넌트
function AdminPage() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState({});
  const [placeholderText] = useState("새로운 작업반을 생성해 주세요. 작업반의 이름을 지정할 수 있고, 누를 시 해당 작업반의 특징이 보여집니다.");

  const handleTeamClick = (team) => {
    if (members[team].length === 0) {
      const defaultMembers = ['인원수', '특화작물', '기계수'];
      const newMembers = { ...members, [team]: defaultMembers };
      setMembers(newMembers);
    }
    setSelectedTeam(team);
  };

  const handleAddTeam = () => {
    const newTeamName = `새 작업반 ${teams.length + 1}`;
    const defaultMembers = ['인원수', '특화작물', '기계수'];
    setTeams([...teams, newTeamName]);
    setMembers({ ...members, [newTeamName]: defaultMembers });
    setSelectedTeam(newTeamName);
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
    setSelectedTeam(value);
  };

  const handleAddMember = (team) => {
    const newMembers = { ...members };
    newMembers[team] = [...newMembers[team], ''];
    setMembers(newMembers);
  };

  const handleMemberChange = (team, index, value) => {
    const newMembers = { ...members };
    newMembers[team][index] = value;
    setMembers(newMembers);
  };

  const handleSave = () => {
    console.log('Saved:', { teams, members });
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h1 className="sidebar-title">작업반 관리</h1>
        {teams.length === 0 && (
          <div className="team-input-container">
            <input
              type="text"
              value=""
              placeholder={placeholderText}
              readOnly
              className="team-input placeholder"
            />
          </div>
        )}
        {teams.map((team, index) => (
          <div key={index} className="team-input-container">
            <input
              type="text"
              value={team}
              onChange={(e) => handleTeamNameChange(index, e.target.value)}
              onClick={() => handleTeamClick(team)}
              placeholder="작업반 이름 수정"
              className="team-input"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddTeam} className="add-button">+ Add another</button>
      </div>
      {selectedTeam && (
        <div className="details">
          <h1>{selectedTeam}</h1>
          {members[selectedTeam]?.map((member, index) => (
            <input
              key={index}
              type="text"
              value={member}
              onChange={(e) => handleMemberChange(selectedTeam, index, e.target.value)}
              placeholder="내용 추가"
              className="member-input"
            />
          ))}
          <button type="button" onClick={() => handleAddMember(selectedTeam)} className="add-button">+ Add another</button>
          <button type="button" onClick={handleSave} className="save-button">저장</button>
        </div>
      )}
      <style jsx>{`
        .container {
          display: flex;
          padding: 2rem;
        }
        .sidebar {
          flex: 1;
          padding: 1rem;
        }
        .sidebar-title {
          font-size: 2.5rem; /* 글자 크기 설정 */
          font-weight: bold; /* 글자 굵게 설정 */
          margin-bottom: 1rem; /* 제목과 입력 필드 사이의 간격 */
        }
        .team-input-container {
          margin-bottom: 1rem;
        }
        .team-input {
          width: 100%;
          padding: 1rem;
          border: 1px solid #000;
          border-radius: 4px;
        }
        .team-input::placeholder {
          font-size : 1.5rem;
          color: #000; /* 검정색으로 설정 */
        }
        .details {
          flex: 2;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .details h1 {
          font-size: 2rem;
          font-weight: bold;
        }
        .member-input {
          width: 100%;
          padding: 1rem;
          margin-top: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .add-button {
          margin-top: 0.3rem;
          padding: 0.5rem;
          background-color: transparent;
          color: #0070f3;
          border: none;
          cursor: pointer;
          font-size: 1.25rem; /* Add another 텍스트 크기 설정 */
        }
        .save-button {
          margin-top: 1rem;
          padding: 0.5rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
