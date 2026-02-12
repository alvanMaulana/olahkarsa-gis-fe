import { Component, OnInit } from '@angular/core';
import { ManagementAdminService } from '../../services/management-admin.service';
import { LandaService } from 'src/app/core/services/landa.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-management-admin',
  templateUrl: './form-management-admin.component.html',
  styleUrls: ['./form-management-admin.component.scss']
})
export class FormManagementAdminComponent {

  readonly MODE_CREATE = 'create';
  readonly MODE_UPDATE = 'update';
  activeMode: 'create' | 'update' = 'create';

  dataId: any;
  isSubmitting = false;
  listAllRole = [];
  formModel = {
    id: null,
    name: '',
    email: '',
    password: '',
    roles: null
  };
  showPassword: boolean = false;



  constructor(
    private managementAdminService: ManagementAdminService,
    private landaService: LandaService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.dataId = this.route.snapshot.paramMap.get('id');
    this.getDataId();
    this.getListAllRRoles();

    this.emptyForm();
    if (this.dataId) {
      this.activeMode = this.MODE_UPDATE;
      this.getDataId();
    } else {
      this.activeMode = this.MODE_CREATE;
    }
  }

  emptyForm() {
    this.formModel = {
      id: null,
      name: '',
      email: '',
      password: '',
      roles: null
    };


    this.existingAvatar = [];
  }

  getDataId() {
    if (!this.dataId) return;

    this.managementAdminService.getUsersById(this.dataId).subscribe((res: any) => {
      const user = res.data;

      this.formModel = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        roles: user.roles?.[0] ?? null,
      };

      if (user.avatar) {
        const fileName = user.avatar.split('/').pop();
        this.existingAvatar = [
          {
            id: user.id, // pakai user id (opsional, aman)
            path_file: user.avatar, // URL disimpan sebagai path
            name: fileName,
            size: 0, // dummy, karena backend tidak kirim
            preview: user.avatar,
            isExisting: true
          }
        ];
      }
    });
  }


  getListAllRRoles() {
    this.managementAdminService.getWithoutPaginateRoles().subscribe((res: any) => {
      this.listAllRole = res.data;
    }, err => {
      console.log(err);
    });
  }


  saveForm() {
    switch (this.activeMode) {
      case this.MODE_CREATE:
        this.insert();
        break;
      case this.MODE_UPDATE:
        this.update();
        break;
    }
  }


  insert() {
    this.isSubmitting = true;

    const payload = {
      name: this.formModel.name,
      email: this.formModel.email,
      password: this.formModel.password || undefined,
      roles: [this.formModel.roles],
      avatar_files: this.avatarFiles
    };

    this.managementAdminService.createUsers(payload).subscribe({
      next: (res: any) => {
        this.router.navigate(['/management-admin']);
        this.landaService.toastSuccess('Berhasil', 'Data user berhasil ditambahkan');
      },
      error: (err: any) => {
        this.isSubmitting = false;

        if (err?.error?.message) {
          this.landaService.toastError('Login gagal', err.error.message);
        } else {
          this.landaService.toastError('Login gagal', 'Terjadi kesalahan');
        }
      }
    });
  }

  update() {
    this.isSubmitting = true;

    const payload = {
      id: this.formModel.id,
      name: this.formModel.name,
      email: this.formModel.email,
      password: this.formModel.password || undefined,
      roles: [this.formModel.roles],
      avatar_files: this.avatarFiles
    };

    this.managementAdminService.updateUsers(payload).subscribe({
      next: (res: any) => {
        this.router.navigate(['/management-admin']);
        this.landaService.toastSuccess('Berhasil', 'Data user berhasil diubah');
      },
      error: (err: any) => {
        this.isSubmitting = false;

        if (err?.error?.message) {
          this.landaService.toastError('Login gagal', err.error.message);
        } else {
          this.landaService.toastError('Login gagal', 'Terjadi kesalahan');
        }
      }
    });
  }

  goToList(): void {
    this.landaService
      .confirmCencelForm()
      .then((result) => {
        if (!result.value) return;
        this.router.navigate(['/management-admin']);
      });
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  checkValidasi() {

  }


  // Method untuk handle file
  avatarFiles: any[] = [];
  existingAvatar: any[] = [];
  onAvatarChange(files: any[]) {
    this.avatarFiles = files;
    console.log('Avatar files changed:', files);
  }








}