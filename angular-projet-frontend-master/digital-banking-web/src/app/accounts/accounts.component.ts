import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDetails} from "../model/account.model";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup !: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountDetails>
  operationsFormGroup!: FormGroup;
  errorMessages!:string ;

  constructor(private fb: FormBuilder, private accountService: AccountsService) {
  }

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control('')

    });
    this.operationsFormGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null)
    });
  }

  handleSearchAccount() {
    let accountId: string = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err =>{
        this.errorMessages=err.message;
        return throwError(err);
      } )
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let accountId: string = this.accountFormGroup.value.accountId;
    let operationType = this.operationsFormGroup.value.operationType;
    let  amount:number=this.operationsFormGroup.value.amount;
    let  description :string=this.operationsFormGroup.value.description;
    let  accountDestination :string=this.operationsFormGroup.value.accountDestination;


    if (operationType == 'debit') {
      this.accountService.debit(accountId,amount, description).subscribe({
        next:(data)=>{
          alert("Succes Debit ");
          this.operationsFormGroup.reset();
          this.handleSearchAccount();

        },
        error:(err  )=>{
          console.log(err);
        }
      });
    } else if (operationType == 'credit') {
      this.accountService.credit(accountId,amount, description).subscribe({
        next:(data)=>{
          alert("Succes credit ");
          this.operationsFormGroup.reset();
          this.handleSearchAccount();
        },
        error:(err  )=>{
          console.log(err);
        }
      });

    } else if (operationType == 'transfert') {
      this.accountService.transfert(accountId,accountDestination,amount , description).subscribe({
        next:(data)=>{
          alert("Succes transfert ");
          this.operationsFormGroup.reset();
          this.handleSearchAccount();
        },
        error:(err  )=>{
          console.log(err);
        }
      });
    }

  }
}
