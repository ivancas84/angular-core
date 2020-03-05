import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showDanger(message: string){
    this.show(message, { classname: 'bg-danger text-light', delay: 7500 });
  }

  showSuccess(message: string){
    this.show(message, { classname: 'bg-success text-light', delay: 7500 });
  }

  showInfo(message: string){
    this.show(message, { classname: 'bg-primary text-light', delay: 7500 });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}