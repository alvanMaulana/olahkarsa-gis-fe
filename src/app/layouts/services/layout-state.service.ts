import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {
  // BehaviorSubject untuk reactive state
  private isClosedSubject = new BehaviorSubject<boolean>(this.getInitialState());
  public isClosed$: Observable<boolean> = this.isClosedSubject.asObservable();

  constructor() { }

  /**
   * Mendapatkan initial state dari localStorage
   */
  private getInitialState(): boolean {
    const innerWidth = window.innerWidth;
    const storedValue = localStorage.getItem('is_close_side_bar');

    if (innerWidth <= 1024 || storedValue === '1') {
      return true;
    }
    return false;
  }

  /**
   * Toggle sidebar state
   */
  setClose(): void {
    const currentState = this.isClosedSubject.value;
    const newState = !currentState;

    // Update localStorage
    localStorage.setItem('is_close_side_bar', newState ? '1' : '0');

    // Emit new state
    this.isClosedSubject.next(newState);
  }

  /**
   * Set sidebar state secara eksplisit
   */
  setSidebarState(isClosed: boolean): void {
    localStorage.setItem('is_close_side_bar', isClosed ? '1' : '0');
    this.isClosedSubject.next(isClosed);
  }

  /**
   * Get current state (synchronous)
   */
  getCurrentState(): boolean {
    return this.isClosedSubject.value;
  }

  /**
   * Check dan close sidebar jika layar kecil
   */
  checkCloseSidebar(): void {
    const innerWidth = window.innerWidth;
    if (!this.isClosedSubject.value && innerWidth <= 1024) {
      this.setClose();
    }
  }
}