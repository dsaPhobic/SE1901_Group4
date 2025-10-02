import React, { useMemo, useState } from "react";
import "./Dictionary.css";
import Sidebar from "../../Components/Dashboard/Sidebar";
import HeaderBar from "../../Components/Layout/HeaderBar";
import { Trash2, Volume2, PlusCircle, XCircle, FolderPlus, X } from "lucide-react";
import { useDictionary } from "../../Hook/UseDictionary";
import * as VocabGroupApi from "../../Services/VocabGroupApi";
import SearchBar from "../../Components/Dictionary/SearchBar";
import Popup from "../../Components/Dictionary/PopUp";
export default function Dictionary() {
  const user = JSON.parse(localStorage.getItem("user"));
  const {
    groups,
    activeGroup,
    setActiveGroup,
    words,
    searchTerm,
    setSearchTerm,
    searchResult,
    showPopup,
    setShowPopup,
    selectedGroupId,
    setSelectedGroupId,
    errorMessage,
    handleSearch,
    handleAddToGroup,
    handleRemoveWord,
    reloadGroups,
  } = useDictionary(user);

  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const filteredWords = useMemo(() => {
    return words
      .filter((w) =>
        w.term.toLowerCase().includes(groupSearchTerm.toLowerCase())
      )
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [words, groupSearchTerm]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      alert("Group name is required!");
      return;
    }

    VocabGroupApi.Add({
      groupname: newGroupName,
      userId: user.userId,
    })
      .then(() => {
        setNewGroupName("");
        setShowCreateGroup(false);
        reloadGroups();
      })
      .catch((err) => {
        console.error("Create group failed:", err);
        alert("Failed to create group");
      });
  };
  const handleDeleteGroup = (g) => {
    if (window.confirm(`Delete group "${g.groupname}"?`)) {
      VocabGroupApi.remove(g.groupId)
        .then(() => {
          reloadGroups();
          if (activeGroup?.groupId === g.groupId) {
            setActiveGroup(null);
          }
        })
        .catch((err) => {
          console.error("Delete group failed:", err);
          alert("Failed to delete group");
        });
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="main-content">
        <HeaderBar />

        <div className="dictionary-container">
          <h2>Vocabulary Notebook</h2>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={handleSearch}
            placeholder="Search vocabulary..."
          />

          {/* Tabs for groups */}
          <div className="tabs">
            {groups.map((g) => (
              <div key={g.groupId} className="tab-wrapper">
                <button
                  className={`tab ${activeGroup?.groupId === g.groupId ? "active" : ""}`}
                  onClick={() => setActiveGroup(g)}
                >
                  {g.groupname} ({g.wordIds.length})
                </button>
                <button
                  className="delete-group-btn"
                  onClick={() => handleDeleteGroup(g)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button className="tab create" onClick={() => setShowCreateGroup(true)}>
              <FolderPlus size={16} /> New Group
            </button>
          </div>

          <SearchBar
            value={groupSearchTerm}
            onChange={setGroupSearchTerm}
            onSubmit={(e) => e.preventDefault()}
            placeholder="Search in this group..."
          />

          {/* Words table */}
          <table className="dictionary-table">
            <thead>
              <tr>
                <th>Term</th>
                <th>Meaning</th>
                <th>Example</th>
                <th>Audio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredWords.map((w) => (
                <tr key={w.wordId}>
                  <td>{w.term}</td>
                  <td>{w.meaning || "-"}</td>
                  <td>{w.example || "-"}</td>
                  <td>
                    {w.audio ? (
                      <button className="icon-btn" onClick={() => new Audio(w.audio).play()}>
                        <Volume2 size={18} />
                      </button>
                    ) : "-"}
                  </td>
                  <td>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleRemoveWord(w.wordId)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup tạo group */}
        {showCreateGroup && (
          <Popup
            title="Create New Group"
            onClose={() => setShowCreateGroup(false)}
            actions={
              <>
                <button onClick={handleCreateGroup}>
                  <PlusCircle size={18} /> Create
                </button>
                <button className="cancel" onClick={() => setShowCreateGroup(false)}>
                  <XCircle size={18} /> Cancel
                </button>
              </>
            }
          >
            <input
              type="text"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </Popup>
        )}

        {/* Popup search result */}
        {showPopup && (
          <Popup
            title="Search Result"
            onClose={() => setShowPopup(false)}
            actions={
              <>
                <button onClick={handleAddToGroup}>
                  <PlusCircle size={18} /> Add to Group
                </button>
                <button className="cancel" onClick={() => setShowPopup(false)}>
                  <XCircle size={18} /> Close
                </button>
              </>
            }
          >
            {errorMessage ? (
              <p className="error">{errorMessage}</p>
            ) : (
              <>
                <div><strong>Term:</strong> {searchResult.term}</div>
                <div><strong>Meaning:</strong> {searchResult.meaning || "-"}</div>
                <div><strong>Example:</strong> {searchResult.example || "-"}</div>
                <div>
                  <strong>Audio:</strong>{" "}
                  {searchResult.audio ? (
                    <button
                      className="icon-btn"
                      onClick={() => new Audio(searchResult.audio).play()}
                    >
                      <Volume2 size={18} />
                    </button>
                  ) : "Not available"}
                </div>
                <select
                  value={selectedGroupId || ""}
                  onChange={(e) => setSelectedGroupId(Number(e.target.value))}
                >
                  <option value="">-- Select group --</option>
                  {groups.map((g) => (
                    <option key={g.groupId} value={g.groupId}>
                      {g.groupname}
                    </option>
                  ))}
                </select>
              </>
            )}
          </Popup>
        )}
      </main>
    </div>
  );
}
