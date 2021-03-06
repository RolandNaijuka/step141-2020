/**
 * @summary defines the unit tests for the @class BioBrain
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 7/16/2020, 7:01:09 AM
 * Last modified  : 7/29/2020, 10:41:10 AM
 */
import { BioBrain } from "./";
import { Biogrid } from "../biogrid";
import { GRID_ITEM_NAMES, BUILDING } from "../config";
import { Building, BuildingParams } from "../building";
import { RuralArea } from "../community";

let actualBrain: BioBrain;
let grid: Biogrid;
const ENERGY_USER_1 = `${GRID_ITEM_NAMES.ENERGY_USER}-1`;
const ENERGY_USER_2 = `${GRID_ITEM_NAMES.ENERGY_USER}-2`;
const ENERGY_USER_3 = `${GRID_ITEM_NAMES.ENERGY_USER}-3`;

beforeAll(() => {
  actualBrain = BioBrain.Instance;
  const ruralArea = [
    new Building({
      energy: BUILDING.MAX_CAPACITY,
      x: 3,
      y: 4,
      gridItemName: ENERGY_USER_1
    } as BuildingParams),
    new Building({
      energy: 0,
      x: 7,
      y: 9,
      gridItemName: ENERGY_USER_2
    } as BuildingParams),
    new Building({
      energy: BUILDING.MAX_CAPACITY,
      x: 7,
      y: 8,
      gridItemName: ENERGY_USER_3
    } as BuildingParams),
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
      [ENERGY_USER_2] : `${GRID_ITEM_NAMES.LARGE_BATTERY}-0`,
    };
    // Expect the supplying paths to be similar to the one above
    const actualPath = action.getSupplyingPaths();
    
    expect(actualPath[ENERGY_USER_2]).toEqual(expectedPath[ENERGY_USER_2]);
    expect(Object.keys(action.getSupplyingPaths()).length).toBeGreaterThanOrEqual(1);
  });
});
