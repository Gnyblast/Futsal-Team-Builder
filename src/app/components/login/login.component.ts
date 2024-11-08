import { Component } from "@angular/core";
import { User } from "@angular/fire/auth";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  protected dialogResponse: string = "";
  protected notVerified: boolean = false;
  protected loginShow: boolean = true;
  private user: User | null = null;
  protected loggingIn: boolean = false;

  protected loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email]),
    password: new FormControl<string>("", [Validators.required]),
  });

  protected resetForm: FormGroup = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email]),
  });

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  public loginWithGooogle(): void {
    this.loggingIn = true
    this.authService.googleSignIn().then(() => {
     this.loggingIn = false 
    });
  }

  public login(): void {
    this.notVerified = false;
    this.dialogResponse = "";
    if (!this.loginForm.controls["email"].valid) {
      this.dialogResponse = "Invalid email address";
      return;
    }

    if (!this.loginForm.valid) {
      this.dialogResponse = "Invalid form";
      return;
    }

    this.loggingIn = true;
    this.authService
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
      .then((creds) => {
        this.loggingIn = false;
        if (!creds.user) {
          this.dialogResponse = "Invalid credentials!";
          return;
        }

        if (!creds.user.emailVerified) {
          this.notVerified = true;
          this.user = creds.user;
          this.dialogResponse = "Verify your email address!";
          return;
        }

        this.dialog.closeAll();
      });
  }

  public resetPassword(): void {
    if (!this.resetForm.valid) {
      this.dialogResponse = "Invalid email address!";
      return;
    }

    this.authService.resetPassword(this.resetForm.value.email).then((creds) => {
      this.dialogResponse = "Email sent!";
      this.loginShow = true;
    });
  }

  public resendEmail(): void {
    if (this.user) {
      this.authService.resendVerify(this.user);
      this.dialogResponse = "Email Re-sent!";
      return;
    }

    this.dialogResponse = "Something went wrong!";
  }
}
