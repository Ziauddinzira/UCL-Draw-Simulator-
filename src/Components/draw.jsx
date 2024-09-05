import React, { useState } from 'react';

function App() {
  const [pots, setPots] = useState([['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F', 'Team G', 'Team H']]);
  const [matches, setMatches] = useState([]);

  const draw = () => {
    let remainingNames = [...pots[0]];  // Assuming all teams are in one pot for simplicity
    let hostNames = remainingNames.splice(0, remainingNames.length);  // Assign all names as host names
    let results = {};

    hostNames.forEach(host => {
      results[host] = { home: null, away: null };
    });

    hostNames.forEach(host => {
      let homeTeamIndex = Math.floor(Math.random() * remainingNames.length);
      let homeTeam = remainingNames.splice(homeTeamIndex, 1)[0];

      let awayTeamIndex = Math.floor(Math.random() * remainingNames.length);
      let awayTeam = remainingNames.splice(awayTeamIndex, 1)[0];

      if (results[homeTeam]) {
        results[homeTeam].away = host;
      } else if (results[awayTeam]) {
        results[awayTeam].home = host;
      } else {
        results[host].home = homeTeam;
        results[host].away = awayTeam;
      }
    });

    setMatches(Object.entries(results));
  };

  return (
    <div className="App">
      <h1>Draw Matches</h1>
      <button onClick={draw} className="draw-button">Draw</button>
      <div className="matches-container">
        <ul>
          {matches.map(([host, { home, away }], index) => (
            <li key={index}>
              {host} vs {home} (Home) / {away} (Away)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
