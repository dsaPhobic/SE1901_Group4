import { useEffect, useState } from "react";
import * as VocabGroupApi from "../Services/VocabGroupApi";
import * as WordApi from "../Services/WordApi";

export function useDictionary(user) {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [words, setWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshGroups, setRefreshGroups] = useState(0); 

  // Load groups by user
  useEffect(() => {
    if (!user) return;
    VocabGroupApi.getByUser(user.userId).then((res) => {
      if (res.data) {
        setGroups(res.data);
        if (res.data.length > 0) {
          // Nếu activeGroup null thì chọn group đầu
          if (!activeGroup) setActiveGroup(res.data[0]);
        }
      }
    });
  }, [user?.userId, refreshGroups]); 

  useEffect(() => {
    if (!activeGroup) return;
    VocabGroupApi.getWordsInGroup(activeGroup.groupId)
      .then((res) => setWords(res.data))
      .catch((err) => console.error("Error loading words:", err));
  }, [activeGroup]);

  // Search vocabulary
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const res = await WordApi.lookup(searchTerm);
      setSearchResult(res.data);
      setErrorMessage("");
      setShowPopup(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setErrorMessage(`The word "${searchTerm}" was not found.`);
        setSearchResult(null);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setErrorMessage("");
        }, 2000);
      } else {
        setErrorMessage("Unexpected error occurred. Please try again.");
        setSearchResult(null);
        setShowPopup(true);
      }
    }
  };

  // Add word
  const handleAddToGroup = () => {
    if (!selectedGroupId || !searchResult) {
      alert("Please select a group to add this word.");
      return;
    }
    VocabGroupApi.addWordToGroup(selectedGroupId, searchResult.wordId)
      .then(() => {
        if (activeGroup?.groupId === selectedGroupId) {
          setWords([...words, searchResult]);
        }
        // reload lại groups
        reloadGroups();
        setShowPopup(false);
      })
      .catch((err) => console.error("Add word failed:", err));
  };

  // Remove word
  const handleRemoveWord = (wordId) => {
    VocabGroupApi.removeWordFromGroup(activeGroup.groupId, wordId)
      .then(() => setWords(words.filter((w) => w.wordId !== wordId)))
      .catch((err) => console.error("Delete failed:", err));
  };

  // ✅ Hàm reload groups để component bên ngoài gọi
  const reloadGroups = () => setRefreshGroups((prev) => prev + 1);

  return {
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
  };
}
