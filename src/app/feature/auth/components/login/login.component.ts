import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LandaService } from '../../../../core/services/landa.service';

interface ValidationList {
  [key: string]: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  isSubmitting: boolean = false;
  is_submit_first_form: boolean = false;
  showPassword: boolean = false;
  token_firebase: any;

  listValidasi: ValidationList = {
    'email': 'email',
    'password': 'password',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private landaService: LandaService
  ) { }

  ngOnInit(): void {
    // Check if user already logged in
    if (this.authService.getToken()) {
      this.router.navigate(['/admin']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  loginForm(): void {
    this.is_submit_first_form = true;
    if (this.checkValidasi()) {
      this.login();
    }
  }

  login(): void {
    if (!this.email || !this.password) {
      this.landaService.toastError('Error', 'Email dan password wajib diisi');
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.email, this.password, this.token_firebase).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.data.access_token).then(() => {
          this.authService.saveUserLogin();
          this.router.navigate(['/admin']);
        });
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

  checkValidasi(): boolean {
    let isset_empty_form = false;

    Object.keys(this.listValidasi).forEach((val: string) => {
      const element = document.getElementById(val);
      const errorElement = document.getElementById(val + "_error");

      if (!element || !errorElement) {
        console.warn(`Element with id '${val}' or '${val}_error' not found`);
        return;
      }

      const fieldValue = (this as any)[val];
      const isEmptyField = (fieldValue === null || fieldValue === '') && this.is_submit_first_form;

      if (isEmptyField) {
        isset_empty_form = true;

        // PENGECEKAN UNTUK NGSELECT 
        if (element.children.length > 0) {
          const child = element.children[0];
          if (child.tagName === 'DIV') {
            child.classList.add('has-danger');
          }
        } else {
          element.classList.add('has-danger');
        }

        errorElement.innerHTML = `field ${this.listValidasi[val]} wajib diisi`;
      } else {
        // Remove error styling
        if (element.children.length > 0) {
          const child = element.children[0];
          if (child.tagName === 'DIV') {
            child.classList.remove('has-danger');
          }
        } else {
          element.classList.remove('has-danger');
        }

        errorElement.innerHTML = '';
      }
    });

    return !isset_empty_form;
  }

  goToHome(): void {
    window.location.href = 'https://pdash.esgdashboard.id/auth/login';
  }
}