import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  firstname = '';
  lastname = '';
  totalVisits: number | null = null;
  todayVisits: number | null = null;
  visitsByWeek: { label: string, value: number }[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private stats: StatisticsService
  ) {
    const user = this.auth.getUser();
    if (user) {
      this.firstname = user.firstname;
      this.lastname = user.lastname;
    }
  }

  ngOnInit() {
    this.stats.getTotalVisits().subscribe(v => this.totalVisits = v);
    this.stats.getTodayVisits().subscribe(v => this.todayVisits = v);
    this.stats.getVisitsByPeriod('week').subscribe(data => {
      // data doit être un tableau [{ label: 'Semaine 1', value: 123 }, ...]
      this.visitsByWeek = data;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
} 