import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private apiUrl = 'http://localhost:3001/statistics';

  constructor(private http: HttpClient) {}

  getTotalVisits(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`);
  }

  getTodayVisits(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/today`);
  }

  getVisitsByPeriod(period: 'week' | 'month'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-period?period=${period}`);
  }
} 