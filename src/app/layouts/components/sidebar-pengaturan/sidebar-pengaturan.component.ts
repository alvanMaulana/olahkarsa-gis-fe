import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/feature/auth/services/auth.service';
// import { SidebarService } from '../sidebar/services/sidebar.service';
import { LandaAuthService } from 'src/app/core/services/landa-auth.service';
import { filter } from 'rxjs/operators';
import { LayoutStateService } from '../../services/layout-state.service';

@Component({
  selector: 'app-sidebar-pengaturan',
  templateUrl: './sidebar-pengaturan.component.html',
  styleUrls: ['./sidebar-pengaturan.component.scss']
})
export class SidebarPengaturanComponent implements OnInit {

  @Input() is_close = false;

  // Tooltip position
  followedElementTop = 0;
  fixedElementTop = 0;

  // State
  is_close_notif = false;
  is_close_logNotif = false;
  is_close_dataprogram = true;
  is_close_publikasi = true;
  is_close_laporan = true;
  is_close_profil = false;
  is_link_publikasi = false;

  active_program_id: string | null = null;
  configCompany: any;

  private routerSub!: Subscription;
  private sidebarStateSub!: Subscription;

  constructor(
    private router: Router,
    public authService: AuthService,
    public layoutStateService: LayoutStateService,
  ) { }


  // =========================
  // Lifecycle
  // =========================
  dataId!: string;
  ngOnInit(): void {
    this.getProgramActive();
    this.handleInitialRoute();
    this.listenRouter();
    this.subscribeSidebarState();
  }


  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.sidebarStateSub) this.sidebarStateSub.unsubscribe();
  }

  // =========================
  // Router
  // =========================
  private listenRouter(): void {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkUrlProgram(event.url);
        this.getProgramActive();
        this.checkCloseSidebar();
      }
    });
  }

  private handleInitialRoute(): void {
    const url = window.location.href;
    this.checkUrlProgram(url);
    this.getProgramActive();
  }

  // =========================
  // Hover Tooltip
  // =========================
  onHover(name: string): void {
    const trigger = document.querySelector(`.trigger_${name}`) as HTMLElement;
    const tooltip = document.querySelector(`.element_${name}`) as HTMLElement;

    if (!trigger || !tooltip) return;

    const triggerTop = trigger.getBoundingClientRect().top + 25;
    this.followedElementTop = triggerTop;
    this.fixedElementTop = triggerTop;

    tooltip.style.display = 'block';

  }

  onHoverOut(name: string): void {
    const tooltip = document.querySelector(`.element_${name}`) as HTMLElement;
    if (tooltip) tooltip.style.display = 'none';
  }

  // =========================
  // Helpers
  // =========================
  checkUrlProgram(url: string): void {
    this.is_close_dataprogram = !url.includes('program');
  }

  getProgramActive(): void {
    this.active_program_id = localStorage.getItem('active_program_id');
  }

  setCloseDataProgram(): void {
    this.active_program_id = null;
    localStorage.removeItem('active_program_id');
  }

  setClosePublikasi(): void {
    this.is_close_publikasi = !this.is_close_publikasi;
  }

  setCloseLaporan(): void {
    this.is_close_laporan = !this.is_close_laporan;
  }



  private subscribeSidebarState(): void {
    this.sidebarStateSub = this.layoutStateService.isClosed$.subscribe(state => {
      this.is_close = state; // Update property lokal
    });
  }

  // Toggle sidebar
  setClose(): void {
    this.layoutStateService.setClose();
  }

  // Tutup sidebar
  closeSidebar(): void {
    this.layoutStateService.setSidebarState(true);
  }

  // Buka sidebar
  openSidebar(): void {
    this.layoutStateService.setSidebarState(false);
  }

  // Check dan tutup jika mobile
  checkCloseSidebar(): void {
    this.layoutStateService.checkCloseSidebar();
  }
}

