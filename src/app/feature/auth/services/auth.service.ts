import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from 'src/app/core/services/state.service';
import { LandaService } from '../../../core/services/landa.service'
import { Router, NavigationEnd } from '@angular/router';
import { LandaAuthService } from 'src/app/core/services/landa-auth.service';
import { CookieService } from 'src/app/core/services/cookie.service';
import Swal from 'sweetalert2';

const initialState = {
    userLogin: {
        id: '',
        nama: '',
        email: '',
        user_profile: '',
        company_id: '',
        company_name: '',
        foto: '',
        access: '',
        feature: '',
        default_pass: ''
    },
};

@Injectable({
    providedIn: 'root'
})


export class AuthService extends StateService<any> {
    userLogin: Observable<any> = this.select(state => state.userLogin);
    token_firebase: any;


    private userLoginData: any = null;

    constructor(
        private landaService: LandaService,
        private landaAuthService: LandaAuthService,
        // private messagingService: MessagingService,
        private router: Router,
        private cookieService: CookieService

    ) { super(initialState); }

    // checkAccess(access: String) {
    //     let userLogin: any;
    //     this.getProfile().subscribe((user: any) => (userLogin = user));
    //     if (userLogin.id == '') {
    //         return false;
    //     }

    //     if (userLogin?.permissions?.includes(access)) {
    //         return true;
    //     }

    //     return false;
    // }

    checkAccess(access: string): boolean {

        if (!this.userLoginData?.id) {
            return false;
        }

        return this.userLoginData?.permissions?.includes(access);
    }



    /**
     * Request login
     */
    login(email: string, password: string, token_firebase: any) {
        return this.landaAuthService.DataPost('/v1/auth/login', {
            email: email,
            password: password,
            token_firebase: token_firebase
        });
    }

    /**
     * Ambil token CSRF dari server dan simpan di localStorage
     */
    saveCsrf() {
        this.landaAuthService.DataGet('/v1/auth/csrf').subscribe((res: any) => {
            return new Promise((resolve, reject) => {
                localStorage.setItem('csrf', res.data);
                resolve(true);
            });
        });
    }

    /**
     * Ambil token CSRF dari localStorage
     */
    getCsrf() {
        const token = localStorage.getItem('csrf');
        if (token) {
            return token;
        }

        return '';
    }

    /**
     * Logout
     */
    logout() {
        // this.messagingService.getToken().then((data: any) => {
        //     this.landaAuthService.DataPost('/v1/auth/logout', {
        //         // token_firebase: data
        //     }).subscribe((res: any) => {
        this.removeToken();
        this.setState({
            userLogin: {
                id: '',
                nama: '',
                email: '',
                user_profile: '',
                company_id: '',
                company_name: '',
                foto: '',
                access: '',
                feature: '',
                default_pass: ''
            },
        });
        window.location.href = '/auth/login';
        // this.router.navigate(['auth/login']);
        localStorage.removeItem('recently_search');
        localStorage.removeItem('subscribe_date');
        localStorage.removeItem('companyConfig');
        localStorage.removeItem('active_uuid_program');
        this.cookieService.deleteCookie('module_mne');
        this.cookieService.deleteCookie('module_sim');

        // });
        // });

    }

    /**
     * Ambil profile user yang login dari state management
     */
    getProfile() {
        return this.select(state => state.userLogin);
    }

    /**
     * Ambil user yang login ke server
     * dan simpan di RxJS
     */
    saveUserLogin() {
        return this.landaAuthService.DataGet('/v1/auth/profile').subscribe((res: any) => {
            if (localStorage.getItem('identifier') == null) {
                localStorage.setItem('identifier', btoa(res.data.email));
            }

            this.userLoginData = res.data;
            this.setState({ userLogin: res.data });
        });
    }


