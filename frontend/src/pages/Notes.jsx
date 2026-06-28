import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await API.get("/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load notes.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      await API.post("/notes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({ title: "", content: "" });
      fetchNotes();
    } catch (err) {
      setError("Failed to create note.");
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/notes/${editingNote._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingNote(null);
      setFormData({ title: "", content: "" });
      fetchNotes();
    } catch (err) {
      setError("Failed to update note.");
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await API.delete(`/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotes();
    } catch (err) {
      setError("Failed to delete note.");
    }
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setFormData({ title: "", content: "" });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Notes</h2>
            <p className="text-gray-500 mt-1">Create and manage your notes.</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-300 transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        {/* Create/Edit Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingNote ? "Edit Note" : "Create New Note"}
          </h3>
          <form onSubmit={editingNote ? updateNote : createNote} className="space-y-4">
            <input
              type="text"
              placeholder="Note title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              required
            />
            <textarea
              placeholder="Note content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 resize-none"
              required
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 transform hover:scale-[1.02]"
              >
                {editingNote ? "Update Note" : "Create Note"}
              </button>
              {editingNote && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600 font-medium">Loading notes...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && notes.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No notes yet</h3>
            <p className="text-gray-500">Create your first note using the form above</p>
          </div>
        )}

        {/* Notes Grid */}
        {!isLoading && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {note.title || "Untitled"}
                    </h4>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 flex-1 mb-4">
                    {note.content || "No content"}
                  </p>
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => startEditing(note)}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;