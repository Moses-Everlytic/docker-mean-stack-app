import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';

import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Docker Mean Stack APP';

  API = 'http://localhost:3000';

  user: User;

  userId = null;

  loader = false;
  isLinear = true;
  isEditable = false;
  email: FormGroup;
  name: FormGroup;
  mobile: FormGroup;

  errorMessage = null;
  mobileError = false;
  emailError = false;

  @ViewChild('stepper') private stepper: MatStepper;

  constructor(
    private http: HttpClient,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.email = this._formBuilder.group({
      email: ['', Validators.required]
    });
    this.name = this._formBuilder.group({
      name: ['', Validators.required]
    });
    this.mobile = this._formBuilder.group({
      mobile: ['', Validators.required]
    });

  }

  addUser(stepper): void {
    this.clearErrorMessage();

    const emailAdrress = this.email.value.email;

    if (!this.emailIsValid(emailAdrress)) {
      this.emailError = true;
      this.hideErrorDelay(this.emailError);
      return;
    }

    this.loader = true;

    this.http.post(`${this.API}/user`, {email: emailAdrress})
      .subscribe(
        (response: any) => {
          this.loader = false;

          if (response.status === 'error') {
            this.setErrorMessage(response.message);
          } else {
            this.userId = response.data.id;
            this.goToNextStep(stepper);
          }
        },
        error => {
          this.setErrorMessage('Connection error, unable to connect to server');
          this.loader = false;
        }
      );
  }

  addUserName(stepper): void {
    this.clearErrorMessage();

    const userName = this.name.value.name;

    if (!userName) {
      return;
    }

    this.loader = true;

    this.http.put(`${this.API}/user/${this.userId}`, {name: userName})
      .subscribe(
        (response: any) => {
          this.loader = false;

          if (response.status === 'error') {
            this.setErrorMessage(response.message);
          } else {
            this.goToNextStep(stepper);
          }
        },
        error => {
          this.setErrorMessage('Connection error, unable to connect to server');
          this.loader = false;
        }
      );
  }

  addUserMobileNnmber(stepper): void {
    this.clearErrorMessage();

    this.loader = true;

    const mobileNumber = this.mobile.value.mobile;

    if (!this.mobileNumberValidation(mobileNumber)) {
      this.loader = false;
      this.mobileError = true;
      this.hideErrorDelay(this.mobileError);

      return;
    }

    this.http.put(`${this.API}/user/${this.userId}`, {mobile: Number(mobileNumber)})
      .subscribe(
        (response: any) => {
          this.loader = false;

          if (response.status === 'error') {
            this.setErrorMessage(response.message);
          } else {
            this.goToNextStep(stepper);
            this.getUser();
          }
        },
        error => {
          this.setErrorMessage('Connection error, unable to connect to server');
          this.loader = false;
        }
      );
  }

  getUser(): void {
    this.clearErrorMessage();

    if (this.userId === null) {
      return;
    }

    this.loader = true;
    this.http.get<{ email: string; name: string; mobile: number }>(`${this.API}/user/${this.userId}`)
      .subscribe(
        data => {
          this.loader = false;

          this.user = {
            email: data.email,
            name: data.name,
            mobile: data.mobile
          };
        },
        error => {
          this.setErrorMessage('Connection error, unable to connect to server');
          this.loader = false;
        }
      );
  }

  emailIsValid(email): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  mobileNumberValidation(mobileNumber): boolean {
    return mobileNumber.length === 10;
  }

  hideErrorDelay(variableComponent): void {
    setTimeout(() => {
      variableComponent = false;
    }, 3000);
  }

  goToNextStep(stepper: MatStepper): void {
    this.stepper.next();
  }

  setErrorMessage(message): void {
    this.errorMessage = message;
  }

  clearErrorMessage(): void {
    this.errorMessage = null;
  }

  reset(stepper: MatStepper): void {
    this.user = null;
    this.stepper.reset();
  }
}