    saveUserLoginCheckEntitas() {
        this.landaAuthService.DataGet('/v1/auth/profile').subscribe((res: any) => {
            const subsidiaries = res?.data?.list_subsidiary || [];

            if (subsidiaries.length === 0) {
                Swal.fire({
                    title: 'Mohon maaf',
                    text: 'Anda belum memiliki entitas. Silakan hubungi admin untuk melakukan pengaturan.',
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'Coba Lagi',
                    cancelButtonText: 'Logout',
                    reverseButtons: true,
                    allowOutsideClick: true, // user bisa menutup popup dengan klik di luar
                    allowEscapeKey: true, // bisa tutup pakai ESC
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Jika klik "Coba Lagi"
                        this.saveUserLoginCheckEntitas();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Jika klik "Logout"
                        this.logout(); // pastikan fungsi logout ada
                    } else if (
                        result.dismiss === Swal.DismissReason.backdrop ||
                        result.dismiss === Swal.DismissReason.esc ||
                        result.dismiss === Swal.DismissReason.close
                    ) {
                        // Jika user menutup alert (klik di luar, ESC, atau tombol close)
                        this.saveUserLoginCheckEntitas();
                    }
                });

                return;
            }

            // Jika sudah ada subsidiary, lanjutkan proses normal
            if (!localStorage.getItem('identifier')) {
                localStorage.setItem('identifier', btoa(res.data.email));
            }

            this.userLoginData = res.data;
            this.setState({ userLogin: res.data });
        });
    }




    /**
    * Simpan token user ke localstorage
    */
    saveToken(payload: any) {
        return new Promise((resolve, reject) => {
            localStorage.setItem('user', payload);
            resolve(true);
        });
    }

    /**
   * Simpan refresh token user ke localstorage
   */
    saveRefreshToken(payload: any) {
        return new Promise((resolve, reject) => {
            localStorage.setItem('refresh_token', payload);
            resolve(true);
        });
    }

    /**
     * Hapus user dari local Storage
     */
    removeToken() {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('user');
            resolve(true);
        });
    }

    /**
     * Ambil token user dari localstorage
     */
    getToken() {
        const token = localStorage.getItem('user');
        if (token) {
            return token;
        }

        return '';
    }

    // sendMailForgetPass(payload) {
    //     return this.landaAuthService.DataPost('/v1/sendMailForgetPass', payload);
    // }
    // sendMailAgain(payload) {
    //     return this.landaAuthService.DataPost('/v1/sendMailAgain', payload);
    // }
    // checkOTP(payload) {
    //     return this.landaAuthService.DataPost('/v1/checkOTP', payload);
    // }
    // updateGantiPassword(payload) {
    //     return this.landaAuthService.DataPost('/v1/updateGantiPass', payload);
    // }
    // checkCountdownOTP(arrParameter = {}) {
    //     return this.landaAuthService.DataGet('/v1/checkCountdownOTP', arrParameter);
    // }
    setStatusFailedLogin(payload: any) {
        return this.landaAuthService.DataPost('/v1/setStatusFailedLogin', payload);
    }
    setSuspendAkun(payload: any) {
        return this.landaAuthService.DataPost('/v1/setSuspendAkun', payload);
    }
    getAkunByEmail(arrParameter: any) {
        return this.landaAuthService.DataGet('/v1/getAkunByEmail', arrParameter);
    }




    sendOTP(email: string): Observable<any> {
        const payload = { email };
        return this.landaAuthService.DataPost('/v1/forgot-password/send-otp', payload);
    }

    verifyOTP(payload: { reset_token: string; otp: string }): Observable<any> {
        return this.landaAuthService.DataPost('/v1/forgot-password/verify-otp', payload);
    }

    resendOTP(payload: any) {
        return this.landaAuthService.DataPost('/v1/forgot-password/resend-otp', payload);
    }

    resetPassword(payload: {
        reset_token: string;
        new_password: string;
        new_password_confirmation: string
    }): Observable<any> {
        return this.landaAuthService.DataPost('/v1/forgot-password/reset-password', payload);
    }

    checkOTPCountdown(reset_token: string): Observable<any> {
        return this.landaAuthService.DataGet('/v1/forgot-password/check-countdown', { reset_token });
    }

    checkSession(sessionId: string): Observable<any> {
        return this.landaAuthService.DataGet(`/v1/forgot-password/check-session?session_id=${sessionId}`);
    }
}
