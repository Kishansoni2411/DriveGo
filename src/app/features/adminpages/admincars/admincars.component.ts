import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CarService, Car } from '../../../services/cars.service'; // Adjust the path as needed
import { DataBindingDirective, ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { SVGIcon, filePdfIcon, fileExcelIcon } from '@progress/kendo-svg-icons';
import { process } from '@progress/kendo-data-query';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserModel } from '../../../model/UserModel';


@Component({
  selector: 'app-admincars',
  standalone: true,
  imports: [GridModule, PDFModule, ExcelModule ],
  templateUrl: './admincars.component.html',
  styleUrls: ['./admincars.component.css']
})
export class AdmincarsComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  
  public gridData: Car[] = [];
  public gridView: Car[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;
  public selectedCar: Car | undefined;
 public owner: UserModel | null = null; 
 

  constructor(private carService: CarService ,private modalService: NgbModal ,private userService: AuthenticationService) {}

  @ViewChild('carDetailsModal', { static: true }) carDetailsModal!: TemplateRef<any>;
  private modalRef!: NgbModalRef

  ngOnInit(): void {
    this.loadGridData();
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
  

  loadGridData(): void {
    this.carService.getCars().subscribe(
      (data: Car[]) => {
        this.gridData = data;
        this.gridView = data;
        console.log(data);
      },
      (error : any) => {
        console.error('Error fetching car data:', error);
      }
    );
  }

  public onFilter(value: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          { field: 'vehicleNumber', operator: 'contains', value },
          { field: 'carType', operator: 'contains', value },
          { field: 'company', operator: 'contains', value },
          { field: 'model', operator: 'contains', value },
          { field: 'gearType', operator: 'contains', value },
          { field: 'fuelType', operator: 'contains', value },
          { field: 'color', operator: 'contains', value },
          { field: 'status', operator: 'contains', value }
        ],
      },
    }).data;
    this.dataBinding.skip = 0;
  }

  fetchOwnerDetails(userId: number): void {
    this.userService.getUserDetails(userId).subscribe(
      (data: any) => {
        this.owner = data;
      },
      (error: any) => {
        console.log("error");
      }
    );
  }


  viewCarDetails(car: Car): void {
    this.selectedCar = car;
    this.fetchOwnerDetails(car.userId);  // Fetch owner details when a car is selected
    this.modalRef = this.modalService.open(this.carDetailsModal, { size: 'lg', centered: true });
  }



  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      // this.modalRef = null;
    }
    // this.selectedCar = null;
    // this.owner = null;
    // this.error = null;
  }
 
}
