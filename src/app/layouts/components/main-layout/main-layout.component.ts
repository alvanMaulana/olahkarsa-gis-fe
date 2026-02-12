import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { LayoutsService } from '../../services/layouts.service';
import { LayoutStateService } from '../../services/layout-state.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  is_close: boolean = false;
  is_close_notif: boolean = false;
  is_close_profil: boolean = false;

  max_length_message: number = 70;
  listNotifikasi: any = [];

  user = {
    id: null,
    name: '',
    email: null,
    role: null,
    avatar: '',
  };

  restEntitas: number = 0;
  firstEntitas: any = null;
  isClickNotif: boolean = false;
  unmarked_notifications = 0;
  sidebarOptions = 'General';
  public innerWidth: any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    public authService: AuthService,
    public layoutsService: LayoutsService,
    public layoutStateService: LayoutStateService,
  ) {
    // Subscribe to sidebar state dari service
    this.layoutStateService.isClosed$.subscribe(state => {
      this.is_close = state;
    });

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoutes();
      }
    });
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;

    // Inisialisasi state dari service
    this.is_close = this.layoutStateService.getCurrentState();

    this.getUser();
  }

  getUser() {
    this.layoutsService.getInformationProfile().subscribe((user: any) => {
      this.user.id = user.data.id;
      this.user.name = user.data.name;
      this.user.email = user.data.email;
      this.user.role = user.data.roles;
      this.user.avatar = user.data.avatar;

    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (innerWidth <= 1024) {
      this.layoutStateService.setSidebarState(true);
    } else {
      this.layoutStateService.setSidebarState(false);
    }

    if (innerWidth >= 485) {
      this.isClickNotif = false;
    }
  }

  logout() {
    this.authService.logout();
  }

  // Menggunakan service untuk toggle sidebar
  setClose() {
    this.layoutStateService.setClose();
  }

  // Menggunakan service untuk check dan close sidebar
  checkCloseSidebar() {
    this.layoutStateService.checkCloseSidebar();
  }

  setCloseProfil() {
    this.is_close_profil = !this.is_close_profil;
  }

  setCloseNotif() {
    this.is_close_notif = !this.is_close_notif;
    if (this.innerWidth <= 485) {
      this.isClickNotif = !this.isClickNotif;
    }
  }

  readNotif(val: any) {
    if (val.seen_by != null || val.seen_by != this.user.id) {
      // this.sidebarService.readNotif({ id: val.id }).subscribe((res: any) => {
      //   if (res.data.status) {
      //     this.getNotifikasi();
      //   }
      // });
    }
  }

  readAllNotif() {
    // this.sidebarService.readAllNotif({}).subscribe((res: any) => {
    //   if (res.data.status) {
    //     this.getNotifikasi();
    //   }
    // });
  }

  showActionNotif(id: any) {
    const hiddenDiv = document.getElementById("action-notif-" + id);

    if (hiddenDiv) {
      hiddenDiv.style.display = 'block';
    }
  }

  hideActionNotif(id: any) {
    const hiddenDiv = document.getElementById("action-notif-" + id);
    if (hiddenDiv) {
      hiddenDiv.style.display = 'none';
    }
  }

  setExpandMessage(val: any) {
    if (typeof (val.is_full) == 'undefined' || val.is_full == false) {
      val.is_full = true;
    } else {
      val.is_full = false;
    }
  }

  openNotif(val: any) {
    if (val.seen_by != null || val.seen_by != this.user.id) {
      // this.sidebarService.readNotif({ id: val.id }).subscribe((res: any) => {
      //   if (res.data.status) {
      //     window.location.href = val.url;
      //   }
      // });
    } else {
      window.location.href = val.url;
    }
  }


  checkRoutes() {
    const path = this.router.url.split('?')[0];

    if (this.matchPengaturanRoute(path, [
      'informasi-akun',
      'ganti-password'
    ])) {
      this.sidebarOptions = 'Pengaturan';
    } else {
      this.sidebarOptions = 'General';
    }
  }



  private matchPengaturanRoute(path: string, slugs: string[]): boolean {
    const slugPattern = slugs.join('|');
    const regex = new RegExp(
      `^/pengaturan/(${slugPattern})(/.*)?$`
    );

    return regex.test(path);
  }



}