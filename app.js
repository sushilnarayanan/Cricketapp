import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CricketScorecard = () => {
  const [teams, setTeams] = React.useState([
    { name: 'Team A', players: [], score: 0, wickets: 0, overs: 0 },
    { name: 'Team B', players: [], score: 0, wickets: 0, overs: 0 },
  ]);
  const [currentTeam, setCurrentTeam] = React.useState(0);
  const [currentBatsman, setCurrentBatsman] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const addPlayer = (teamIndex) => {
    const playerName = prompt(`Enter player name for ${teams[teamIndex].name}`);
    if (playerName) {
      setTeams(prevTeams => {
        const newTeams = [...prevTeams];
        newTeams[teamIndex].players.push({
          name: playerName,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          overs: 0,
          wickets: 0,
          runsConceded: 0
        });
        return newTeams;
      });
    }
  };

  const updateBattingStats = (runs) => {
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      const team = newTeams[currentTeam];
      const batsmanIndex = team.players.findIndex(p => p.name === currentBatsman);
      if (batsmanIndex !== -1) {
        team.players[batsmanIndex].runs += runs;
        team.players[batsmanIndex].balls += 1;
        if (runs === 4) team.players[batsmanIndex].fours += 1;
        if (runs === 6) team.players[batsmanIndex].sixes += 1;
      }
      return newTeams;
    });
  };

  const updateBowlingStats = (runs) => {
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      const bowlingTeam = newTeams[1 - currentTeam];
      const bowlerIndex = bowlingTeam.players.findIndex(p => p.name === currentBowler);
      if (bowlerIndex !== -1) {
        bowlingTeam.players[bowlerIndex].overs += 0.1;
        bowlingTeam.players[bowlerIndex].overs = parseFloat(bowlingTeam.players[bowlerIndex].overs.toFixed(1));
        if (bowlingTeam.players[bowlerIndex].overs * 10 % 10 === 6) {
          bowlingTeam.players[bowlerIndex].overs = Math.floor(bowlingTeam.players[bowlerIndex].overs) + 1;
        }
        bowlingTeam.players[bowlerIndex].runsConceded += runs;
      }
      return newTeams;
    });
  };

  const handleBall = (runs) => {
    if (!currentBatsman || !currentBowler) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    updateBattingStats(runs);
    updateBowlingStats(runs);
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      newTeams[currentTeam].score += runs;
      newTeams[currentTeam].overs += 0.1;
      newTeams[currentTeam].overs = parseFloat(newTeams[currentTeam].overs.toFixed(1));
      if (newTeams[currentTeam].overs * 10 % 10 === 6) {
        newTeams[currentTeam].overs = Math.floor(newTeams[currentTeam].overs) + 1;
      }
      return newTeams;
    });
  };

  const handleWicket = () => {
    if (!currentBatsman || !currentBowler) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      newTeams[currentTeam].wickets += 1;
      const bowlingTeam = newTeams[1 - currentTeam];
      const bowlerIndex = bowlingTeam.players.findIndex(p => p.name === currentBowler);
      if (bowlerIndex !== -1) {
        bowlingTeam.players[bowlerIndex].wickets += 1;
      }
      return newTeams;
    });
    setCurrentBatsman('');
  };

  const switchTeam = () => {
    setCurrentTeam(currentTeam === 0 ? 1 : 0);
    setCurrentBatsman('');
    setCurrentBowler('');
  };

  const calculateRunRate = (team) => {
    return team.overs > 0 ? (team.score / team.overs).toFixed(2) : '0.00';
  };

  const calculateStrikeRate = (player) => {
    return player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(2) : '0.00';
  };

  const calculateEconomy = (player) => {
    return player.overs > 0 ? (player.runsConceded / player.overs).toFixed(2) : '0.00';
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cricket Scorecard</h1>
      {showAlert && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Please select both a batsman and a bowler before recording runs or wickets.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-2 gap-4">
        {teams.map((team, index) => (
          <div key={index} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
            <p>Score: {team.score}/{team.wickets}</p>
            <p>Overs: {team.overs}</p>
            <p>Run Rate: {calculateRunRate(team)}</p>
            <button 
              onClick={() => addPlayer(index)}
              className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
            >
              Add Player
            </button>
            <h3 className="font-semibold mt-4 mb-2">Batting:</h3>
            <ul>
              {team.players.map((player, playerIndex) => (
                <li key={playerIndex} className="mb-1">
                  {player.name} - {player.runs} runs ({player.balls} balls)
                  <br />
                  4s: {player.fours}, 6s: {player.sixes}, SR: {calculateStrikeRate(player)}
                  {index === currentTeam && (
                    <button 
                      onClick={() => setCurrentBatsman(player.name)}
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Select Batsman
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mt-4 mb-2">Bowling:</h3>
            <ul>
              {team.players.map((player, playerIndex) => (
                <li key={playerIndex} className="mb-1">
                  {player.name} - {player.wickets}/{player.runsConceded} ({player.overs} overs)
                  <br />
                  Economy: {calculateEconomy(player)}
                  {index !== currentTeam && (
                    <button 
                      onClick={() => setCurrentBowler(player.name)}
                      className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Select Bowler
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">
          Current Batsman: {currentBatsman || 'None selected'} | 
          Current Bowler: {currentBowler || 'None selected'}
        </h3>
        <div className="flex space-x-2">
          {[0, 1, 2, 3, 4, 6].map(runs => (
            <button
              key={runs}
              onClick={() => handleBall(runs)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {runs}
            </button>
          ))}
          <button
            onClick={handleWicket}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Wicket
          </button>
          <button
            onClick={switchTeam}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Switch Team
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<CricketScorecard />, document.getElementById('root'));
