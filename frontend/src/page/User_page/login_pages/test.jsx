import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import initializeWebSocket from "./websocket"; // Import your WebSocket utility

const TimingComponent = () => {
  const [serverTime, setServerTime] = useState(null);
  const [openTime, setOpenTime] = useState(null);
  const [closeTime, setCloseTime] = useState(null);
  const [currentPhase, setCurrentPhase] = useState("load");
  const [loading, setLoading] = useState(true);


  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Server Time: {serverTime.toString()}</p>
          <p>Open Time: {openTime.toString()}</p>
          <p>Close Time: {closeTime.toString()}</p>
          <p>Current Phase: {currentPhase}</p>
        </div>
      )}
    </div>
  );
};

export default TimingComponent;
