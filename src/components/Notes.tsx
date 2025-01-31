/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

// Types
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface Note {
  title: string;
  content: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note>({
    title: "",
    content: "",
  });
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/drive.file";

  useEffect(() => {
    const gapiLoad = () => {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
        } catch (err) {
          console.error("Error initializing GAPI client", err);
          toast.error("Failed to initialize Google API");
        }
      });
    };
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = gapiLoad;
    document.body.appendChild(script);

    const gsiScript = document.createElement("script");
    gsiScript.src = "https://accounts.google.com/gsi/client";
    gsiScript.async = true;
    gsiScript.defer = true;
    gsiScript.onload = () => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.access_token) {
            setIsSignedIn(true);
            toast.success("Successfully signed in!");
          }
        },
      });
      setTokenClient(client);
    };
    document.body.appendChild(gsiScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(gsiScript);
    };
  }, [CLIENT_ID, API_KEY]);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
      toast.error("Failed to load notes!");
    }
  }, []);

  const handleSignIn = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    } else {
      toast.error("Authentication not ready");
    }
  };

  const handleSignOut = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken(null);
      setIsSignedIn(false);
      toast.success("Successfully signed out!");
    }
  };

  const getOrCreateFolder = async (folderName: string): Promise<string> => {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: "files(id, name)",
      });

      const files = response.result.files;
      if (files && files.length > 0) {
        return files[0].id;
      }

      const folderMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };

      const createResponse = await window.gapi.client.drive.files.create({
        resource: folderMetadata,
        fields: "id",
      });

      return createResponse.result.id;
    } catch (error) {
      console.error("Error in getOrCreateFolder:", error);
      throw error;
    }
  };

  const uploadNoteToDrive = async (title: string, content: string) => {
    if (!isSignedIn) {
      toast.error("Please sign in to Google to upload.");
      return;
    }

    try {
      const folderId = await getOrCreateFolder("Notes");
      const file = new Blob([content], { type: "text/plain" });
      const metadata = {
        name: `${title}.txt`,
        mimeType: "text/plain",
        parents: [folderId],
      };

      const accessToken = window.gapi.client.getToken().access_token;
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append("file", file);

      await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      toast.success("Note uploaded to Google Drive!");
    } catch (error) {
      console.error("Error uploading to Drive:", error);
      toast.error("Error uploading note to Google Drive!");
    }
  };

  const addNote = () => {
    if (note.title.trim() === "" || note.content.trim() === "") {
      toast.error("Title and content cannot be empty!");
      return;
    }

    const newNotes = [...notes, note];
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
    setNote({ title: "", content: "" });
    toast.success("Note added successfully!");
  };

  const removeNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
    toast.error("Note removed successfully!");
  };

  const uploadAllNotes = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to upload notes");
      return;
    }

    for (const noteItem of notes) {
      await uploadNoteToDrive(noteItem.title, noteItem.content);
    }
  };

  return (
    <div className="flex w-full md:w-1/2 min-h-[300px] lg:h-full flex-col items-center p-2 md:p-4 space-y-3 md:space-y-4">
      <h2 className="text-2xl md:text-3xl font-semibold">Notes</h2>

      <div className="flex space-y-2 w-full items-center justify-center flex-col px-2 md:px-4">
        <input
          type="text"
          placeholder="Enter title of your note..."
          className="bg-slate-50 rounded-xl p-2 w-full sm:w-[50%] text-black border border-white"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />
        <textarea
          placeholder="Enter content of your note..."
          rows={4}
          className="bg-slate-50 rounded-xl p-2 w-full sm:w-[50%] text-black border border-white resize-y min-h-[100px]"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        />
        <button
          className="w-full sm:w-auto p-2 bg-blue-400 hover:bg-blue-700 text-white"
          onClick={addNote}
        >
          Add Note
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        {!isSignedIn ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white"
            onClick={handleSignIn}
          >
            Sign in with Google
          </button>
        ) : (
          <>
            <button
              className="bg-red-400 hover:bg-red-700 py-2 px-4  text-white"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
            <button
              className="bg-green-400 hover:bg-green-700 py-2 px-4  text-white"
              onClick={uploadAllNotes}
            >
              Upload All Notes to Google Drive
            </button>
          </>
        )}
      </div>

      <div className="w-full p-2 flex flex-col items-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Your Notes</h2>
        {notes.length === 0 ? (
          <div className="flex items-center justify-center text-xl md:text-2xl font-semibold">
            No notes
          </div>
        ) : (
          notes.map((noteItem, index) => (
            <div
              key={index}
              className="w-full p-2 rounded-xl flex flex-row items-center justify-around gap-2"
            >
              <div className="w-full max-w-full sm:max-w-[75%] text-black p-2 rounded-xl bg-white flex-1">
                <details className="break-words">
                  <summary className="cursor-pointer hover:text-gray-600">
                    {noteItem.title}
                  </summary>
                  <p className="mt-2 whitespace-pre-wrap">{noteItem.content}</p>
                </details>
              </div>
              <button
                className="bg-red-400 hover:bg-red-600 p-2 text-white"
                onClick={() => removeNote(index)}
              >
                <RxCross1 />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
