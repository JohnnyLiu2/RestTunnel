
import { Injectable } from '@angular/core';
import { httpPost, extractJSON, httpGet, Response, extractResponseModel } from '../Common/http';
import { MemoryInfoModel } from '../models/memory-info.model';

@Injectable()
export class DashboardQueryService {
 getMetric(uniqueId: string, metricName: string): Promise<Response> {
    return httpGet('/api/v1/topology/' + uniqueId + '/' + metricName + '/current');
  }

  private getAvailableHostData(memory: any, cpus: any, storage: any, network: any, failed: any, o: any) {
      const property = o['properties'];
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
  }

  tryNextItem(memory: any, cpus: any, storage: any, network: any, failed: any, o: any, index: number) {
    if (index >= o.length) {
      return;
    }

    let element = o[index];

    if (element['properties']['cpus'] != null) {
          const cpusId = element['properties']['cpus']['uniqueId'];
        console.log(cpusId);

        this.getMetric(cpusId, 'totalHz').then(extractJSON).then(totalHzData => {
          if (typeof totalHzData.data !== 'string') {
            this.getAvailableHostData(memory, cpus, storage, network, failed, element);
            // shouldStopFor = true;
            console.log(totalHzData.data);
          }else {
            this.tryNextItem(memory, cpus, storage, network, failed, o, index + 1);
          }
        });

    }else {
      this.tryNextItem(memory, cpus, storage, network, failed, o, index + 1);
    }
  }

  getCurrentHostMonitorInfo(memory: any, cpus: any, storage: any, network: any, failed: any) {

    httpPost('/api/v1/topology/query', 'application/json', '{"queryText": "!Host"}').then(extractJSON)
    .then(extractResponseModel)
    .then(o => {
      console.log('Data length: ' + o.data.length);

      this.tryNextItem(memory, cpus, storage, network, failed, o.data, 0);

    }).catch(error => {
      failed(error);
    });
  }



}
