import { Component, OnInit } from '@angular/core';
import { httpGet, extractJSON, httpPost, FORM_CONTENT_TYPE, HttpError } from '../Common/http';
import { ResponseModel } from '../models/response.model';
import { AlarmModel } from '../models/alarm.model';
import { DatePipe } from '@angular/common';
import { DashboardQueryService } from '../data.service.ts/dashboard-query.service';
declare function sparkline_charts(): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  alarmCount;
  chartDisplayData: string;
  constructor(public datepipe: DatePipe, private dataQueryService: DashboardQueryService) { }

  ngOnInit() {
    this.getHistoryAlarms();
    // this.query();
    this.dataQueryService.getCurrentHostMonitorInfo(memory => {
      console.log(memory);

    }, null);
  }

  getLastHours(hour: number): string[] {
    const results: string[] = [];
    const tmpDate = new Date();
    for (let i = 0; i < hour; i++) {

      const dateString = this.datepipe.transform(tmpDate, 'yyyyMMddHH');
      results.push(dateString);
      tmpDate.setHours(tmpDate.getHours() - 1);

    }
    return results.reverse();
  }

  getHistoryAlarms() {
    httpGet('/api/v1/alarm/history').then(extractJSON).then(o => {

      const result = o as ResponseModel<[AlarmModel]>;
      this.alarmCount = result.data.length;

      const timeData: {[date: string]: number} = {};

      const lastHours = this.getLastHours(48);
      console.log(lastHours);

      result.data.forEach(element => {
        const createdTime = new Date(element.createdTime);
        const dateString = this.datepipe.transform(createdTime, 'yyyyMMddHH');
        const tmp = timeData[dateString];

        if (tmp != null) {
          timeData[dateString] = tmp + 1;
        }else {
          timeData[dateString] = 0;
        }
      });

      const displayData: number[] = [];
      lastHours.forEach(item => {
        displayData.push(timeData[item] || 0);
      });

      const chartData = displayData.slice(displayData.length - 17, displayData.length - 1).join(',');
      console.log(chartData);
      this.chartDisplayData = chartData;
      setTimeout(sparkline_charts, 0.1);

      // let chartData

    }).catch(error => {

    });

  }

  query() {
    httpPost('/api/v1/topology/query', 'application/json', "{'queryText': '!Host'}").then(extractJSON).then(o => {
      console.log(o);

    }).catch(error => {

    });

  }


}



