import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { LoaderService } from '../services/loader.service';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    private readonly TIMEOUT_THRESHOLD = 60000; // 60 detik
    private readonly ALERT_KEYS = {
        TIMEOUT: 'timeoutAlertShow',
        OFFLINE: 'offlineAlertShow'
    };

    // Queue untuk menyimpan error yang sedang ditampilkan
    private activeAlerts = new Set<string>();

    // Debounce untuk alert yang sama
    private alertTimers = new Map<string, any>();
    private readonly ALERT_DEBOUNCE_TIME = 3000; // 3 detik

    constructor(
        private authService: AuthService,
        private router: Router,
        private loaderService: LoaderService
    ) {
        this.initializeAlertCleanup();
    }

    private initializeAlertCleanup(): void {
        // Hapus alert saat halaman dimuat
        window.addEventListener('load', () => this.clearAlertFlags());

        // Hapus alert saat navigasi rute berubah
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.clearAlertFlags();
                this.clearActiveAlerts();
            }
        });
    }

    private clearAlertFlags(): void {
        Object.values(this.ALERT_KEYS).forEach(key =>
            sessionStorage.removeItem(key)
        );
    }

    private clearActiveAlerts(): void {
        this.activeAlerts.clear();
        this.alertTimers.forEach(timer => clearTimeout(timer));
        this.alertTimers.clear();
    }

    /**
     * Tampilkan alert dengan pencegahan spam
     * @param alertKey - Unique key untuk alert (misal: 'offline', 'timeout', 'rate-limit')
     * @param title - Judul alert
     * @param text - Isi pesan alert
     * @param icon - Icon alert
     * @param debounce - Apakah menggunakan debounce (default: true)
     */
    private showAlert(
        alertKey: string,
        title: string,
        text: string,
        icon: 'warning' | 'error' = 'warning',
        debounce: boolean = true
    ): void {
        // Cek apakah alert dengan key yang sama sedang aktif
        if (this.activeAlerts.has(alertKey)) {
            return;
        }

        // Jika menggunakan debounce, cek apakah ada timer yang sedang berjalan
        if (debounce && this.alertTimers.has(alertKey)) {
            return;
        }

        // Tandai alert sebagai aktif
        this.activeAlerts.add(alertKey);

        // Set debounce timer
        if (debounce) {
            const timer = setTimeout(() => {
                this.alertTimers.delete(alertKey);
            }, this.ALERT_DEBOUNCE_TIME);
            this.alertTimers.set(alertKey, timer);
        }

        Swal.fire({
            title,
            text,
            icon,
            showCancelButton: false,
            confirmButtonColor: '#34c38f',
            confirmButtonText: 'OK',
        }).then(() => {
            // Hapus dari active alerts setelah ditutup
            this.activeAlerts.delete(alertKey);
        });
    }

    /**
     * Tampilkan alert dengan confirmasi dan callback
     */
    private showConfirmAlert(
        alertKey: string,
        title: string,
        text: string,
        confirmText: string,
        callback: () => void
    ): void {
        // Cek apakah alert dengan key yang sama sedang aktif
        if (this.activeAlerts.has(alertKey)) {
            return;
        }

        this.activeAlerts.add(alertKey);

        Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#34c38f',
            confirmButtonText: confirmText,
        }).then((result) => {
            this.activeAlerts.delete(alertKey);
            if (result.isConfirmed) {
                callback();
            }
        });
    }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const startTime = Date.now();

        if (!navigator.onLine) {
            return throwError(() => new Error('No Internet Connection'));
        }

        // Tampilkan loader untuk metode tertentu (kecuali ada header X-No-Spinner)
        if (!request.headers.has('X-No-Spinner') &&
            ['PUT', 'POST', 'DELETE'].includes(request.method)) {
            this.loaderService.show();
        }

        // Clone request dengan headers yang diperlukan
        request = this.addHeaders(request);

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error, request.url)),
            finalize(() => this.handleFinalize(startTime))
        );
    }

    private addHeaders(request: HttpRequest<unknown>): HttpRequest<unknown> {
        const token = this.authService.getToken();
        const tokenCsrf = this.authService.getCsrf();

        let clonedRequest = request;

        // Tambahkan Authorization header jika token ada
        if (token) {
            clonedRequest = clonedRequest.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }

        // Jangan set Content-Type untuk FormData (biarkan Angular yang handle)
        if (request.body instanceof FormData) {
            return clonedRequest.clone({
                setHeaders: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': tokenCsrf
                }
            });
        }

        // Set headers untuk request biasa
        return clonedRequest.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': tokenCsrf
            }
        });
    }

    private handleError(error: HttpErrorResponse, url: string): Observable<never> {

        // 🔹 422 VALIDATION → BIARKAN LEWAT KE COMPONENT
        if (error.status === 422) {
            return throwError(error);
        }

        // 🔹 429 RATE LIMIT
        if (error.status === 429) {
            this.showAlert(
                'rate-limit-429',
                'Mohon Maaf',
                'Terlalu banyak permintaan. Silakan coba lagi nanti.',
                'warning'
            );
            return throwError(error);
        }

        // 🔹 401 UNAUTHORIZED
        if (error.status === 401) {
            this.handleUnauthorized();
            return throwError(error);
        }

        // 🔹 403 FORBIDDEN
        if (error.status === 403) {
            this.handleForbidden(error);
            return throwError(error);
        }

        // 🔹 500 SERVER ERROR
        if (error.status === 500) {
            this.showAlert(
                'server-error-500',
                'Terjadi Kesalahan Server',
                'Mohon maaf, terjadi kesalahan pada server.',
                'error'
            );
            return throwError(error);
        }

        // 🔹 DEFAULT
        return throwError(error);
    }


    private handleUnauthorized(): void {
        // Gunakan key spesifik untuk unauthorized agar hanya muncul sekali
        if (this.activeAlerts.has('unauthorized-401')) {
            return;
        }

        this.activeAlerts.add('unauthorized-401');
        this.authService.logout();
        this.router.navigate(['/auth/login']).then(() => {
            window.location.reload();
        });
    }

    private handleForbidden(error: HttpErrorResponse): void {
        const errorMessage = error.error?.message ||
            error.error?.errors?.[0] ||
            'Anda tidak memiliki akses untuk melakukan tindakan ini.';

        this.showConfirmAlert(
            'forbidden-403',
            'Akses Ditolak',
            errorMessage,
            'Login Ulang',
            () => {
                this.authService.logout();
                this.router.navigate(['/auth/login']).then(() => {
                    window.location.reload();
                });
            }
        );
    }

    private handleFinalize(startTime: number): void {
        const duration = Date.now() - startTime;

        // Tampilkan alert timeout jika request melebihi threshold
        if (duration > this.TIMEOUT_THRESHOLD &&
            !sessionStorage.getItem(this.ALERT_KEYS.TIMEOUT)) {
            this.showAlert(
                'request-timeout',
                'Waktu Permintaan Habis',
                'Pastikan koneksi Wi-Fi atau data seluler Anda stabil, lalu coba lagi.',
                'warning'
            );
            sessionStorage.setItem(this.ALERT_KEYS.TIMEOUT, 'true');
        }

        this.loaderService.hide();
    }
}