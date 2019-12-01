import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  title = 'Wichtler';
  isLoading: boolean = true;
  isDrawing: boolean = false;
  allowDuplicates: boolean = false;

  namesFG: FormGroup;
  candidates: Candidate[] = [{name: '', partner: ''}]
 /*  candidates: Candidate[] = [
    {name: 'Adrian', partner: 'Anja' },
    {name: 'Anja', partner: 'Adrian' },
    {name: 'Mama', partner: 'Papa' },
    {name: 'Papa', partner: 'Mama' }
  ] */

  possibleCombinations: CombinationsForCandidate[] = [];
  allPossibleCombinationSets: CombinationSet[] = [];
  drawnCombinationSet: CombinationSetResult = null;
  
  ngOnInit(): void {
    this.namesFG = new FormGroup({
      candidates: new FormArray([]),
      allowDuplicates: new FormControl(false)
    });
    this.candidates.forEach((candidate: Candidate) => {
     (this.namesFG.get('candidates') as FormArray).push(
        new FormGroup({
          name: new FormControl(candidate.name, Validators.required),
          partner: new FormControl(candidate.partner)
        })
      );
    });
    this.isLoading = false;
  }

  addName(){
    this.candidates.push({name: '', partner: ''});
    (this.namesFG.get('candidates') as FormArray).push(
      new FormGroup({
        name: new FormControl('', Validators.required),
        partner: new FormControl()
      })
    )
  } 

  deleteSelf(deleteCandidate: Candidate, index: number){
    this.candidates = this.candidates.filter((candidate: Candidate) => candidate.name !== deleteCandidate.name);
    this.candidates.forEach((candidate: Candidate) => {
      if(candidate.partner === deleteCandidate.name){
        candidate.partner = '';
      }
    });
    (this.namesFG.get('candidates') as FormArray).removeAt(index);
  }

  onDuplicatesChange(event){
    this.allowDuplicates = event.checked;
  }

  nameChanged(event, i){
   this.candidates[i].name = this.namesFG.get('candidates').value[i].name;
  }

  showResultFor(combination: CombinationResult){
    combination.show = true;
  }

  hideResultFor(combination: CombinationResult){
    combination.show = false;
  }

  partnerChanged(event, i){
    let partnerValue = (this.namesFG.get('candidates') as FormArray).value[i].partner;
    let nameValue = (this.namesFG.get('candidates') as FormArray).value[i].name;
    if(partnerValue){
      this.candidates.forEach((candidate: Candidate) => {
        if(candidate.name === partnerValue){
          candidate.partner = nameValue;
        }
        if(candidate.name === nameValue){
          candidate.partner = partnerValue;
        }
      });
      (this.namesFG.get('candidates') as FormArray).controls.forEach((nameFg: FormGroup) => {
        if(nameFg.get('name').value === partnerValue){
          nameFg.get('partner').setValue(nameValue);
        }
      });
    }
    else{
      this.candidates.forEach((candidate: Candidate) => {
        if(candidate.partner === nameValue){
          candidate.partner = '';
        }
        if(candidate.name === nameValue){
          candidate.partner = partnerValue;
        }
      });
      (this.namesFG.get('candidates') as FormArray).controls.forEach((nameFg: FormGroup) => {
        if(nameFg.get('partner').value === nameValue){
          nameFg.get('partner').setValue('');
        }
      });
    }
    
  }

  draw(){
    this.isDrawing = true;
    this.drawnCombinationSet = null;
    this.getPossibleCombinations();
    if(this.possibleCombinations.length <= 0){
      this.isDrawing = false;
      return;
    }
    this.drawAllCombinations();
    this.selectRandomConbination();
    this.isDrawing = false;
  }

  selectRandomConbination(){
    if(this.allPossibleCombinationSets.length > 0){
      let drawnIndex = Math.floor((Math.random() * this.allPossibleCombinationSets.length));
      this.drawnCombinationSet = this.allPossibleCombinationSets[drawnIndex];
    }
  }

  getPossibleCombinations(){
    this.possibleCombinations = [];
    this.candidates.forEach((srcCandidate: Candidate) => {
      let combinationsForCandidate: CombinationsForCandidate = new CombinationsForCandidate();
      combinationsForCandidate.srcCandidate = srcCandidate;
      this.candidates.forEach((destCandidate: Candidate) => {
        if(srcCandidate.name !== destCandidate.name && srcCandidate.partner !== destCandidate.name){
          combinationsForCandidate.destCandidates.push(destCandidate);
        }
      });
      if(combinationsForCandidate.destCandidates.length > 0){
        this.possibleCombinations.push(combinationsForCandidate);
      }
    });
  }

  drawAllCombinations(){
    this.allPossibleCombinationSets = [];

    let combinationIndices: number[] = [];
    for(let i = 0; i < this.possibleCombinations.length; i++){
      combinationIndices.push(0);
    }

    let doStop: boolean = false;

    while(!doStop){

      let newPotentialCombinationSet: CombinationSet = new CombinationSet();

      for(let i = 0; i < combinationIndices.length; i++){
        newPotentialCombinationSet.combinations.push({
          srcCandidate: this.possibleCombinations[i].srcCandidate,
          destCandidate: this.possibleCombinations[i].destCandidates[combinationIndices[i]]
        });
      }
      if(this.isValidCombinationSet(newPotentialCombinationSet)){
        this.allPossibleCombinationSets.push(newPotentialCombinationSet)
      }

      doStop = !combinationIndices.some((destIndex: number, srcIndex: number) => {
        destIndex++;
        if(destIndex >= this.possibleCombinations[srcIndex].destCandidates.length){
          combinationIndices[srcIndex] = 0;
          return false;
        }
        else {
          combinationIndices[srcIndex] = destIndex;
          return true;
        }
      });
    }
  }

  isValidCombinationSet(combinationSet: CombinationSet){
    return !combinationSet.combinations.some((combination: Combination, index: number) => {
      let drawnCombinations: Combination[] = [];
      for(let i = 0; i < index; i++){
        drawnCombinations.push(combinationSet.combinations[i]);
      }
      return !this.isCombinationAllowed(drawnCombinations, combination);
    });
  }

  isCombinationAllowed(drawnCombinations: Combination[], combination: Combination){
    
    if(drawnCombinations.findIndex((drawnCombination: Combination) => {
      return (this.isSameCombination(combination, drawnCombination)
      || this.isRedundantCombination(combination, drawnCombination))
    }) !== -1){
      return false;
    }
    else{
      return true;
    }
  }

  isSameCombination(srcCombination: Combination, destCombination: Combination){
    if(srcCombination.srcCandidate.name === destCombination.srcCandidate.name 
      && srcCombination.destCandidate.name === destCombination.destCandidate.name){
      return true;
    }
    else if(!this.allowDuplicates && srcCombination.srcCandidate.name === destCombination.destCandidate.name 
      && srcCombination.destCandidate.name === destCombination.srcCandidate.name){
      return true;
    }
    else {
      return false;
    }
  }

  isRedundantCombination(newCombination: Combination, existingCombination: Combination){
    if(newCombination.srcCandidate.name === existingCombination.srcCandidate.name
      || newCombination.destCandidate.name === existingCombination.destCandidate.name){
      return true;
    }
    else {
      return false;
    }
  }
}

export class Candidate {
  name: string;
  partner?: string;
}

export class Combination {
  srcCandidate: Candidate;
  destCandidate: Candidate;
}

export class CombinationsForCandidate {
  srcCandidate: Candidate = new Candidate();
  destCandidates: Candidate[] = [];
}

export class CombinationSet {
  combinations: Combination[] = [];
}

export class CombinationSetResult {
  combinations: CombinationResult[] = [];
}

export class CombinationResult {
  srcCandidate: Candidate;
  destCandidate: Candidate;
  show?: boolean = false;
}


