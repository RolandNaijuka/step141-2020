

//TODO add proper interfaces for batteries once created
export interface SwitchedOnBatteryAction {
  battery: unknown,
  batteryState: unknown
}

export interface GridAction {
  getSwitchedOnBatteries: () => SwitchedOnBatteryAction[],
}