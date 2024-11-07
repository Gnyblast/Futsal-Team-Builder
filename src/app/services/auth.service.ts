import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  User,
  UserCredential,
} from "@angular/fire/auth";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private auth = inject(Auth);
  public isAuthenticated: WritableSignal<boolean> = signal<boolean>(false);
  public user: User | null = null;
  public loaded: boolean = false;

  constructor() {
    authState(this.auth).subscribe((user) => {
      this.loaded = true;
      this.setUserAndState(user);
    });
  }

  public async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      let creds = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(creds.user);
      return creds;
    } catch (error) {
      console.error("Sign Up Error:", error);
      return new Promise<UserCredential>((resolve) => {
        resolve({} as UserCredential);
      });
    }
  }

  public async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      let creds = await signInWithEmailAndPassword(this.auth, email, password);
      return creds;
    } catch (error) {
      console.error("Sign In Error:", error);
      return new Promise<UserCredential>((resolve) => {
        resolve({} as UserCredential);
      });
    }
  }

  public async googleSignIn(): Promise<UserCredential> {
    try {
      let creds = await signInWithPopup(this.auth, new GoogleAuthProvider());
      return creds;
    } catch (error) {
      console.error("Google Sign In Error:", error);
      return new Promise<UserCredential>((resolve) => {
        resolve({} as UserCredential);
      });
    }
  }

  public async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Sign Out Error:", error);
      throw error;
    }
  }

  public async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }

  public resendVerify(user: User): void {
    sendEmailVerification(user);
  }

  public authTrigger(): Observable<User | null> {
    return authState(this.auth);
  }

  public getUser(): Observable<User | null> {
    return user(this.auth);
  }

  private setUserAndState(user: User | null): void {
    this.user = user;
    if (!user) {
      this.isAuthenticated.set(false);
      return;
    }

    if (!user.emailVerified) {
      this.isAuthenticated.set(false);
      return;
    }

    this.isAuthenticated.set(true);
  }
}
