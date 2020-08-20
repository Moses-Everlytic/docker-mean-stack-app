import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Docker Mean Stack APP';

  API = 'http://localhost:3000';

  user: any[] = [];

  userId = null;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(private http: HttpClient, private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });

  }

  addUser(email) {
    this.http.post(`${this.API}/user`, {email})
      .subscribe((repsonse: any) => {
        this.userId = repsonse.data.id;
        this.goToNextStep();
      })
  }

  updateUserName(name) {
    this.http.put(`${this.API}/user/${this.userId}`, {name})
      .subscribe(() => {
        this.goToNextStep();
      })
  }

  updateUserMobileNnmber(mobile) {
    this.http.put(`${this.API}/user/${this.userId}`, {mobile})
      .subscribe(() => {
        this.goToNextStep();
      })
  }


  getUser(userId) {
    this.http.get(`${this.API}/users/${this.userId}`)
      .subscribe((user: any) => {
        this.user = user
      })
  }


  goToNextStep() {

  }

  resetAll() {

  }
}
