import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication.service';

import { DataBindingDirective, GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { SVGIcon, filePdfIcon, fileExcelIcon } from '@progress/kendo-svg-icons';
import { process } from '@progress/kendo-data-query';
import { CommonModule } from '@angular/common';

interface UserModelDetails {
  username: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  address: string;
  password: string | null;
  phoneNumber: string;
  userId: number;
  userRoleId: number;
  chatStatus: string;
}

@Component({
  selector: 'app-adminusers',
  standalone: true,
  imports: [GridModule, PDFModule, ExcelModule , CommonModule],
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.css']
})

export class AdminusersComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  @ViewChild('userDetailsModal') userDetailsModal!: TemplateRef<any>;
  public gridData: UserModelDetails[] = [];
  public gridView: UserModelDetails[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;
  public selectedUser: UserModelDetails | undefined;
  private modalRef!: NgbModalRef;

  constructor(private userService: AuthenticationService, private modalService: NgbModal) {}

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
    this.userService.getAllUsers().subscribe(
      (data: any[]) => {
        this.gridData = data;
        this.gridView = data;
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  public onFilter(value: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          { field: 'username', operator: 'contains', value },
          { field: 'userEmail', operator: 'contains', value },
          { field: 'phoneNumber', operator: 'contains', value },
          { field: 'address', operator: 'contains', value }
        ]
      }
    }).data;
    this.dataBinding.skip = 0;
  }

  viewUserDetails(user: UserModelDetails): void {
    this.selectedUser = user;
    this.modalRef = this.modalService.open(this.userDetailsModal, { size: 'lg', centered: true });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
