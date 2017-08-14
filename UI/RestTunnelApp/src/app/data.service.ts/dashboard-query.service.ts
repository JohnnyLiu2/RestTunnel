
import { Injectable } from '@angular/core';
import { httpPost, extractJSON, httpGet, Response } from '../Common/http';

@Injectable()
export class DashboardQueryService {
 getMetric(uniqueId: string, metricName: string): Promise<Response> {
    return httpGet('/api/v1/topology/' + uniqueId + '/' + metricName + '/current');
  }

  getCurrentHostMonitorInfo(memory: any, cpus: any) {
    httpPost('/api/v1/topology/query', 'application/json', '{"queryText": "!Host"}').then(extractJSON).then(o => {
      console.log(o);
      const property = o.data[0]['properties'];
      const memoryId = property['memory']['uniqueId'];


      this.getMetric(memoryId, 'consumed').then(extractJSON).then(consumedData =>
        this.getMetric(memoryId, 'utilization').then(extractJSON).then(utilizationData =>
          this.getMetric(memoryId, 'freeMemory').then(extractJSON).then(freeMemoryData => {
            if (memory) {
              memory({
                consumed: consumedData.data['properties']['average'],
                freeMemory: freeMemoryData.data['properties']['average'],
                utilization: utilizationData.data['properties']['average'],
                totalMemory: parseFloat(consumedData.data['properties']['average']) +
                parseFloat(freeMemoryData.data['properties']['average'])
              });
            }
          })
        )
      );

      const cpusId = property['cpus']['uniqueId'];

      const storage = property['storage']['uniqueid'];


    }).catch(error => {

    });
  }



}
