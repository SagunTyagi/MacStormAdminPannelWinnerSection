import React from 'react';
import UserRow from './UserRow';

const DataGrid = ({ users, onRowClick, selectedIds, setSelectedIds }) => {
  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map(u => u.id));
    }
  };

  return (
    <div className="bg-white shadow rounded">
      <div className="p-2 border-b flex items-center">
        <input
          type="checkbox"
          checked={selectedIds.length === users.length}
          onChange={toggleSelectAll}
          className="mr-2"
        />
        <span>Select all</span>
      </div>
      {users.map(user => (
        <UserRow
          key={user.id}
          user={user}
          isSelected={selectedIds.includes(user.id)}
          toggleSelect={() =>
            setSelectedIds(prev =>
              prev.includes(user.id)
                ? prev.filter(id => id !== user.id)
                : [...prev, user.id]
            )
          }
          onRowClick={onRowClick}
        />
      ))}
    </div>
  );
};

export default DataGrid;
