import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit, AfterViewInit {
  totalUsers: number = 0;
  totalCars: number = 0;
  totalReviews: number = 0;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadTotals();
  }

  ngAfterViewInit(): void {
    this.loadUserChart();
    this.loadCarChart();
    this.loadCarTypeChart();
    this.loadReviewsOverTimeChart();
    this.loadReviewsByRatingChart();
  }

  loadTotals(): void {
    this.dashboardService.getTotals().subscribe(
      (data: any) => {
        this.totalUsers = data.totalUsers;
        this.totalCars = data.totalCars;
        this.totalReviews = data.totalReviews;
      },
      (error: any) => {
        console.error('Error fetching totals', error);
      }
    );
  }

  loadUserChart(): void {
    this.dashboardService.getUsersPerMonth().subscribe((data: any) => {
      const labels = data.map((item: any) => item.month);
      const values = data.map((item: any) => item.userCount);

      this.renderBarChart('userChart', labels, values, 'Total Registered Users');
    });
  }

  loadCarChart(): void {
    this.dashboardService.getCarsPerMonth().subscribe((data: any) => {
      const labels = data.map((item: any) => item.month);
      const values = data.map((item: any) => item.carCount);

      this.renderLineChart('carChart', labels, values, 'Total Registered Cars');
    });
  }

  loadCarTypeChart(): void {
    this.dashboardService.getCarTypes().subscribe((data: any) => {
      const labels = data.map((item: any) => item.carType);
      const values = data.map((item: any) => item.count);

      this.renderPieChart('carTypeChart', labels, values, 'Car Types');
    });
  }

  loadReviewsOverTimeChart(): void {
    this.dashboardService.getReviewsOverTime().subscribe((data: any) => {
      const labels = data.map((item: any) => item.month);
      const values = data.map((item: any) => item.reviewCount);

      this.renderLineChart('reviewsOverTimeChart', labels, values, 'Reviews Over Time');
    });
  }

  loadReviewsByRatingChart(): void {
    this.dashboardService.getReviewsByRating().subscribe((data: any) => {
      const labels = data.map((item: any) => `Rating ${item.rating}`);
      const values = data.map((item: any) => item.count);

      this.renderPieChart('reviewsByRatingChart', labels, values, 'Reviews by Rating');
    });
  }

  renderBarChart(elementId: string, labels: string[], values: number[], title: string): void {
    const chartDom = document.getElementById(elementId) as HTMLDivElement;
    const chart = echarts.init(chartDom);
    const option = {
      title: {
        text: title
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: labels
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: values,
        type: 'bar',
        itemStyle: {
          color: 'rgba(75, 192, 192, 0.2)'
        }
      }]
    };
    chart.setOption(option);
  }

  renderLineChart(elementId: string, labels: string[], values: number[], title: string): void {
    const chartDom = document.getElementById(elementId) as HTMLDivElement;
    const chart = echarts.init(chartDom);
    const option = {
      title: {
        text: title
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: labels
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: values,
        type: 'line',
        itemStyle: {
          color: 'rgba(75, 192, 192, 0.2)'
        }
      }]
    };
    chart.setOption(option);
  }

  renderPieChart(elementId: string, labels: string[], values: number[], title: string): void {
    const chartDom = document.getElementById(elementId) as HTMLDivElement;
    const chart = echarts.init(chartDom);
    const option = {
      title: {
        text: title,
        // left: 'center',
        top: '10%',
        textStyle: {
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '20%',
      },
      series: [{
        name: title,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%'
        },
        labelLine: {
          show: true
        },
        data: labels.map((label, index) => ({
          value: values[index],
          name: label
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    chart.setOption(option);
  }
}
