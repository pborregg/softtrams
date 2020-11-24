import { Members } from './../members';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  public members = [];

  constructor(
    public appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
    this.appService.getMembers().subscribe((members: any[]) => (this.members = members));
  }

  goToAddMemberForm() {
    this.router.navigate(['/member-details']);
  }

  editMemberByID(id: number) { }

  deleteMemberById(id: number) { }

}
