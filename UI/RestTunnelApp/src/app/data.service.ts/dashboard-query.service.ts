
import { Injectable } from '@angular/core';
import { httpPost, extractJSON, httpGet, Response } from '../Common/http';
import { MemoryInfoModel } from '../models/memory-info.model';

@Injectable()
export class DashboardQueryService {
 getMetric(uniqueId: string, metricName: string): Promise<Response> {
    return httpGet('/api/v1/topology/' + uniqueId + '/' + metricName + '/current');
  }

  getCurrentHostMonitorInfo(memory: any, cpus: any, storage: any, network: any, failed: any) {
    httpPost('/api/v1/topology/query', 'application/json', '{"queryText": "!Host"}').then(extractJSON).then(o => {
      console.log(o);
      const property = o.data[0]['properties'];
      const memoryId = property['memory']['uniqueId'];


      this.getMetric(memoryId, 'consumed').then(extractJSON).then(consumedData =>
        this.getMetric(memoryId, 'utilization').then(extractJSON).then(utilizationData =>
          this.getMetric(memoryId, 'freeMemory').then(extractJSON).then(freeMemoryData => {
            if (memory) {
              memory({
                consumed: parseFloat(consumedData.data['properties']['average']),
                free: parseFloat(freeMemoryData.data['properties']['average']),
                utilization: parseFloat(utilizationData.data['properties']['average']),
                total: parseFloat(consumedData.data['properties']['average']) +
                parseFloat(freeMemoryData.data['properties']['average'])
              });
            }
          })
        )
      );

      const cpusId = property['cpus']['uniqueId'];
      this.getMetric(cpusId, 'utilization').then(extractJSON).then(utilizationData =>
        this.getMetric(cpusId, 'totalHz').then(extractJSON).then(totalHzData => {
          if (cpus) {
            cpus({
              utilization: parseFloat(utilizationData.data['properties']['average']),
              total: parseFloat(totalHzData.data['properties']['average'])
            });
          }
        })
      );

      const storageId = property['storage']['uniqueId'];

      this.getMetric(storageId, 'diskUtilization').then(extractJSON).then(diskUtilizationData =>
        this.getMetric(storageId, 'spaceAvailable').then(extractJSON).then(spaceAvailableData =>
          this.getMetric(storageId, 'spaceUsed').then(extractJSON).then(spaceUsedData => {
            if (storage) {
              storage({
                utilization: parseFloat(diskUtilizationData.data['properties']['average']),
                total: parseFloat(spaceAvailableData.data['properties']['average']) +
                parseFloat(spaceUsedData.data['properties']['average'])
              });
            }
          })
        )
      );

      // const networkId = property['network']['uniqueId'];

      // this.getMetric(networkId, 'utilization').then(extractJSON).then(utilizationData =>
      //   this.getMetric(networkId, 'bandwidth').then(extractJSON).then(bandwidthData => {

      //     if (network) {
      //       network({
      //         utilization: parseFloat(utilizationData.data['properties']['average']),
      //         bandwidth: parseFloat(bandwidthData.data['properties']['average'])
      //       });
      //     }
      //   })

      // );


    }).catch(error => {
      failed(error);
    });
  }



}
