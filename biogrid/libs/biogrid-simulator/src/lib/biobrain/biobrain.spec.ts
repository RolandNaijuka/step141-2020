import { BioBrain } from "./";
import { Biogrid } from "../biogrid";
import { GRID_ITEM_NAMES, BUILDING } from "../config";
import { Building } from "../building";
import { RuralArea } from "../community";

let actualBrain: BioBrain;
let grid: Biogrid;
const name1 = `${GRID_ITEM_NAMES.ENERGY_USER}-1`;
const name2 = `${GRID_ITEM_NAMES.ENERGY_USER}-2`;
const name3 = `${GRID_ITEM_NAMES.ENERGY_USER}-3`;

beforeAll(() => {
  actualBrain = BioBrain.Instance;
  const ruralArea = [
    new Building({energy: BUILDING.MAX_CAPACITY, x: 3, y: 4, gridItemName: name1}),
    new Building({energy: 0, x: 7, y: 9, gridItemName: name2}),
    new Building({energy: BUILDING.MAX_CAPACITY, x: 7, y: 8, gridItemName: name3}),
  ];
  grid = new Biogrid(
    new RuralArea(ruralArea, /* townWidth = */ 10, /* townHeight = */ 10),
    {
      numberOfLargeBatteryCells: 1,
      numberOfSmallBatteryCells: 0,
      numberOfSolarPanels: 0,
    }
  );
});

describe('BioBrain class', () => {
  test('computeAction sends the required action in form of {receiverName: supplierName}', async () => {
    const action = await actualBrain.computeAction(grid.getSystemState());
    const expectedPath = {
      [name2] : `${GRID_ITEM_NAMES.LARGE_BATTERY}-0`,
    };
    // Expect the supplying paths to be similar to the one above
    const actualPath = action.getSupplyingPaths();
    
    expect(actualPath[name2]).toEqual(expectedPath[name2]);
    expect(Object.keys(action.getSupplyingPaths()).length).toBeGreaterThanOrEqual(1);
  });
});
