import { Component, inject } from '@angular/core';
import { FormBuilder, ValidationErrors , AbstractControl, ValidatorFn, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule , CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] ,
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

// Fonction personnalisée pour comparer les deux mots de passe
  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;

    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }

    return null; // 👍 Tout va bien
  };
  // Formulaire avec validation personnalisée
  registerForm: FormGroup = this.fb.nonNullable.group(
    {
      firstname: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2)
      ]),

      lastname: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2)
      ]),

      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email
      ]),

      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(6)
      ]),

      confirmPassword: this.fb.nonNullable.control('', [
        Validators.required
      ]),
    },
    {
      validators: this.passwordsMatchValidator
    }
  );

  serverError: string | null = null;
  successMessage: string | null = null;

  onSubmit(): void {
    this.serverError = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstname, lastname, email, password } = this.registerForm.value;

    const payload = { firstname, lastname, email, password };

    this.authService.register(payload).subscribe({
      next: () => {
        this.successMessage = '🎉 Inscription réussie ! Vous allez être redirigé vers la page de connexion...';

        // Redirection automatique après 3s
        setTimeout(() => {
          this.router.navigate(['/login']).then((success) => {
            if (success) {
              console.log("✅ Navigation réussie vers /login");
            } else {
              console.error("❌ Échec de la navigation vers /login");
            }
          });
        }, 3000);

      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.message) {
          this.serverError = error.error.message;
        } else {
          this.serverError = "Une erreur est survenue. Veuillez réessayer plus tard.";
        }
      }
    });
  }


  // Getters pour les champs de formulaire
  public get firstnameControl() {
    return this.registerForm.get('firstname');
  }
  public get lastnameControl() {
    return this.registerForm.get('lastname');
  }
  public get emailControl() {
    return this.registerForm.get('email');
  }
  public get passwordControl() {
    return this.registerForm.get('password');
  }
  public get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }
}
