import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AppService {
    api = 'http://localhost:8000/api';
    username: string;
    fullname: string;
    firstname: string;
    lastname: string;
    members: any[] = [];

    public allMembers: any;
    public membersListSubject = new BehaviorSubject(this.allMembers);
    public membersMessages = this.membersListSubject.asObservable();

    constructor(
        private http: HttpClient
    ) { }

    // Returns all members
    getMembers() {

        // const pathToURL = `${this.api}/members`;
        // const self = this;


        return this.http
            .get(`${this.api}/members`)
            .pipe(catchError(this.handleError));

        // return this.http.get(pathToURL).subscribe(
        //     (response: any) => {
        //         console.log('Post SUCCESS got new Member Message Response: ', response);
        //         this.members.push(response);
        //     }, (error: any) => {
        //         console.error('Post New Member Message Error: ', error);
        //         self.handleError(error);
        //         this.members.push(error);
        //     }
        // );

    }

    setUsername(name: string): void {
        this.username = name;
    }

    setFullName(fname: string, lname: string) {
        this.fullname = fname + ' ' + lname;
        console.log('FULL NAME: ' + this.fullname);
    }

    getFullname(userid: number): string {
        console.log('Incoming USERID: ', userid);
        return this.fullname;
    }

    addMember(memberForm: any): Promise<Object> {

        const pathToURL = `${this.api}/addMember`;
        const self = this;
        console.log('New Member to add!: ', memberForm);

        // return this.http
        //   .post(pathToURL, memberForm)
        //   .pipe(catchError(this.handleError));

        // let data = JSON.stringify(memberForm);
        const data = memberForm;

        console.log('DATA GOING IN: ', data);

        return new Promise((resolve, reject) => {
            this.http.post<Object>(pathToURL, data).subscribe(
                (response: any) => {
                    if (data.length > 0) {
                        if (response === '') {
                            response = 'SUCCESS!';
                        }
                        console.log('Post SUCCESS Add Member Message Response: ', data);
                        this.members.push(data);
                        resolve(data);
                    }
                }, (error: any) => {
                    console.error('Post New Member Message Error: ', error);
                    reject(error);
                    self.handleError(error);
                }
            );
        });
    }

    getTeams() {

        const self = this;
        const pathToURL = `${this.api}/teams`;

        return this.http
            .get(pathToURL)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): any[] {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
        }
        return [];
    }
}
