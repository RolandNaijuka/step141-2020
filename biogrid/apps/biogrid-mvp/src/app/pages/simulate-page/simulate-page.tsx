import React, { useState } from 'react';
import './simulate-page.css';
import { Client } from '../../client';
import { BiogridSimulationResults } from '../../build';

export const SimulatePage = () => {
  const [simulationResults, setSimulationResults] = useState<
    BiogridSimulationResults
  >();
  
  const client = Client.getInstance();
  
  async function getSimulationResults() {
    await client.api.runBiogridSimulation();
    const results = await client.api.getBiogridSimulationResults();
    setSimulationResults(results);
  }

  return (
    <div className="simulation">
      <button onClick={() => getSimulationResults()}>Get simulation results</button>
      {simulationResults && (
        <div className="results">
          <table>
            <tr>
              <td>Time without energy</td>
              <td>{simulationResults.timeWithoutEnoughEnergy}</td>
            </tr>
            <tr>
              <td>Energy wasted from source</td>
              <td>{simulationResults.energyWastedFromSource}</td>
            </tr>
            <tr>
              <td>Energy wasted in transport</td>
              <td>{simulationResults.energyWastedInTransportation}</td>
            </tr>
          </table>
        </div>
      )}
    </div>
  );
};

export default SimulatePage;
