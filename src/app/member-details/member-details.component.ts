import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

// This interface may be useful in the times ahead...
interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges, AfterViewInit {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];

  private racingTeams = [];

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) { }

  ngOnInit() {
    this.racingTeams.push(this.appService.getTeams().subscribe(team => (this.teams = team)));
  }

  ngOnChanges() { }

  ngAfterViewInit() {
    console.log('Teams', this.racingTeams);
  }

  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    this.memberModel = form.value;
  }

  goBackToMembers(): void {
    this.router.navigate(['/members']);
  }
}
