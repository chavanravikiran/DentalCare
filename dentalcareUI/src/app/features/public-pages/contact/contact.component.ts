import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements AfterViewInit {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  successMessage = '';
  errorMessage = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Intersection Observer for animations
    const elements = this.el.nativeElement.querySelectorAll('.animate-fade-in-up');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach((el: Element) => observer.observe(el));
  }

  sendMessage(): void {
    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.showSuccessMessage = false;
    this.showErrorMessage = false;

    // Simulate API call
    console.log('✅ Message envoyé :', this.formData);

    // Simulate async operation
    setTimeout(() => {
      try {
        // Here you would normally make an HTTP call to your backend
        // For now, we'll simulate a successful response

        this.showSuccessMessage = true;
        this.successMessage = 'Your message has been sent successfully! We will reply as soon as possible.';

        // Reset form after successful submission
        this.resetForm();

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);

      } catch (error) {
        this.showErrorMessage = true;
        this.errorMessage = 'An error occurred while sending your message. Please try again.';

        // Hide error message after 5 seconds
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 5000);
      } finally {
        this.isSubmitting = false;
      }
    }, 1500); // Simulate network delay
  }

  private validateForm(): boolean {
    // Reset previous error states
    this.showErrorMessage = false;

    // Check required fields
    if (!this.formData.name.trim()) {
      this.showError('Name is required.');
      return false;
    }

    if (!this.formData.email.trim()) {
      this.showError('L\'email is required.');
      return false;
    }

    if (!this.isValidEmail(this.formData.email)) {
      this.showError('Please enter a valid email address.');
      return false;
    }

    if (!this.formData.subject.trim()) {
      this.showError('The subject is required.');
      return false;
    }

    if (!this.formData.message.trim()) {
      this.showError('The message is required.');
      return false;
    }

    if (this.formData.message.trim().length < 10) {
      this.showError('The message must contain at least 10 characters.');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.showErrorMessage = true;

    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.showErrorMessage = false;
    }, 5000);
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }

  // Method to handle phone number formatting (optional)
  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.startsWith('91')) {
      value = '+' + value;
    } else if (value.startsWith('0')) {
      value = '+91' + value.substring(1);
    } else if (value.length > 0 && !value.startsWith('+')) {
      value = '+91' + value;
    }

    this.formData.phone = value;
  }

  // Method to track form interaction for analytics (optional)
  onFieldFocus(fieldName: string): void {
    console.log(`User focused on ${fieldName} field`);
    // You can implement analytics tracking here
  }

  // Method to handle emergency call
  callEmergency(): void {
    window.location.href = 'tel:+212600000000';
  }

  // Method to open email client
  sendEmail(): void {
    window.location.href = 'mailto:ravi&#64;dentalcare.ma?subject=Contact via the website';
  }
}
