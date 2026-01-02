import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Consumir el Seed que ya probamos en Azure
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Consumir la lógica del Scanner
  scanBarcode(barcode: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/scanner/${barcode}`);
  }
}