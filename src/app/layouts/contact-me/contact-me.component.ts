import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateMessageModel } from 'src/app/models/message';
import { MessagesService } from 'src/app/services/messages.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-contact-me',
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.css'],
})
export class ContactMeComponent implements OnInit {
  formProcessing: boolean = false;
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private sbService: SnackbarService, private messageService: MessagesService) {}

  @ViewChild('innerCard') innerCard!: ElementRef;
  @HostListener('document:click', ['$event']) onClickOutsideForm(event: Event){
    if (!this.innerCard.nativeElement.contains(event.target)){
      const currentValues = this.contactForm.value;
      this.contactForm.reset();
      this.contactForm.patchValue(currentValues);
    }
  }  

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    this.formProcessing = true;    

    const contactData: CreateMessageModel = {
      name: this.contactForm.controls['name'].value,
      emailAddress: this.contactForm.controls['email'].value,
      content: this.contactForm.controls['message'].value,
    };
    
    this.messageService.addMessage(contactData).subscribe(res => {
      this.formProcessing = false;
      this.sbService.generateSnackbar("Message submitted. Thank you!");
    });
  }

  get fc() {
    return this.contactForm.controls;
  }
}
