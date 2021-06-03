import { Component, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../firebase-auth.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  signUpForm: FormGroup;
  submitError: string;
  authRedirectResult: Subscription;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ],
    'firstName': [
      { type: 'required', message: 'First Name is required.' }
    ],
    'lastName': [
      { type: 'required', message: 'Last Name is required.' }
    ],
  };

  constructor(
    public angularFire: AngularFireAuth,
    public router: Router,
    private ngZone: NgZone,
    private authService: FirebaseAuthService,
    private firestore: AngularFirestore
  ) {
    this.signUpForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      'firstName': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'lastName': new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
    // Get firebase authentication redirect result invoken when using signInWithRedirect()
    // signInWithRedirect() is only used when client is in web but not desktop
    this.authRedirectResult = this.authService.getRedirectResult()
    .subscribe(result => {
      if (result.user) {
        this.redirectLoggedUserToProfilePage();
      } else if (result.error) {
        this.submitError = result.error;
      }
    });
  }

  // Once the auth provider finished the authentication flow, and the auth redirect completes,
  // redirect the user to the profile page
  redirectLoggedUserToProfilePage() {
    // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
    // That's why we need to wrap the router navigation call inside an ngZone wrapper
    this.ngZone.run(() => {
      this.router.navigate(['tabs']);
    });
  }

  signUpWithEmail() {
    this.authService.signUpWithEmail(this.signUpForm.value['email'], this.signUpForm.value['password'])
    .then(user => {
      this.firestore.collection('users').doc(user.user.uid).set({
        email: user.user.email,
        firstName: this.signUpForm.value['firstName'],
        lastName: this.signUpForm.value['lastName'],
        fullName: `${this.signUpForm.value['firstName']} ${this.signUpForm.value['lastName']}`,
        uId: user.user.uid
      })

      // navigate to user profile
      this.redirectLoggedUserToProfilePage();
    })
    .catch(error => {
      this.submitError = error.message;
    });
  }
}
