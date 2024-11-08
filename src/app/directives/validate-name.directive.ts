import {Directive} from "@angular/core";
import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS} from "@angular/forms";
import {PlayersService} from "../services/players.service";

@Directive({
  selector: "[appValidateName]",
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: ValidateNameDirective, multi: true}],
})
export class ValidateNameDirective implements AsyncValidator {
  constructor(private playersService: PlayersService) {}

  public validate(control: AbstractControl): Promise<{[key: string]: any} | null> {
    return new Promise<{[key: string]: any} | null>(async (resolve) => {
      let isDup = await this.playersService.isPlayerDuplicate(control.value);
      if (isDup) resolve({"error": true});

      resolve(null);
    });
  }
}
