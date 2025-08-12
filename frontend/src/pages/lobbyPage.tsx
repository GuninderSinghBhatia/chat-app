import { useEffect, useState } from "react";
import { RoomLogic } from "../utils/roomLogic";

type LobbyPageProps = {
  onCreateRoom: (token: number | null) => void;
  onJoinRoom: (roomCode: string) => void;
};

export function LobbyPage({ onCreateRoom, onJoinRoom }: LobbyPageProps) {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [token, setToken] = useState<number | null>(null);
  const [roomCode, setRoomCode] = useState("");

  // Generate a room token whenever "Create Room" popup is opened
  useEffect(() => {
    if (showCreatePopup) {
      setToken(RoomLogic());
    }
  }, [showCreatePopup]);

  const handleCreateRoomClick = () => {
    if (token !== null) {
      onCreateRoom(Number(token)); // Ensure number
      setShowCreatePopup(false);
    }
  };

  const handleJoinRoomClick = () => {
    if (roomCode.trim()) {
      onJoinRoom(roomCode);
      setShowJoinPopup(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#000000] via-[#0f2027] to-[#2c5364]">
      <div className="flex gap-8">
        {/* Create Room Button */}
        <button
          onClick={() => setShowCreatePopup(true)}
          className="px-8 py-3 text-lg font-semibold text-white bg-[#1e90ff] rounded-lg shadow-[0_0_15px_#1e90ff] hover:scale-105 hover:shadow-[0_0_25px_#1e90ff] transition-all duration-300 ease-in-out"
        >
          Create Room
        </button>

        {/* Join Room Button */}
        <button
          onClick={() => setShowJoinPopup(true)}
          className="px-8 py-3 text-lg font-semibold text-white bg-[#20b2aa] rounded-lg shadow-[0_0_15px_#20b2aa] hover:scale-105 hover:shadow-[0_0_25px_#20b2aa] transition-all duration-300 ease-in-out"
        >
          Join Room
        </button>
      </div>

      {/* Create Room Popup */}
      {showCreatePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-[#0f2027] text-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Your Room Code</h2>
            <p className="text-gray-300 mb-6 text-2xl font-mono">{token}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCreateRoomClick}
                className="px-6 py-2 bg-[#20b2aa] rounded-lg shadow-[0_0_10px_#20b2aa] hover:shadow-[0_0_20px_#20b2aa] transition-all duration-300"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreatePopup(false)}
                className="px-6 py-2 bg-[#1e90ff] rounded-lg shadow-[0_0_10px_#1e90ff] hover:shadow-[0_0_20px_#1e90ff] transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Popup */}
      {showJoinPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-[#0f2027] text-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Join a Room</h2>
            <input
              type="number"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.slice(0, 5))}
              className="w-full p-2 mb-4 rounded bg-[#1c1c1c] text-white outline-none focus:ring-2 focus:ring-[#1e90ff] no-spinner"
            />
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleJoinRoomClick}
                className="px-6 py-2 bg-[#20b2aa] rounded-lg shadow-[0_0_10px_#20b2aa] hover:shadow-[0_0_20px_#20b2aa] transition-all duration-300"
              >
                Join
              </button>
              <button
                onClick={() => setShowJoinPopup(false)}
                className="px-6 py-2 bg-[#1e90ff] rounded-lg shadow-[0_0_10px_#1e90ff] hover:shadow-[0_0_20px_#1e90ff] transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
