import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ManagementAdminService } from '../../services/management-admin.service';
import { LandaService } from 'src/app/core/services/landa.service';

@Component({
  selector: 'app-list-management-admin',
  templateUrl: './list-management-admin.component.html',
  styleUrls: ['./list-management-admin.component.scss']
})
export class ListManagementAdminComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  listDataTables: any[] = [];

  filter = {
    keyword: '',
    role: null,
    status: null
  };
  listAllRoles: any[] = [];
  listAllStatus = [
    { id: '1', name: 'Aktif' },
    { id: '0', name: 'Nonaktif' },
  ];
  formModelRoles = {
    id: null,
    name: '',
    email: '',
    avatar: '',
    roles: '',
    roles_new: '',
  }

  constructor(
    private managementAdminService: ManagementAdminService,
    private landaService: LandaService,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getListAllRRoles();
  }

  isEmptyDataTable = false;
  getData() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      searching: false,
      language: {
        searchPlaceholder: 'Cari Pilar',
        search: "",
        lengthMenu: 'Tampilkan _MENU_ entri',
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Berikutnya",
          previous: "Sebelumnya",
        },
        info: "Memperlihatkan _START_ hingga _END_ dari _TOTAL_ entri",
        infoEmpty: "Memperlihatkan 0 hingga 0 dari 0 entri",
      },
      pageLength: 10,
      lengthMenu: [2, 5, 10, 20, 50],
      ajax: (dtParams: any, callback) => {
        const params = {
          role: this.filter.role,
          is_active: this.filter.status,
          keyword: this.filter.keyword,
          per_page: dtParams.length,
          page: (dtParams.start / dtParams.length) + 1,
        };

        this.managementAdminService.getUsers(params).subscribe((res: any) => {
          const { list, meta } = res.data;
          this.isEmptyDataTable = list.length === 0;


          let number = dtParams.start + 1;
          list.forEach((val: any) => (val.no = number++));
          this.listDataTables = list;

          callback({
            recordsTotal: meta.total,
            recordsFiltered: meta.total,
            data: [],
          });

        }, (err: any) => {
          console.log(err);

        });
      },
    };
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  applyFilter() {
    const keyword = this.filter.keyword?.trim() || '';

    if (keyword.length === 0) {
      this.reloadDataTable();
      return;
    }

    if (keyword.length >= 3) {
      this.reloadDataTable();
    }
  }

  getListAllRRoles() {
    this.managementAdminService.getWithoutPaginateRoles().subscribe((res: any) => {
      this.listAllRoles = res.data;
    }, err => {
      console.log(err);
    });
  }

  deleteData(id: any): void {
    this.landaService
      .confirmDeleteData({ menu: 'User' })
      .then((result) => {
        if (!result.value) return;

        this.managementAdminService.deleteUsers(id).subscribe({
          next: (res: any) => {
            this.landaService.toastSuccess('Berhasil', 'Data user berhasil dihapus');
            this.reloadDataTable();
          },
          error: (err: any) => {
            this.landaService.toastError('Mohon Maaf', err.error?.errors || 'Terjadi kesalahan');
          }
        });
      });
  }




  emptyFormRoles() {
    this.formModelRoles = {
      id: null,
      name: '',
      email: '',
      avatar: '',
      roles: '',
      roles_new: '',
    }
  }

  toggleStatus(user: any) {
    // Balik status
    user.is_active = !user.is_active;

    // Contoh request ke API untuk update status user
    this.managementAdminService.updateStatus({ id: user.id, is_active: user.is_active }).subscribe({
      next: (res) => {
        this.landaService.toastSuccess('Berhasil', 'Status berhasil diubah');
      },
      error: (err) => {
        this.landaService.toastError('Login gagal', 'Terjadi kesalahan');

        // rollback jika gagal
        user.is_active = !user.is_active;
      }
    });
  }


}
