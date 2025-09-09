import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly isBrowser: boolean;
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private checkStorageAvailability(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  setItem(key: string, value: any): boolean {
    if (!this.checkStorageAvailability()) {
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.checkStorageAvailability()) {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): boolean {
    if (!this.checkStorageAvailability()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  clear(): boolean {
    if (!this.checkStorageAvailability()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  hasItem(key: string): boolean {
    if (!this.checkStorageAvailability()) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  }

  getKeys(): string[] {
    if (!this.checkStorageAvailability()) {
      return [];
    }

    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  getSize(): number {
    if (!this.checkStorageAvailability()) {
      return 0;
    }
    return localStorage.length;
  }
}