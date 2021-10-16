import { Logger } from 'homebridge';
import { EnergyUsage } from './energyUsage';
import P100 from './p100';
import {ConsumptionInfo} from "../homekit-device/types";

export default class P110 extends P100 {

  private _consumption!:ConsumptionInfo;

  constructor(
        public readonly log: Logger,
        public readonly ipAddress: string,
        public readonly email: string,
        public readonly password: string,
  ) {
    super(log, ipAddress, email, password);
    this.log.debug('Constructing P110 on host: ' + ipAddress);
  }

  async getEnergyUsage():Promise<EnergyUsage>{        
    const payload = '{'+
        '"method": "get_energy_usage",'+
        '"requestTimeMils": ' + Math.round(Date.now() * 1000) + ''+
        '};';
     
    return this.handleRequest(payload).then((response)=>{
      this._consumption = {
        total: this._consumption ? this._consumption.total + response.result.current_power : response.result.current_power,
        current: response.result.current_power
      }
      return response.result;
    });
  }

  public getPowerConsumption():ConsumptionInfo{
    return this._consumption;
  }
}