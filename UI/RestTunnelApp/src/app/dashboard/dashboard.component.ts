import { Component, OnInit } from '@angular/core';
import { httpGet, extractJSON, httpPost, FORM_CONTENT_TYPE, HttpError } from '../Common/http';
import { ResponseModel } from '../models/response.model';
import { AlarmModel } from '../models/alarm.model';
import { DatePipe } from '@angular/common';
import { DashboardQueryService } from '../data.service.ts/dashboard-query.service';
import { MemoryInfoModel } from '../models/memory-info.model';
import $ from 'jquery';
import 'jquery-easy-loading';
// import 'gasparesganga-jquery-loading-overlay';
import { loading } from 'jquery-easy-loading';


declare function sparkline_charts();
declare function circle_progess(elementId);
declare function charts(alamsData, axisData);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  alarmCount;
  chartDisplayData: string;

  memoryTotal: number;
  memoryUtilization: number;

  cpusUtilization: number;
  cpusTotal: number;

  storageUtilization: number;
  storageTotal: number;

  networkUtilization: number;
  networkBandwidth: number;

  totalRules: number;
  totalCartridges: number;
  totalAgents: number;
  loadingElement: string[] = [
                          'memory_circleStatsItemBox',
                          'storage_circleStatsItemBox',
                          'cpus_circleStatsItemBox',
                          'alarm-count',
                          'total-rules',
                          'total-cartridges',
                          'total-agents',
                          'stats-chart-box'
                        ];
  id: any;

  constructor(public datepipe: DatePipe, private dataQueryService: DashboardQueryService) { }

  ngOnInit() {
    this.createLoadingOverlay();
    this.getHistoryAlarms();
    this.getHostInfo();
    this.getRules();
    this.getCartridges();
    this.getAgents();
  }

  createLoadingOverlay() {


    this.loadingElement.forEach(value => {
      $('#' + value).loading('start');
    });

    window.addEventListener('resize', () => {

      this.loadingElement.forEach(value => {
         $('#' + value).loading('resize');
      });

    });

    window.addEventListener('resize', () => {
        clearTimeout(this.id);
        this.id = setTimeout(() => {
          this.loadingElement.forEach(value => {
          $('#' + value).loading('resize');
          });
        }, 500);
      });
    // $(window).resize(function() {
    //   clearTimeout(window.resizedFinished);
    //   window.resizedFinished = setTimeout(function(){
    //     this.loadingElement.forEach(value => {

    //       $('#' + value).loading('resize');

    //   });
    // }, 250);
    // });

    // });
  }

  getAgents() {
    httpGet('/api/v1/agent/allAgents').then(extractJSON).then(o => {
      this.totalAgents = o.data.length;
      setTimeout(function() {
        $('#total-agents').loading('stop');
      }, 0.1);
    });
  }

  getCartridges() {
    httpGet('/api/v1/cartridge/allCartridges').then(extractJSON).then(o => {
      this.totalRules = o.data.length;
      setTimeout(function() {
        $('#total-cartridges').loading('stop');
      }, 0.1);
    });

  }

  getRules() {
    httpGet('/api/v1/rule/allRules').then(extractJSON).then(o => {
      this.totalCartridges = o.data.length;
      setTimeout(function() {
        $('#total-rules').loading('stop');
      }, 0.1);
    });

  }

  getHostInfo() {

    // $("#memory_circleStatsItemBox").LoadingOverlay("show");

// Here we might call the "hide" action 2 times, or simply set the "force" parameter to true:

    this.dataQueryService.getCurrentHostMonitorInfo(memory => {
      console.log(memory);

      this.memoryUtilization = memory.utilization;
      this.memoryTotal = memory.total / 1024.0;

      // setTimeout(circle_progess, 0.1);
      setTimeout( () => {
        circle_progess('memory');
        $('#memory_circleStatsItemBox').loading('stop');
        // $("#memory_circleStatsItemBox").LoadingOverlay("hide", true);
      }, 0.1);
    }, cpus => {
      this.cpusUtilization = cpus.utilization;
      this.cpusTotal = cpus.total / 1000.0;
      setTimeout( () => {
        circle_progess('cpus');
        $('#cpus_circleStatsItemBox').loading('stop');
      }, 0.1);
      // setTimeout(circle_progess, 0.1);
    }, storage => {
      console.log('storage utilization:' + storage.utilization);

      this.storageUtilization = storage.utilization;
      this.storageTotal = storage.total / 1024.0;

      setTimeout( () => {
        circle_progess('storage');
        $('#storage_circleStatsItemBox').loading('stop');
      }, 0.1);
    }, network => {
      this.networkBandwidth = network.bandwidth;
      this.networkUtilization = network.utilization;

      setTimeout(function() {
        circle_progess('network');
      }, 0.1);
    }, failed => {

    });

    setTimeout(function() {
        circle_progess('network');
      }, 0.1);
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

      const lastHours = this.getLastHours(24);
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

      // Slice 16 hours for mini chart.
      const chartData = displayData.slice(displayData.length - 14, displayData.length - 1).join(',');
      console.log(chartData);
      this.chartDisplayData = chartData;



      let bigChartData = [];
      let axisData = [];
      // console.log(lastHours.join(','));

      lastHours.forEach((item, index) => {
        const tempList = [index, displayData[index]];
        // console.log(item.substr(8, 2) + '-' + displayData[index]);

        bigChartData.push(tempList);
        axisData.push([index, item.substr(8, 2)]);


      });

      // console.log(axisData);

      setTimeout(() => {
        sparkline_charts();

        charts(bigChartData, axisData);
        $('#stats-chart-box').loading('stop');
        $('#alarm-count').loading('stop');
      }, 0.1);

    }).catch(error => {

    });

  }

  query() {
    httpPost('/api/v1/topology/query', 'application/json', '{"queryText": "!Host"}').then(extractJSON).then(o => {
      console.log(o);

    }).catch(error => {

    });

  }

  ngOnDestroy() {

    $('.loading-overlay').hide();
  }

}



