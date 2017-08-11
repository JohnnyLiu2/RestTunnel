import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[app-box-chart]',
  templateUrl: './box-chart.component.html',
  styleUrls: ['./box-chart.component.css']
})
export class BoxChartComponent implements OnInit {
  @Input() title: string;
  @Input() totalNumber: number;
  @Input() chartData: string;
  constructor() { }

  ngOnInit() {
  }

}
