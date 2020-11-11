import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    this.memberForm = this.createFormGroup();
  }

  ngOnChanges() { }

  ngAfterViewInit() {
    console.log('Teams', this.racingTeams);
  }

  createFormGroup() {
    return new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      jobTitle: new FormControl(''),
      team: new FormControl(''),
      status: new FormControl(''),
    });
  }

  // TODO: Add member to members
  onSubmit(form: FormGroup) {

    let retVal: any;

    this.memberModel = form.value;
    console.log('Form: ', this.memberModel);
    this.appService.setFullName(this.memberModel.firstName, this.memberModel.lastName);
    retVal = this.appService.addMember(this.memberModel);

    if (retVal) {
      this.goBackToMembers();
    } else {
      // oops!
      console.log('ERROR: There was an error saving a member!');
    }
  }

  revert(): void {
    this.memberForm.reset();
  }

  goBackToMembers(): void {
    this.router.navigate(['/members']);
  }
}
