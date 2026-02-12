import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';

interface QueryParams {
    [key: string]: any;
}

@Injectable({
    providedIn: 'root',
})
export class LandaService {
    apiURL = environment.apiURL;
    userToken: any;
    httpOptions: { headers?: HttpHeaders } = {};

    constructor(private http: HttpClient) { }

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
    DataGet(path: string, payloads: QueryParams = {}, isShowSpinner: boolean = false): Observable<any> {
        const clearParams: QueryParams = { ...payloads, isShowSpinner };

        // Remove null/undefined values
        const filteredParams: QueryParams = {};
        for (const key in clearParams) {
            if (clearParams[key] !== null && clearParams[key] !== undefined) {
                filteredParams[key] = clearParams[key];
            }
        }

        return this.http.get(this.apiURL + path, {
            params: filteredParams,
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
    DataPost(path: string, payloads: Record<string, any> = {}, showLoader = true) {
        const reqHeader = { ...this.httpOptions };

        const headers = {
            ...reqHeader.headers,
            ...(showLoader === false ? { 'X-Show-Loader': 'false' } : {})
        };

        return this.http.post(this.apiURL + path, payloads, { ...reqHeader, headers });
    }

    /**
     * Request PUT
     */
    DataPut(path: string, payloads: any = {}, isShowSpinner: boolean = true): Observable<any> {
        const body = { ...payloads, isShowSpinner };
        return this.http.put(this.apiURL + path, body, this.httpOptions);
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

    confirmSaveForm({
        title = 'Apakah anda yakin?',
        text = 'Apakah anda yakin ingin menyimpan pengisian ini?',
        confirmButtonText = 'Ya, Simpan Pengisian!',
        cancelButtonText = 'Tidak, Kembali ke form',
        reverseButtons = false
    }: {
        title?: string;
        text?: string;
        confirmButtonText?: string;
        cancelButtonText?: string;
        reverseButtons?: boolean;
    } = {}) {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons,
            customClass: {
                confirmButton: 'btn-primary-swal-full',
                cancelButton: 'btn-primary-swal-outline',
            },
        });
    }

    confirmCencelForm(
        title: string = 'Batalkan Pengisian?',
        text: string = 'Apakah anda yakin ingin membatalkan pengisian ini? Semua perubahan tidak akan tersimpan',
        confirmButtonText: string = 'Ya, Batalkan Pengisian!',
        cancelButtonText: string = 'Tidak, Kembali ke form'
    ) {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText,
            cancelButtonText,
            customClass: {
                confirmButton: 'btn-primary-swal-outline',
                cancelButton: 'btn-primary-swal-full',
            },
        });
    }

    confirmDeleteData({
        title = 'Apakah kamu yakin?',
        earlyText = 'Data ',
        text = ' ini tidak dapat diakses setelah kamu menghapus datanya',
        confirmButtonText = 'Ya, Hapus data ini!',
        cancelButtonText = 'Tidak, batal hapus data',
        menu = '',
        reverseButtons = true
    }: {
        title?: string;
        earlyText?: string;
        text?: string;
        confirmButtonText?: string;
        cancelButtonText?: string;
        menu?: string;
        reverseButtons?: boolean;
    } = {}) {
        const fullText = earlyText + menu + text;
        return Swal.fire({
            title,
            text: fullText,
            icon: 'warning',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText,
            cancelButtonText,
            reverseButtons,
            customClass: {
                confirmButton: 'btn-primary-swal-full',
                cancelButton: 'btn-primary-swal-outline',
            },
        });
    }
}