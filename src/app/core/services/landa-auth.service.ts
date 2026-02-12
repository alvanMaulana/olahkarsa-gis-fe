import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';
import { CookieService } from './cookie.service';
import { Router } from '@angular/router';

interface QueryParams {
    [key: string]: any;
}

@Injectable({
    providedIn: 'root',
})
export class LandaAuthService {
    apiURL = environment.apiAuthURL;
    userToken: any;
    httpOptions: { headers?: HttpHeaders } = {};
    dataCheckRole: any;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private router: Router,
    ) { }

    /**
     * Generate link downloader
     */
    DownloadLink(path: string, params: QueryParams = {}): void {
        const queryParams = new URLSearchParams(this.removeNull(params)).toString();
        window.open(this.apiURL + path + '?' + queryParams);
    }

    /**
     * Remove null data from query params
     */
    removeNull(params: QueryParams = {}): QueryParams {
        const filledParams: QueryParams = {};
        for (const key in params) {
            if (params[key] !== null && params[key] !== undefined) {
                filledParams[key] = params[key];
            }
        }
        return filledParams;
    }

    /**
     * Request GET
     */
    DataGet(path: string, payloads: QueryParams = {}): Observable<any> {
        const clearParams: QueryParams = {};
        for (const key in payloads) {
            if (payloads[key] !== null && payloads[key] !== undefined) {
                clearParams[key] = payloads[key];
            }
        }

        return this.http.get(this.apiURL + path, {
            params: clearParams,
        });
    }

    /**
     * Request GET for file download
     */
    DataDownload(path: string, payloads: QueryParams = {}): Observable<Blob> {
        const clearParams: QueryParams = {};
        for (const key in payloads) {
            if (payloads[key] !== null && payloads[key] !== undefined) {
                clearParams[key] = payloads[key];
            }
        }

        return this.http.get(this.apiURL + path, {
            params: clearParams,
            responseType: 'blob'
        });
    }

    /**
     * Request POST
     */
    DataPost(path: string, payloads: any = {}): Observable<any> {
        return this.http.post(this.apiURL + path, payloads, this.httpOptions);
    }

    /**
     * Request PUT
     */
    DataPut(path: string, payloads: any = {}): Observable<any> {
        return this.http.put(this.apiURL + path, payloads, this.httpOptions);
    }

    /**
     * Request DELETE
     */
    DataDelete(path: string, payloads: QueryParams = {}): Observable<any> {
        return this.http.delete(this.apiURL + path, {
            params: payloads,
        });
    }

    /**
     * Sweet alert Success
     */
    alertSuccess(title: string, content: string, timer: number = 3.5): void {
        Swal.fire({
            title,
            text: content,
            icon: 'success',
            timer: timer * 1000,
            showConfirmButton: true,
        });
    }

    /**
     * Sweet alert Warning
     */
    alertWarning(title: string, content: string, timer: number = 3.5): void {
        Swal.fire({
            title,
            text: content,
            icon: 'warning',
            timer: timer * 1000,
            showConfirmButton: true,
        });
    }

    /**
     * Sweet alert Info
     */
    alertInfo(title: string, content: string, timer: number = 3.5): void {
        Swal.fire({
            title,
            text: content,
            icon: 'info',
            timer: timer * 1000,
            showConfirmButton: true,
        });
    }

    /**
     * Sweet alert Error
     */
    alertError(title: string, content: string | string[] | object): void {
        let isi = '';
        if (Array.isArray(content)) {
            content.forEach((element) => {
                isi += `${element} <br>`;
            });
        } else if (typeof content === 'object') {
            for (const key in content) {
                isi += `${(content as any)[key]} <br>`;
            }
        } else {
            isi = String(content);
        }
        Swal.fire(title, isi, 'error');
    }

    toastError(title: string, content: string | string[] | object): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        let isi = '';
        if (Array.isArray(content)) {
            content.forEach((element) => {
                isi += `${element} <br>`;
            });
        } else if (typeof content === 'object') {
            for (const key in content) {
                isi += `${(content as any)[key]} <br>`;
            }
        } else {
            isi = String(content);
        }

        const isiBaru = '<div style="word-wrap: break-word;">' + isi + '</div>';

        Toast.fire({
            icon: 'error',
            html: isiBaru,
            title: title,
        });
    }

    toastSuccess(title: string, content: string): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: 'success',
            title: title,
            text: content
        });
    }

    toastWarning(content: string): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: 'warning',
            title: "Peringatan",
            text: content
        });
    }

    toastInfo(content: string): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: 'info',
            title: "Informasi",
            text: content
        });
    }

    checkUpdateRole(): void {
        const data = this.cookieService.getCookie('is_check_role_updated');

        if (data !== '1') {
            this.DataGet("/v1/check-updated-role", {}).subscribe({
                next: (res) => {
                    this.dataCheckRole = res;
                    if (this.dataCheckRole?.status === true) {
                        Swal.fire({
                            title: 'Sesuaikan sekarang?',
                            text: 'Terdapat pembaharuan modul atau permission',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya, Sesuaikan',
                            cancelButtonText: 'Tidak, nanti saja',
                            customClass: {
                                confirmButton: 'btn-primary-swal-full',
                                cancelButton: 'btn-primary-swal-outline',
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.router.navigate(['/settings/role']);
                            }
                            this.cookieService.setCookieSession('is_check_role_updated', '1');
                        });
                    } else {
                        this.cookieService.setCookieSession('is_check_role_updated', '0');
                    }
                },
                error: (err) => {
                    console.error('Failed to check updated role:', err);
                }
            });
        }
    }

    checkLogLoginUser(name_module: string = ''): void {
        if (name_module !== '') {
            const keyName = 'module_' + name_module;
            const today = new Date().toISOString().split('T')[0];
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 2);
            const cutoffDate = threeDaysAgo.toISOString().split('T')[0];

            const data = this.cookieService.getCookie(keyName);
            let parsedData: string[] = data ? JSON.parse(data) : [];

            // Filter data berdasarkan tanggal cutoff
            parsedData = parsedData.filter(date => date >= cutoffDate);

            // Periksa apakah hari ini belum ada di cookie
            if (!parsedData.includes(today)) {
                // Lakukan POST request
                this.DataPost("/v1/logUserLogin", { moduleName: name_module }).subscribe({
                    next: () => {
                        // Tambahkan tanggal hari ini setelah request berhasil
                        parsedData.push(today);
                        this.cookieService.setCookieSession(keyName, JSON.stringify(parsedData));
                    },
                    error: (err) => {
                        console.error('Failed to log user login:', err);
                    }
                });
            }
        }
    }
}