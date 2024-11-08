import {Component} from "@angular/core";
import {User} from "@angular/fire/auth";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  protected dialogResponse: string = "";
  protected notVerified: boolean = false;
  private user: User | null = null;
  protected registering: boolean = false;

  constructor(private authService: AuthService) {}

  protected registerForm: FormGroup = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email]),
    password: new FormControl<string>("", [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/),
    ]),
    password_confirm: new FormControl<string>("", [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/),
    ]),
  });

  public loginWithGooogle(): void {
    this.registering = true;
    this.authService.googleSignIn().then(() => {
      this.registering = false;
    });
  }

  public register(): void {
    this.notVerified = false;
    this.dialogResponse = "";

    if (!this.registerForm.controls["email"].valid) {
      this.dialogResponse = "Invalid email address!";
      return;
    }

    if (!this.registerForm.controls["password"].valid) {
      this.dialogResponse = "Invalid password!";
      return;
    }

    if (
      this.registerForm.controls["password"].value !==
      this.registerForm.controls["password_confirm"].value
    ) {
      this.dialogResponse = "Password are not a match!";
      return;
    }

    this.registering = true;
    this.authService
      .signUp(this.registerForm.value.email, this.registerForm.value.password)
      .then((creds) => {
        this.registering = false;
        if (!creds.user) {
          this.dialogResponse = "Something went wrong!";
          return;
        }

        this.user = creds.user;
        this.dialogResponse = "Please verify your email address!";
        this.notVerified = true;
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

  protected getToolTipText(): string {
    return "Min. 8 characters\nAt least 1 number\nAt least 1 uppercase\nAt least 1 lowercase";
  }
}
