import { useState } from 'react';
import './App.css';
import PropTypes from 'prop-types';

function Pot({ potNumber, clubs }) {
  return (
    <div className="pot">
      <h3>Pot {potNumber}</h3>
      <ul>
        {clubs.map((club, index) => (
          <li key={index}>{club}</li>
        ))}
      </ul>
    </div>
  );
}

Pot.propTypes = {
  potNumber: PropTypes.number.isRequired,
  clubs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function App() {
  const [clubName, setClubName] = useState('');
  const [clubs, setClubs] = useState([]);
  const [drawnMatches, setDrawnMatches] = useState([]);
  const maxClubs = 12;

  const handleInputChange = (e) => {
    setClubName(e.target.value);
  };

  const handleAddClub = () => {
    if (clubs.length < maxClubs && clubName.trim() !== '') {
      setClubs([...clubs, clubName.trim()]);
      setClubName('');
    }
  };

  const getPots = () => {
    const pots = [[], [], [], []];
    clubs.forEach((club, index) => {
      const potIndex = Math.floor(index / 3); // Split into pots of 3 clubs each
      pots[potIndex].push(club);
    });
    return pots;
  };

  const draw = () => {
    let results = {};
  
    // Step 1: Initialize home/away slots for each club
    clubs.forEach(club => {
      results[club] = { home: null, away: null };
    });
  
    // Step 2: Shuffle the clubs to randomize pairing
    const shuffledClubs = [...clubs];
    for (let i = shuffledClubs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledClubs[i], shuffledClubs[j]] = [shuffledClubs[j], shuffledClubs[i]];
    }
  
    // Step 3: Split the shuffled clubs into two halves
    const halfLength = shuffledClubs.length / 2;
    const homeGroup = shuffledClubs.slice(0, halfLength);
    const awayGroup = shuffledClubs.slice(halfLength, shuffledClubs.length);
  
    // Step 4: Assign home and away matches
    homeGroup.forEach((homeClub, index) => {
      const awayClub = awayGroup[index];
  
      // Assign homeClub to play at home against awayClub
      results[homeClub].home = awayClub;
  
      // Assign awayClub to play away against homeClub
      results[awayClub].away = homeClub;
    });
  
    // Step 5: Reverse the pairing for the second match (for variety)
    homeGroup.forEach((homeClub, index) => {
      const nextAwayClub = awayGroup[(index + 1) % halfLength]; // Get the next club in the list for the second match
  
      // Assign homeClub to play away against a different awayClub
      results[homeClub].away = nextAwayClub;
  
      // Assign nextAwayClub to play home against the homeClub
      results[nextAwayClub].home = homeClub;
    });
  
    // Set the results
    setDrawnMatches(results);
  };
  
  

  const pots = getPots();
  const isDisabled = clubs.length >= maxClubs;
  const remainingClubs = maxClubs - clubs.length;
  const statusMessage = `You have entered ${clubs.length} names, ${remainingClubs} remaining.`;

  return (
    <div className="App">
      <h1>Football Club Pots</h1>
      <div className="input-container">
        <input
          type="text"
          value={clubName}
          onChange={handleInputChange}
          placeholder="Enter football club name"
          disabled={isDisabled}
        />
        <button onClick={handleAddClub} disabled={isDisabled}>
          Add Club
        </button>
      </div>
      <div className="status-message">
        {statusMessage}
      </div>
      {isDisabled && <div className="message">Every pot is full, now make the draw!</div>}
      <div className="pots-container">
        {pots.map((pot, index) => (
          <Pot key={index} potNumber={index + 1} clubs={pot} />
        ))}
      </div>

      {isDisabled && (
        <>
          <button onClick={draw}>Make Draw</button>
          <div className="drawn-matches-container">
            {Object.keys(drawnMatches).map((host, index) => (
              <div key={index} className="drawn-match">
                <strong>{host}</strong>
                <span>Home: {drawnMatches[host].home || 'TBD'}</span>
                <span>Away: {drawnMatches[host].away || 'TBD'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
