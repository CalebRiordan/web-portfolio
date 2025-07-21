import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateMessageModel } from 'app/models/message';
import { MessagesService } from 'app/services/messages.service';
import { SnackbarService } from 'app/services/snackbar.service';
import { RippleEffectDirective } from 'app/directives/ripple-effect.directive';

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RippleEffectDirective],
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.css'],
})
export class ContactMeComponent implements OnInit {
  formProcessing: boolean = false;
  contactForm!: FormGroup;
  onCooldown = false;

  constructor(
    private fb: FormBuilder,
    private sbService: SnackbarService,
    private messageService: MessagesService,
  ) {}

  @ViewChild('contactMeCard') contactMeCard!: ElementRef;

  @HostListener('document:click', ['$event']) onClickOutsideForm(event: Event) {
    if (!this.contactMeCard.nativeElement.contains(event.target)) {
      const currentValues = this.contactForm.value;
      this.contactForm.reset();
      this.contactForm.patchValue(currentValues);
    }
  }

  ngOnInit(): void {
    // Set up form
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.onCooldown || this.formProcessing) return;

    this.formProcessing = true;

    const contactData: CreateMessageModel = {
      name: this.contactForm.controls['name'].value,
      emailAddress: this.contactForm.controls['email'].value,
      content: this.contactForm.controls['message'].value,
    };

    // Send message and subscribe to response
    this.messageService.addMessage(contactData).subscribe({
      next: () => {
        this.updateFormState();
        this.sbService.snackbar('Message submitted. Thank you!');
      },
      error: () => {
        this.updateFormState();
        this.sbService.snackbar(
          'An error occurred while trying to send the message. Sorry for the inconvenience. Hopefully solved in the next commit!',
          3500,
          SnackbarService.SnackbarType.ERROR
        );
      },
    });
  }

  private updateFormState() {
    this.formProcessing = false;
    this.onCooldown = true;

    // 7 second cooldown on sending messages
    setTimeout(() => {
      this.onCooldown = false;
    }, 7000);
  }

  get fc() {
    return this.contactForm.controls;
  }
}
