'use client';
import { useState } from 'react';
import ProfileCard from '../_components/ProfileCard';


// 기존 코드 주석 처리
/*
import ProfileCard from '../_components/ProfileCard';

export default function ChangeInfoPage() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState(['']);
  const [bio, setBio] = useState('');

  const handleAddTeam = () => {
    setTeam([...team, '']);
  };

  const handleTeamChange = (index, value) => {
    const newTeam = team.slice();
    newTeam[index] = value;
    setTeam(newTeam);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, position, email, team, bio });
  };

  return (
    <div className="container">
      <div className="profile-section">
        <h1 className="section-title">직원 profile</h1>
        <ProfileCard title="이름" content={name} />
        <ProfileCard title="직급" content={position} />
        <ProfileCard title="작업반" content={team.join(', ')} />
      </div>
      <div className="profile-container">
        <h1 className="section-title">직원 프로필 수정</h1>
        <form onSubmit={handleSubmit}>
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="@username123"
          />
          <label>직급</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="@username123"
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
          />
          <label>소속 작업반</label>
          {team.map((teamMember, index) => (
            <input
              key={index}
              type="text"
              value={teamMember}
              onChange={(e) => handleTeamChange(index, e.target.value)}
              placeholder={`website${index + 1}.net`}
            />
          ))}
          <button type="button" onClick={handleAddTeam}>추가</button>
          <label>소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
*/

// 관리자 페이지
export default function ChangeInfoPage() {
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
  /* 전체 컨테이너 설정 */
  .container {
    display: flex; /* 내부 요소들을 좌우로 배치 */
    padding: 1.5rem; /* 컨테이너의 내부 여백 설정 */
  }
  
  /* 사이드바 설정 */
  .sidebar {
    flex: 1; /* 사이드바의 너비 비율 설정 */
    padding: 1rem; /* 사이드바의 내부 여백 설정 */
  }
  
  /* 사이드바 제목 설정 */
  .sidebar-title {
    font-size: 2.5rem; /* 글자 크기 설정 */
    font-weight: bold; /* 글자 굵게 설정 */
    margin-bottom: 1rem; /* 제목과 입력 필드 사이의 간격 */
  }
  
  /* 작업반 입력 컨테이너 설정 */
  .team-input-container {
    margin-bottom: 0.5rem; /* 각 작업반 입력 필드 사이의 간격 */
  }
  
  /* 작업반 입력 필드 설정 */ //여기가 새로운 작업반을 생성해주세요. 작업반 이름을 지정~~ 이쪽 부분을 바꿀 수 있음.
  .team-input {
    width: 100%; /* 입력 필드의 너비를 100%로 설정 */
    padding: 1rem; /* 입력 필드의 내부 여백 설정 */
    border: 1px solid #000; /* 입력 필드의 테두리 색과 두께 설정 */
    border-radius: 4px; /* 입력 필드의 모서리를 둥글게 설정 */
  }
  
  /* 입력 필드의 플레이스홀더 설정 */
  .team-input::placeholder {
    font-size: 1.3rem; /* 플레이스홀더의 글자 크기 설정 */
    color: #000; /* 플레이스홀더의 색상을 검정색으로 설정 */
  }
  
  /* 세부 정보 섹션 설정 */
  .details {
    flex: 2; /* 세부 정보 섹션의 너비 비율 설정 */
    padding: 1rem; /* 세부 정보 섹션의 내부 여백 설정 */
    display: flex; /* 내부 요소들을 블록 요소로 배치 */
    flex-direction: column; /* 내부 요소들을 세로로 배치 */
    align-items: flex-start; /* 내부 요소들을 왼쪽 정렬 */
  }
  
  /* 세부 정보 섹션의 제목 설정 */
  .details h1 {
    font-size: 2rem; /* 글자 크기 설정 */
    font-weight: bold; /* 글자 굵게 설정 */
  }
  
  /* 멤버 입력 필드 설정 */
  .member-input {
    width: 100%; /* 입력 필드의 너비를 100%로 설정 */
    padding: 1rem; /* 입력 필드의 내부 여백 설정 */
    margin-top: 1rem; /* 입력 필드의 위쪽 여백 설정 */
    border: 1px solid #ccc; /* 입력 필드의 테두리 색과 두께 설정 */
    border-radius: 4px; /* 입력 필드의 모서리를 둥글게 설정 */
  }
  
  /* 추가 버튼 설정 */
  .add-button {
    margin-top: 0.3rem; /* 버튼의 위쪽 여백 설정 */
    padding: 0.5rem; /* 버튼의 내부 여백 설정 */
    background-color: transparent; /* 버튼의 배경색을 투명으로 설정 */
    color: #0070f3; /* 버튼의 글자 색상 설정 */
    border: none; /* 버튼의 테두리를 없앰 */
    cursor: pointer; /* 버튼에 마우스 커서를 올렸을 때 포인터 커서로 변경 */
    font-size: 1.4rem; /* 버튼의 글자 크기 설정 */
  }
  
  /* 저장 버튼 설정 */
  .save-button {
    margin-top: 1rem; /* 버튼의 위쪽 여백 설정 */
    padding: 0.5rem; /* 버튼의 내부 여백 설정 */
    background-color: #0070f3; /* 버튼의 배경색 설정 */
    color: white; /* 버튼의 글자 색상 설정 */
    border: none; /* 버튼의 테두리를 없앰 */
    border-radius: 4px; /* 버튼의 모서리를 둥글게 설정 */
    cursor: pointer; /* 버튼에 마우스 커서를 올렸을 때 포인터 커서로 변경 */
  }
`}</style>

    </div>
  );
}