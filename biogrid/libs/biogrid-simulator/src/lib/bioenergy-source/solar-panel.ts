/**
 * @file defines the @class SolarPanel which describes solar panels that are considered as the primary source of energy considered in this microgrid.
 * It @extends EnergySource which add the functionalities the energy source
 *
 * @summary is abstract class for an energy source
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 7/16/2020, 7:01:09 AM
 * Last modified  : 7/29/2020, 9:55:17 AM
 */
import { WeatherLib } from '@biogrid/weather';
import { EnergySource, EnergySourceParams } from './bioenergy-source';
import {
  Validatable,
  validate,
  Power,
  CloudCoverage,
} from '@biogrid/grid-simulator';
import { SOLAR_PANEL, RESISTANCE } from '../config';

export interface SolarPanelParams extends EnergySourceParams {
  areaSquareMeters: number,
  gridItemName: string,
  date?: Date,
}

export class SolarPanel extends EnergySource {
  private areaSquareMeters: number;
  // This is unique to every single solar panel but all have a same prefix name
  gridItemName: string;
  private date: Date;
  private weatherLib: WeatherLib;
  gridItemResistance: number = RESISTANCE.SOLAR_PANEL;
  /**
   * @param efficiency - default to 17.5% efficiency as solar panels are often between 15% and 20% efficiency
   */
  constructor(solarPanelParams: SolarPanelParams) {
    super(solarPanelParams);
    if (!this.validateInputsSolarPanel(solarPanelParams.areaSquareMeters)) {
      throw new Error(
        `Cannot create a solar panel object with values of area ${solarPanelParams.areaSquareMeters}`
      );
    }
    this.areaSquareMeters = solarPanelParams.areaSquareMeters;
    this.gridItemName = solarPanelParams.gridItemName;
    this.date = solarPanelParams.date ? solarPanelParams.date : new Date();
    this.weatherLib = new WeatherLib(this.date, this.longitude, this.latitude);
  }

  private validateInputsSolarPanel(area: number) {
    const validator: Validatable = {
      value: area,
      isPositive: area >= 0,
    };
    return validate(validator);
  }

  async getPowerAmount(date: Date): Promise<Power> {
    if (!this.weatherLib.isSetup()) {
      await this.weatherLib.setup();
    }
    // Solar panels do not produce energy at night
    if (!this.weatherLib.isDay(date)) {
      return 0;
    }
    const cloudCoverage = this.weatherLib.getCloudCoverage(date);
    const powerPerSqrMeter = this.cloudCoverageToKiloWattsPerSquareMeter(
      cloudCoverage
    );
    return powerPerSqrMeter * this.areaSquareMeters * this.efficiency;
  }

  supplyPower(requiredPower: Power): Power {
    // TODO implement this when you return the amount of power
    // TODO that the solar panel holds at the particular moment
    // subtract requiredPower from the current and return it, keep track of the remaining power
    return requiredPower;
  }

  /**
   * This method returns the current power that can be generated by
   * the solar panel at that given time
   */
  async getEnergyInJoules(): Promise<Power> {
    return await this.getPowerAmount(this.date);
  }

  async isEmpty() {
    return (await this.getEnergyInJoules()) === 0;
  }

  private cloudCoverageToKiloWattsPerSquareMeter(cloudCoverage: CloudCoverage) {
    // CalculationDerived from https://scool.larc.nasa.gov/lesson_plans/CloudCoverSolarRadiation.pdf
    return (
      (SOLAR_PANEL.CLEAR_SKY_POWER_WATTS *
        (1 -
          SOLAR_PANEL.CLOUD_COVERAGE_SCALING_CONSTANT *
            Math.pow(cloudCoverage, 3))) /
      1000
    );
  }
}
