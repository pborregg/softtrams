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
    styleUrls: ['./member-details.component.css'],
})
export class MemberDetailsComponent
    implements OnInit, OnChanges, AfterViewInit {
    public memberModel: Member;
    public memberForm: FormGroup;
    public submitted = false;
    public alertType: String;
    public alertMessage: String;
    public teams = [];

    constructor(
        private fb: FormBuilder,
        private appService: AppService,
        private router: Router
    ) { }

    ngOnInit() {
        this.appService.getTeams().subscribe((team: any[]) => (this.teams = team));
        this.memberForm = this.createFormGroup();
    }

    ngOnChanges() { }

    ngAfterViewInit() {

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
        this.appService.setFullName(
            this.memberModel.firstName,
            this.memberModel.lastName
        );
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
