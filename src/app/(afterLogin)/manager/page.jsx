"use client";

import React, { useState, useEffect } from 'react';

const TableComponent = () => {
  const initialUsers = [];

  const [users, setUsers] = useState(initialUsers);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoles, setEditedRoles] = useState([]);

  const validRoles = ['admin', 'manager', 'user'];

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedRoles(users.map(user => ({ id: user.id, role: user.role })));
  };

  const handleRoleChange = (userId, event) => {
    const newRole = event.target.value;
    setEditedRoles(editedRoles.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleSaveClick = async () => {
    const invalidRole = editedRoles.find(edited => !validRoles.includes(edited.role));
    if (invalidRole) {
      alert(`${invalidRole.id}의 Role은 ${validRoles.join(', ')} 중에 하나여야 합니다.`);
      return;
    }

    for (const editedRole of editedRoles) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getAllUserData`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editedRole.id, role: editedRole.role }),
      });
    }
    setUsers(users.map(user => {
      const editedRole = editedRoles.find(edited => edited.id === user.id);
      return editedRole ? { ...user, role: editedRole.role } : user;
    }));
    setIsEditing(false);
    alert('저장 완료')
  };

  const fetchAllUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getAllUserData`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setUsers(data.result.rows);
      console.log("data는 ", data.result.rows);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchAllUserData();
  }, []);

  return (
    <div className="flex justify-center h-full w-full tablet:bg-white tablet:mt-52 zero-to-tablet:mt-24 px-10">
      <div className="container w-full mx-auto">
        <table className="min-w-full bg-white border border-gray-400 table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/12 py-2 px-4 border border-gray-400 text-center">아이디</th>
              <th className="w-2/12 py-2 px-4 border border-gray-400 text-center">이름</th>
              <th className="w-2/12 py-2 px-4 border border-gray-400 text-center">직급</th>
              <th className="w-3/12 py-2 px-4 border border-gray-400 text-center">Role</th>
              <th className="w-2/12 py-2 px-4 border border-gray-400 text-center">작업반</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border border-gray-400 text-center">{user.id}</td>
                <td className="py-2 px-4 border border-gray-400 text-center">{user.name}</td>
                <td className="py-2 px-4 border border-gray-400 text-center">{user.position}</td>
                <td className="py-2 px-4 border border-gray-400 text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedRoles.find(edited => edited.id === user.id)?.role || ''}
                      onChange={(event) => handleRoleChange(user.id, event)}
                      className="w-full px-2 py-1 border rounded text-center"
                      style={{ maxWidth: '100px', height: '2rem' }}
                    />
                  ) : (
                    <span>{user.role}</span>
                  )}
                </td>
                <td className="py-2 px-4 border border-gray-400 text-center">{user.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            정보 수정
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
