import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LandaService } from 'src/app/core/services/landa.service';

@Component({
  selector: 'app-lupa-password',
  templateUrl: './lupa-password.component.html',
  styleUrls: ['./lupa-password.component.scss']
})
export class LupaPasswordComponent implements OnInit, OnDestroy {
  // Step Management
  currentStep: number = 1;

  // Loading State
  isLoading: boolean = false;

  // Form Models
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // OTP Management
  resetToken: string = '';
  maskedEmail: string = '';
  canResendOTP: boolean = false;
  canResendAt: Date | null = null;
  remainingSeconds: number = 0;
  private countdownSubscription: Subscription | null = null;

  // Password Visibility
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Password Validation
  passwordValidation = {
    minLength: false,
    hasUpperLower: false,
    hasNumber: false,
    hasSpecial: false
  };

  // Error Messages
  otpError: string = '';

  // Current Year
  currentYear: number = new Date().getFullYear();

  // Validation List
  validationList = {
    'email': 'Email',
    'otp': 'Kode OTP',
    'newPassword': 'Password baru',
    'confirmPassword': 'Konfirmasi password'
  };

  constructor(
    private authService: AuthService,
    private landaService: LandaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check session dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      this.checkSession(sessionId);
    }
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  // ==================== STEP 1: SEND OTP ====================
  sendOTP(): void {
    if (!this.validateEmail()) return;

    this.isLoading = true;

    this.authService.sendOTP(this.email).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.resetToken = response.data.reset_token;
        this.maskedEmail = response.data.masked_email;

        // Parse the can_resend_at string to Date object
        // this.canResendAt = new Date(response.data.can_resend_at);
        this.remainingSeconds = Math.floor(response.data.resend_in_seconds);

        this.landaService.alertSuccess('Berhasil', 'Kode OTP telah dikirim ke email Anda');
        this.currentStep = 2;

        // Start countdown setelah mendapatkan canResendAt dari server
        const sessionId = response.data.session_id;
        // Update URL dengan session_id
        window.history.replaceState({}, '', `/auth/lupa-password?session_id=${sessionId}`);

        this.startCountdown();
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Gagal mengirim OTP. Silakan coba lagi.';
        this.landaService.alertError('Gagal', errorMessage);
      }
    });
  }

  // ==================== STEP 2: VERIFY OTP ====================
  verifyOTP() {
    if (!this.validateOTP()) return;

    this.isLoading = true;
    this.otpError = '';

    const payload = {
      reset_token: this.resetToken,
      otp: this.otp
    };

    this.authService.verifyOTP(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.landaService.alertSuccess('Berhasil', 'Kode OTP valid. Silakan buat password baru.');
        this.currentStep = 3;
        this.stopCountdown();
      },
      error: (error) => {
        this.isLoading = false;
        this.otpError = error.error?.message || 'Kode OTP tidak valid atau sudah kadaluarsa';
      }
    });
  }

  // ==================== RESEND OTP ====================
  resendOTP() {
    if (!this.canResendOTP) return;

    this.isLoading = true;
    const payload = {
      reset_token: this.resetToken
    };

    this.authService.resendOTP(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // Parse the new can_resend_at from server response
        // this.canResendAt = new Date(response.data.can_resend_at);
        this.remainingSeconds = Math.floor(response.data.resend_in_seconds);
        this.canResendOTP = false;

        this.otp = '';
        this.otpError = '';
        this.clearValidationError('otp');

        // Clear OTP inputs
        this.otpArray = ['', '', '', '', '', ''];
        for (let i = 0; i < 6; i++) {
          const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
          if (input) input.value = '';
        }

        this.landaService.alertSuccess('Berhasil', 'Kode OTP baru telah dikirim ke email Anda');

        // Restart countdown dengan waktu baru dari server
        this.startCountdown();
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Gagal mengirim ulang OTP. Silakan coba lagi.';
        this.landaService.alertError('Gagal', errorMessage);
      }
    });
  }

  // ==================== STEP 3: RESET PASSWORD ====================
  resetPassword(): void {
    if (!this.validatePassword()) return;

    this.isLoading = true;
    const payload = {
      reset_token: this.resetToken,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.landaService.alertSuccess('Berhasil', 'Password Anda berhasil diubah. Silakan login dengan password baru.');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Gagal mengubah password. Silakan coba lagi.';
        this.landaService.alertError('Gagal', errorMessage);
      }
    });
  }

  // ==================== VALIDATION METHODS ====================
  validateEmail(): boolean {
    let isValid = true;

    // Check if empty
    if (!this.email || this.email.trim() === '') {
      this.setValidationError('email', 'Email wajib diisi');
      isValid = false;
    }
    // Check email format
    else if (!this.isValidEmail(this.email)) {
      this.setValidationError('email', 'Format email tidak valid');
      isValid = false;
    }
    else {
      this.clearValidationError('email');
    }

    return isValid;
  }

  validateOTP(): boolean {
    if (!this.otp || !/^\d{6}$/.test(this.otp)) {
      this.setValidationError('otp', 'Kode OTP harus 6 digit angka');
      return false;
    }
    this.clearValidationError('otp');
    return true;
  }


  validatePassword(): boolean {
    let isValid = true;

    // Validate new password
    if (!this.newPassword || this.newPassword.trim() === '') {
      this.setValidationError('newPassword', 'Password baru wajib diisi');
      isValid = false;
    }
    else if (!this.isPasswordValid()) {
      this.setValidationError('newPassword', 'Password tidak memenuhi syarat keamanan');
      isValid = false;
    }
    else {
      this.clearValidationError('newPassword');
    }

    // Validate confirm password
    if (!this.confirmPassword || this.confirmPassword.trim() === '') {
      this.setValidationError('confirmPassword', 'Konfirmasi password wajib diisi');
      isValid = false;
    }
    else if (this.newPassword !== this.confirmPassword) {
      this.setValidationError('confirmPassword', 'Password tidak cocok');
      isValid = false;
    }
    else {
      this.clearValidationError('confirmPassword');
    }

    return isValid;
  }

  setValidationError(fieldName: string, message: string): void {
    const element = document.getElementById(fieldName);
    if (element) {
      element.classList.add('is-invalid');
    }
    const errorElement = document.getElementById(fieldName + '_error');
    if (errorElement) {
      errorElement.innerHTML = message;
    }
  }

  clearValidationError(fieldName: string): void {
    const element = document.getElementById(fieldName);
    if (element) {
      element.classList.remove('is-invalid');
    }
    const errorElement = document.getElementById(fieldName + '_error');
    if (errorElement) {
      errorElement.innerHTML = '';
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ==================== PASSWORD VALIDATION ====================
  onPasswordChange(): void {
    this.validatePasswordStrength(this.newPassword);
  }

  validatePasswordStrength(value: string): void {
    if (!value) {
      this.passwordValidation = {
        minLength: false,
        hasUpperLower: false,
        hasNumber: false,
        hasSpecial: false
      };
      return;
    }

    this.passwordValidation = {
      minLength: value.length >= 8,
      hasUpperLower: /[A-Z]/.test(value) && /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
    };
  }

  isPasswordValid(): boolean {
    return Object.values(this.passwordValidation).every(v => v === true);
  }

  // ==================== COUNTDOWN MANAGEMENT ====================
  startCountdown(): void {
    this.stopCountdown();

    this.remainingSeconds = Math.floor(this.remainingSeconds);

    if (this.remainingSeconds <= 0) {
      this.canResendOTP = true;
      return;
    }

    this.canResendOTP = false;

    this.countdownSubscription = interval(1000).subscribe(() => {
      this.remainingSeconds--;

      if (this.remainingSeconds <= 0) {
        this.canResendOTP = true;
        this.stopCountdown();
      }
    });
  }


  stopCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private updateCanResendStatus(): void {
    if (!this.canResendAt) {
      this.canResendOTP = true;
      return;
    }

    const now = new Date();
    this.canResendOTP = now >= this.canResendAt;

    // Stop countdown ketika sudah bisa resend
    if (this.canResendOTP) {
      this.stopCountdown();
    }
  }

  formatCountdown(): string {
    const totalSeconds = Math.floor(this.remainingSeconds);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }


  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }


  // ==================== UI HELPERS ====================
  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  otpInputs = new Array(6);
  otpArray: string[] = ['', '', '', '', '', ''];

  onOtpInput(event: any, index: number): void {
    const value = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = value;

    this.otpArray[index] = value;
    this.otp = this.otpArray.join('');

    // Clear error ketika user mulai mengetik
    if (this.otpError) {
      this.otpError = '';
    }
    this.clearValidationError('otp');

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpArray[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pasteData = event.clipboardData?.getData('text') || '';
    if (!/^\d{6}$/.test(pasteData)) return;

    this.otpArray = pasteData.split('');
    this.otp = pasteData;

    // Clear error
    if (this.otpError) {
      this.otpError = '';
    }
    this.clearValidationError('otp');

    this.otpArray.forEach((digit, i) => {
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (input) input.value = digit;
    });

    const lastInput = document.getElementById('otp-5');
    lastInput?.focus();
  }

  backToEmail(): void {
    this.currentStep = 1;
    this.otp = '';
    this.otpError = '';
    this.otpArray = ['', '', '', '', '', ''];

    // Clear OTP inputs
    for (let i = 0; i < 6; i++) {
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (input) input.value = '';
    }

    this.clearValidationError('otp');
    this.stopCountdown();

    // Reset countdown variables
    this.canResendOTP = false;
    this.canResendAt = null;
  }

  checkSession(sessionId: string): void {
    this.authService.checkSession(sessionId).subscribe({
      next: (response: any) => {
        this.currentStep = response.data.step;
        this.resetToken = response.data.reset_token;
        this.maskedEmail = response.data.masked_email;
        this.remainingSeconds = response.data.resend_in_seconds;

        if (this.currentStep === 2) {
          this.startCountdown();
        }
      },
      error: () => {
        this.currentStep = 1;
      }
    });
  }
}