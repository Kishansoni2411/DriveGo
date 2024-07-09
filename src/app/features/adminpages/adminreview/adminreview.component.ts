import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { ReviewService } from '../../../services/review.service';

import { DataBindingDirective, GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { SVGIcon, filePdfIcon, fileExcelIcon } from '@progress/kendo-svg-icons';
import { process } from '@progress/kendo-data-query';
import { CommonModule } from '@angular/common';

interface ReviewModel {
  reviewId: number;
  userId: number;
  userName: string;
  rating: number;
  description: string;
  createdAt: string;
}

@Component({
  selector: 'app-adminreview',
  standalone: true,
  imports: [GridModule, PDFModule, ExcelModule , CommonModule],
  templateUrl: './adminreview.component.html',
  styleUrl: './adminreview.component.css'
})
export class AdminreviewComponent implements OnInit {
  public gridData: ReviewModel[] = [];
  public gridView: ReviewModel[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviewData();
  }
  ngAfterViewInit(): void {
    this.removeKendoInvalidLicance();
  }

  removeKendoInvalidLicance() {
    setTimeout(() => {
      // Remove the banner with the unique text content
      const banner = Array.from(document.querySelectorAll('div')).find((el) =>
        el.textContent?.includes('No valid license found for Kendo UI for Angular')
      );
      if (banner) banner.remove();
  
      // Remove the watermark element
      const watermarkElement = document.querySelector('div[kendowatermarkoverlay]');
      if (watermarkElement) {
        watermarkElement.remove();
        console.log('Watermark removed successfully.');
      } else {
        console.log('Watermark element not found.');
      }
    }, 0); 
  }

  loadReviewData(): void {
    this.reviewService.getAllReviews().subscribe(
      (data: ReviewModel[]) => {
        this.gridData = data;
        this.gridView = data;
      },
      (error: any) => {
        console.error('Error fetching review data:', error);
      }
    );
  }

}









