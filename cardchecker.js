//hides text when window loads
window.onload = function(){
    document.getElementById("CardNum").style.display = "none";
    document.getElementById("CardType").style.display = "none";
    document.getElementById("CardLength").style.display = "none";
    document.getElementById("CardCVC").style.display = "none";
    document.getElementById("CardExp").style.display = "none";
}

//push button that activates main function
document.getElementById("CheckCC").addEventListener("click", Display);





//Main function
function Display(){
    

    var cardnum = document.getElementById("CNumber").value.split("");
    var CVC = document.getElementById("CVC").value.split("");
    var exp = document.getElementById("ExpDate").value.split("");
    var copyCardnum = document.getElementById("CNumber").value.split("");
    

    var type = checkType(cardnum);
    
    if (type == null){
        
        document.getElementById("CardType").innerHTML = "Invalid Card Type"
        document.getElementById("CardType").style.display = "block";

    } else{

        card = createCard(cardnum, CVC, exp, type);
        CheckOverallValidity(card, copyCardnum);
        //prints card information to console
        console.log("Card Type: ", card.type, " Card Number: ", card.cardnum.toString().replace(/,/g, '')," Card CVC: ", card.CVC.toString().replace(/,/g, ''), " Card Exp: ", card.exp.toString().replace(/,/g, ''));
    }
}

//function that uses the card # to determine what type of card
//is being inputted, and returns that type
function checkType(cardnum){
    type = null;
    if(cardnum[0]=="4"){
        type = "Visa";
    }
    if(cardnum[0]=="3"){
        if(cardnum[1] == "4"){
            type = "Amex";
        }
        if(cardnum[1]== "7"){
            type = "Amex"
        }
    }
    if (cardnum[0] == "5"){
    
        if (0 < Number(cardnum[1]) < 6){
            type = "MC";
        }
    }
    return type;
}

//function that takes the card information and type
//and creates a card object based of off the type of card
function createCard(cardnum, CVC, exp, type){
    if (type == "Amex"){
        
        card = new Amex(cardnum, CVC, exp);
        
    }
    
    if (type == "Visa"){
        card = new Visa(cardnum, CVC, exp);
    }
    
    if (type == "MC"){
        card = new MC(cardnum, CVC, exp);
    }
    
    return card;
}
//function that checks overall validity of card
function CheckOverallValidity(card, cardnum){
    card.checkNumValidity(cardnum);
    card.checkLengthValidity();
    card.checkDateValidity();
    

    if(card.validNum == false){
        document.getElementById("CardNum").innerHTML = "Card Number Invalid"
        document.getElementById("CardNum").style.display = "block";
    } if (card.validLength == false){
        document.getElementById("CardLength").innerHTML = "Card Length Invalid"
        document.getElementById("CardLength").style.display = "block";
    } if (card.validCVC == false){
        document.getElementById("CardCVC").innerHTML = "CVC Length Invalid"
        document.getElementById("CardCVC").style.display = "block";
    } if (card.validExp == false){
        document.getElementById("CardExp").innerHTML = "Expired Card"
        document.getElementById("CardExp").style.display = "block";
    } else if (card.validExp == null && card.validCVC == null && card.validLength == null && card.validNum == null ) {
        document.getElementById("CardNum").innerHTML = "Valid Card!"
        document.getElementById("CardNum").style.display = "block";
    }

}


//main credit card super class that constains the variable setter
//and main function to check card validing using the luhn formula
function CreditCard(cardnum, CVC, exp){
    this.cardnum = cardnum;
    this.CVC = CVC;
    this.exp = exp;
    this.validNum = null;
    this.validExp = null;

}

//prototype function to check validity of card with luhn formula
CreditCard.prototype.checkNumValidity = function(copyCardnum){
    
    for (i=(copyCardnum.length-2); i >= 0; i--){
        
        copyCardnum[i] = (copyCardnum[i] * 2)
        
            if (copyCardnum[i] > 9){
                var newint = String(copyCardnum[i]);
                

                copyCardnum[i] = (Number(newint.charAt(0))) + (Number(newint.charAt(1)));
            }
            i--;
        }

    var sum = null;

    for (i=0; i<copyCardnum.length; i++){
        sum = sum + Number(copyCardnum[i]);
        
    }

    if (sum%10 != 0){
        this.validNum = false;
    }



    
}
//Checks experation date of card
CreditCard.prototype.checkDateValidity = function(){
    if (this.exp.length != 7){
        this.validExp = false;
    } else{
        var currentDate = new Date();
        
        var currentMonth = Number(currentDate.getMonth())+1;
        var currentYear = Number(currentDate.getFullYear());

        var cardMonth = Number(String(this.exp[0])+String(this.exp[1]));
        var cardYear = Number(String(this.exp[3]) + String(this.exp[4]) + String(this.exp[5]) + String(this.exp[6]));
        
        if (cardYear < currentYear){
            
            this.validExp = false;
        }
        if (cardYear == currentYear){
            if (cardMonth < currentMonth){
                this.validExp = false;
            } 
        } 
}
}

//Amex specific card function/class
function Amex(cardnum, CVC, exp){
    this.validLength = null;
    this.validCVC = null;
    
    console.log(this.type);
    CreditCard.call(this, cardnum, CVC, exp);
    this.checkLengthValidity = function(){

        if (cardnum.length != 15){
            this.validLength = false;
        } 

        if (CVC.length != 4){
            this.validCVC = false;
        } 
    }
}


Amex.prototype = new CreditCard();
Amex.prototype.__prototype__ = CreditCard.prototype;

//Visa specific card function/class
function Visa(cardnum, CVC, exp){
    this.validLength = null;
    this.validCVC = null;
    this.type = "Visa";
    CreditCard.call(this, cardnum, CVC, exp);
    this.checkLengthValidity = function(){
        if (cardnum.length != 16){
            this.validLength = false;
        } 
        if (CVC.length != 3){
            this.validCVC = false;
        } 
    }
}

Visa.prototype = new CreditCard();
Visa.prototype.__prototype__ = CreditCard.prototype;

//Mastercard specific function/class
function MC(cardnum, CVC, exp){
    this.validLength = null;
    this.validCVC = null;
    this.type = "MasterCard";
    CreditCard.call(this, cardnum, CVC, exp);
    this.checkLengthValidity = function(){
        if (cardnum.length != 16){
            this.validLength = false;
        } 
        if (CVC.length != 3){
            this.validCVC = false;
        } 
    }
}

MC.prototype = new CreditCard();
MC.prototype.__prototype__ = CreditCard.prototype;


