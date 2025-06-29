import React, { useState, useEffect, useCallback } from "react";
import { createNote, getAllNotes, deleteNote, updateNote } from "../api.js";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaChevronLeft,
  FaClock,
  FaSync,
  FaSearch,
  FaTimes,
  FaSignOutAlt
} from "react-icons/fa";
import logosImage from "../assets/logos.png";
import "./Notes.css";
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleted, setIsDeleted] = useState("");
  const [netError, setNetError] = useState("");
  const [formError, setFormError] = useState("");
  const [updateNoteId, setUpdateNoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newNoteIds, setNewNoteIds] = useState([]);
  const [deletedNoteId, setDeletedNoteId] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  

  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        navigate('/notes');
      }
      else{
        navigate('/login');
      }
    }, []);
  // const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    showPopup();
    // Redirect to login page after logout
    setTimeout(() => {
      navigate('/login');
    }, 2000);
   
  };

  const showPopup = (message="🔒 Logged out successfully!", type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 3000);
  };

  

  

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllNotes();
      const fetchedNotes = response.data?.notes || [];
      setNotes(fetchedNotes);
    } catch (error) {
      setNetError("⚠️ Network or Server issue!");
      setTimeout(() => setNetError(""), 3000);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filterNotes = () => {
    if (!searchQuery.trim()) return notes;
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const toggleSearch = () => setIsSearchOpen(prev => !prev);
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage("");
    setNetError("");
    await fetchNotes();
    setRefreshMessage("🔄 Refreshed successfully!");
    setTimeout(() => setRefreshMessage(""), 3000);
    setIsRefreshing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle && !trimmedDescription) {
      setFormError("⚠️ Title and Description are required.");
      setTimeout(() => setFormError(""), 3000);
      return;
    }
    else if(!trimmedTitle){
      setFormError("⚠️ Title is required.");
      setTimeout(() => setFormError(""), 3000);
      return;

    }
    else if(!trimmedDescription){
      setFormError("⚠️ Description is required.");
      setTimeout(() => setFormError(""), 3000);
      return;

    }

    

    try {
      if (updateNoteId) {
        const response = await updateNote(updateNoteId, { title: trimmedTitle, description: trimmedDescription });
        if (response.data.success) {
          setSuccessMessage("✔ Note updated successfully!");
          setNotes(prev => prev.map(note =>
            note._id === updateNoteId ? { ...note, title: trimmedTitle, description: trimmedDescription } : note
          ));
        }
      } else {
        const response = await createNote({ title: trimmedTitle, description: trimmedDescription });
        const newNote = response.data?.note;
        if (response.data.success && newNote?._id) {
          setSuccessMessage("✅ Note created successfully!");
          setNotes(prev => [newNote, ...prev]);
          setNewNoteIds([newNote._id]);
          setTimeout(() => setNewNoteIds([]), 2000);
        }
      }

      setTitle("");
      setDescription("");
      setUpdateNoteId(null);
      setSearchQuery("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setNetError("⚠️ Network/server issue!");
      setTimeout(() => setNetError(""), 3000);
    }
  };
  

  const handleEditClick = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setUpdateNoteId(note._id);
    setIsLeftOpen(true);
  };

  const handleCancelEdit = () => {
    setUpdateNoteId(null);
    setTitle("");
    setDescription("");
    setSuccessMessage("Edit canceled.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const confirmDelete = (id) => {
    setNoteToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteNote(noteToDelete);
      setDeletedNoteId(noteToDelete);
      setShowModal(false);
      setNoteToDelete(null);
      setIsDeleted("🗑️ Note deleted successfully!");
      setTimeout(() => {
        setNotes(prev => prev.filter(note => note._id !== noteToDelete));
        setDeletedNoteId(null);
      }, 300);
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setNoteToDelete(null);
  };

  const toggleLeftPane = () => setIsLeftOpen(prev => !prev);
  return (
    <div className="main">
      {popup.show && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}
      {/* Left Panel */}
      <div className="left" style={{
        width: isLeftOpen ? "30%" : "80px",
        transition: "width 0.4s ease",
        overflow: isLeftOpen ? "auto" : "hidden"
      }}>
        {!isLeftOpen && (
          <div className="menu_notleft_opened">
            <div className="logo_container">
              <img className="logo_image" src={logosImage} alt="logo" />
            </div>
          </div>
        )}
        <div className="add_notes" onClick={toggleLeftPane} style={{ top: !isLeftOpen ? "80px" : "", right: !isLeftOpen ? "5px" : "" }}>
          {isLeftOpen ? <FaChevronLeft title="close" className="back-icon" /> : <FaPlus title="add note" className="forward-icon" />}
        </div>
        {isLeftOpen && (
          <>
            <div className="logo_container">
              <img className="logo_image" src={logosImage} alt="logo" />
              <h2 className="logo">IdeaNest</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <input className="note_title" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <button type="submit">{updateNoteId ? "Edit Note" : "Add Note"}</button>
              {updateNoteId && (
                <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "0px", background: "#ccc" }}>
                  Cancel Edit
                </button>
              )}
            </form>
          </>
        )}
      </div>

      {/* Right Panel */}
      <div className="right" style={{ width: isLeftOpen ? "70%" : "100%", transition: "width 0.4s ease" }}>
        <div className="nav">
          <div className="tit_refresh">
            <div className="logo_containers">
              <img className="logo_image" src={logosImage} alt="logo" />
            </div>
            <h2 className="all_notes_logo">{isLeftOpen ? "Notes Library" : "IdeaNest"}</h2>
            <div className="refresh_wrapper">
              <div className="refresh_button" onClick={handleRefresh}>
                <FaSync className={`refresh_icon ${isRefreshing ? "rotating" : ""}`} title="Refresh Notes" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="search-wrapper">
            <div className="circle_search" onClick={toggleSearch}>
              {isSearchOpen ? <FaTimes className="search-icon" title="Close Search" /> : <FaSearch className="search-icon" title="Search Notes" />}
            </div>
            
            <input
              type="text"
              className={`search-input ${isSearchOpen ? "open" : ""}`}
              placeholder={`Search from ${notes.length} notes`}
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="circle_search_logout"  onClick={handleLogout}>
              <FaSignOutAlt className="search-icon" title="LogOut" />
            </div>
          </div>
          {/* <button onClick={handleLogout}>Logout</button> */}

          {/* Notifications */}
          {refreshMessage && <div className="refresh_popup">{refreshMessage}</div>}
          {successMessage && <div className="refresh_popup">{successMessage}</div>}
          {isDeleted && <div className="refresh_popup">{isDeleted}</div>}
          {netError && <div className="refresh_popup">{netError}</div>}
          {formError && <div className="refresh_popup">{formError}</div>}
        </div>

        {/* Note List */}
        {loading ? (
  <div className="loading-message">
    <div className="spinner"></div>
  </div>
) : filterNotes().length === 0 ? (
  <div className="no-notes-message">
    <img
      src="https://cdn-icons-png.flaticon.com/128/6134/6134065.png"
      alt="Empty"
      className="no-notes-icon"
    />
    {searchQuery.length !== 0 ? (
      <h3>{`Search '${searchQuery}' not found`}</h3>
    ) : (
      <h3>Nothing Found</h3>
    )}
    <p>Try searching or adding a new note.</p>
  </div>
) : (
  <ul className="note-list">
    {filterNotes().map((note) => (
      <li
        key={note._id}
        className={`
          note-item
          ${newNoteIds.includes(note._id) ? "new-note-slide-in" : ""}
          ${deletedNoteId === note._id ? "note-slide-out" : ""}
        `}
      >
        <div className="container">
          <div className="container_icon">
            <div className="date_con">
              <FaClock title="Creation Details" className="icon_clock" />
              <p>{note.createdAt}</p>
            </div>
            <div className="icon_right">
              <FaEdit
                className="icon"
                title="Edit"
                onClick={() => handleEditClick(note)}
              />
              <FaTrash
                className="icon"
                title="Delete"
                onClick={() => confirmDelete(note._id)}
              />
            </div>
          </div>
          <div className="content_spacer"></div>
          <strong>{note.title}</strong>: {note.description}
        </div>
      </li>
    ))}
  </ul>
)}

      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <img className="delete_icon" src="https://cdn-icons-png.flaticon.com/128/17014/17014679.png" alt="delete_icon" />
            <h3>Are you sure you want to delete this note?</h3>
            <div className="modal-buttons">
              <button className="cancel" onClick={handleCancelDelete}>Cancel</button>
              <button className="delete" onClick={handleConfirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
