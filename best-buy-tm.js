// ==UserScript==
// @name     BestBuy-RefreshNoBot
// @include  https://www.bestbuy.com/*
// @version      2.5
// @description  This aint bot, its RefreshNoBot
// @author       Karan Kapuria
// @grant        window.close

// Version Changelog
// 1.0 - Initial release
// 2.0 - 'Please Wait...' items can now be CARTED and CHECKEDOUT
// 2.5 - 'Fixed Memory Leak' no more refresh ! We will recycle tabs.
// - Due to constant reloading of OOS items, memory on your browser slowly blows up
// - We will now kill the tab if item is OOS and open it in new page. Doing this infact reduces the total RAM usage.
// - Button clicks no more use .click() but instead use EventListeners()
// - Status Bar is now 50% of screen.  Little taller so last line is visible when page is loading.
// - Status Bar now shows ITEM_KEYWORD
// - We will now play a music when item is carted.
// - Since BB asks for verifying account sometimes. Alert will help so that you dont miss checkout.
// - MAX_RETRIES will now control when your page gets reloaded when you are stuck on please wait screen. In this case it will perform normal reload.
// ==/UserScript==

//rgb(197, 203, 213) pleasewait
//rgb(255, 224, 0) add to cart

/*
  _____       __               _     _   _  ____  ____        _
 |  __ \     / _|             | |   | \ | |/ __ \|  _ \      | |
 | |__) |___| |_ _ __ ___  ___| |__ |  \| | |  | | |_) | ___ | |_
 |  _  // _ \  _| '__/ _ \/ __| '_ \| . ` | |  | |  _ < / _ \| __|
 | | \ \  __/ | | | |  __/\__ \ | | | |\  | |__| | |_) | (_) | |_
 |_|  \_\___|_| |_|  \___||___/_| |_|_| \_|\____/|____/ \___/ \__|

                                                                  */
//
//________________________________________________________________________

                 //  PLEASE UPDATE THESE CONSTANTS
//________________________________________________________________________

"use strict";

const ITEM_KEYWORD= "5600"; // NO SPACES IN KEYWORD - ONLY ONE WORD
const CREDITCARD_CVV = "***"; // BOT will run without changing this value.
const TESTMODE = "Yes"; // TESTMODE = "No" will buy the card
const MAX_RETRIES = "200" // Page will auto refresh after retries


//
//________________________________________________________________________

                 // Create Floating Status Bar
//________________________________________________________________________

function createFloatingBadge(mode,status) {
    const iconUrl = "https://kkapuria3.github.io/images/KK.png";
    const $container = document.createElement("div");
    const $bg = document.createElement("div");
    const $link = document.createElement("a");
    const $img = document.createElement("img");
    const $text = document.createElement("P");
    const $mode = document.createElement("P");
    const $status1 = document.createElement("P");


    $link.setAttribute("href", "https://github.com/kkapuria3");
    $link.setAttribute("target", "_blank");
    $link.setAttribute("title", "RefreshNoBot");
    $img.setAttribute("src", iconUrl);
    var MAIN_TITLE = ("Open Source BB-Bot V2.5   ◻️   TESTMODE: " +TESTMODE + "   ◻️   ITEM KEYWORD: " + ITEM_KEYWORD);
    $text.innerText = MAIN_TITLE;
    $mode.innerText = mode;
    $status1.innerText = status;

    $container.style.cssText = "position:fixed;left:0;bottom:0;width:50%;height:80px;background: black;";
    $bg.style.cssText = "position:absolute;left:-100%;top:0;width:60px;height:55px;background:#1111;box-shadow: 0px 0 10px #060303; border: 1px solid #FFF;";
    $link.style.cssText = "position:absolute;display:block;top:11px;left: 0px; z-index:10;width: 50px;height:50px;border-radius: 1px;overflow:hidden;";
    $img.style.cssText = "display:block;width:100%";
    $text.style.cssText = "position:absolute;display:block;top:3px;left: 50px;background: transperant; color: white;";
    $mode.style.cssText = "position:absolute;display:block;top:22px;left: 50px;background: transperant; color: white;";
    $status1.style.cssText = "position:absolute;display:block;top:43px;left: 50px;background: transperant; color: white;";
    //
    //
    $link.appendChild($img);
    $container.appendChild($bg);
    $container.appendChild($link);
    $container.appendChild($text);
    $container.appendChild($mode);
    $container.appendChild($status1)
    return $container;
}

//________________________________________________________________________

    //  FUNCTIONS | Writing seperate EventHandlers so we can prevent memory leak for long running bots
//________________________________________________________________________

// Ideas developed based on : https://stackoverflow.com/questions/13677589/addeventlistener-memory-leak-due-to-frames/13702786#13702786
//________________________________________________________________________

                     //    CART PAGE EventHandler
//________________________________________________________________________

function cartpageoperationsEvenHandler (evt) {
    setTimeout(function()
    {
            if (location.href.includes("www.bestbuy.com/cart")) {
                //Create Custom Badge
                //
                const $badge = createFloatingBadge("Cart Page","Verfying 1st item in cart has KEYWORD");
                document.body.appendChild($badge);
                $badge.style.transform = "translate(0, 0)"

                //Wait 3 Seconds on Cart Page
                //
                setTimeout(function() {
                    //We will verify the first time in the cart. If the item name has the Keyword, that means the item was sucessfully added to cart.
                    //In that case the checkout button is clicked.
                    //
                    var CartItemCheck = document.getElementsByClassName("cart-item__title focus-item-0");
                    //console.log(CartItemCheck[0])
                    //
                    //
                    if (CartItemCheck[0].innerHTML.includes(ITEM_KEYWORD)){ //SKU of 3060Ti
                        //
                        console.log('Item Has been Confirmed !')
                        console.log('Click Checkout')
                        var CheckoutButton = document.getElementsByClassName("btn btn-lg btn-block btn-primary");
                        CheckoutButton[0].click()
                        CheckoutButton = null ;

                    }
                }, 3000 )//Three seconds will elapse and Code will execute.

            }
    }, 5000)
}

//________________________________________________________________________

                 //  SECOND ADD TO CART EventHandler
//________________________________________________________________________


function pleasewaitcompletedEventHandler (evt) {
    // We will come here when please wait turns yellow again and its pressed by the code
    var soundData = new Audio("https://github.com/kkapuria3/BestBuy-GPU-Bot/blob/dev-v2.5-mem_leak_fix/resources/alert.mp3?raw=true");
    soundData.play()
    // Wait for 10 seconds and press go Go to cart button
    setTimeout(function(){

            // Press secondary button
            var GotoCartButton = document.getElementsByClassName("c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block");
            // Press go to cart
            GotoCartButton[0].onclick = cartpageoperationsEvenHandler;
            GotoCartButton[0].addEventListener ("click", cartpageoperationsEvenHandler, false);
            // When a click event is detected for parsed element, please execute the function from uptop
            GotoCartButton[0].click (cartpageoperationsEvenHandler);
            GotoCartButton = null ;

    }, 3000)
}



//________________________________________________________________________

                  //  ITEM IN STOCK EventHandler
//________________________________________________________________________


function instockEventHandler (evt) {
    // After pressing Add to Cart button we first wait for 5 seconds to get cart ready. In this time we will check if it shows please wait
    setTimeout(function() {

        //Code to run After timeout elapses
        console.log('Waiting 10 Seconds to Get Cart Ready !!')

        var PleaseWait = document.getElementsByClassName("btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button");
        let MainButtonColor = window.getComputedStyle(PleaseWait[0]).backgroundColor;

        if (MainButtonColor === 'rgb(197, 203, 213)') {
            console.log('---Please Wait Mode Activated---')
            var MODE = "Trying to Cart 🔴 Please wait, do not Refresh!! "

            //
            var RETRY_COUNT="1"
            // Run this every 5 seconds
            setInterval(function(){
                //
                var TRIES = ("Max Retries: "+MAX_RETRIES+ "   ◻️  Retry Count: "+RETRY_COUNT);
                const $badge = createFloatingBadge(MODE,TRIES);
                document.body.appendChild($badge);
                $badge.style.transform = "translate(0, 0)"
                // Run this every 20 seconds
                setTimeout(function(){

                        //Find the Color of Main Button in Firefox
                        var PleaseWait = document.getElementsByClassName("btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button");
                        let MainButtonColor = window.getComputedStyle(PleaseWait[0]).backgroundColor;
                        //console.log(MainButtonColor);
                        console.log("Please Wait Button Detected :" + MainButtonColor + " | Lets keep trying ..");

                        if (MainButtonColor === 'rgb(255, 224, 0)') {
                                // Color of Button Changes to yellow then click again
                                let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;
                                // When button turns yellow, we scream bagged !
                                console.log("Add to Cart is available:" + ATC_Color + " | Lets Bag This ! ");
                                var ATCYellowButton = document.getElementsByClassName("btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button");
                                // Now we will use event handlers to check for clicks. We have create a function on top defining instockEventhandler.
                                // It is said this this method reduces memory leaks
                                ATCYellowButton[0].onclick = pleasewaitcompletedEventHandler;
                                ATCYellowButton[0].addEventListener ("click", pleasewaitcompletedEventHandler, false);
                                // When a click event is detected for parsed element, please execute the function from uptop
                                ATCYellowButton[0].click (pleasewaitcompletedEventHandler);
                                var soundData = new Audio("https://github.com/kkapuria3/BestBuy-GPU-Bot/blob/dev-v2.5-mem_leak_fix/resources/alert.mp3?raw=true");
                                soundData.play()

                        }
                        else {
                        // Is queue bypass available ?
                        // If available lets check add to cart button instanly
                         // Press secondary button
                                console.log("Checking bypass")
                                var GotoCartButton = document.getElementsByClassName("c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block");
                                if (GotoCartButton.length > 0) {
                                    GotoCartButton[0].onclick = cartpageoperationsEvenHandler;
                                    GotoCartButton[0].addEventListener ("click", cartpageoperationsEvenHandler, false);
                                    // When a click event is detected for parsed element, please execute the function from uptop
                                    GotoCartButton[0].click (cartpageoperationsEvenHandler);
                                    GotoCartButton = null ;
                                //
                                }
                        }
                        //

                }, 5*1000);

                RETRY_COUNT++;
                if (RETRY_COUNT > MAX_RETRIES){ location.reload(); }

            },4000)

        }
        else {
            setTimeout(function(){
                // Press secondary button
                var GotoCartButton = document.getElementsByClassName("c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block");
                GotoCartButton[0].onclick = cartpageoperationsEvenHandler;
                GotoCartButton[0].addEventListener ("click", cartpageoperationsEvenHandler, false);
                // When a click event is detected for parsed element, please execute the function from uptop
                GotoCartButton[0].click (cartpageoperationsEvenHandler);
                GotoCartButton = null ;
            }, 6000) // If item is not please waited then it will open go to cart again. This only happens for in stock items

        }


}, 5000); //Two seconds will elapse and Code will execute.
//
                            }
//________________________________________________________________________

                           //  Main Code
//________________________________________________________________________

function contains(a,b) {
    let counter = 0;
    for(var i = 0; i < b.length; i++) {;
        if(a.includes(b[i])) counter++;
    }
    if(counter === b.length) return true;
    return false;
}

// Get Page Title
var pagetitle = String(document.title);

if (location.href.includes("www.bestbuy.com/cart")) {

    cartpageoperationsEvenHandler();

}


if (pagetitle.includes(ITEM_KEYWORD)) {


        //Create Custom Badge
        //
        const $badge = createFloatingBadge("Auto Detecting Mode", "Initializing ..");
        document.body.appendChild($badge);
        $badge.style.transform = "translate(0, 0)"
        //Out of Stock Button
        //
        var OOSButton = document.getElementsByClassName("btn btn-disabled btn-lg btn-block add-to-cart-button");
        // If Out of Stock Button is Found. Refresh
        //
        if (OOSButton.length > 0) {
                //
                //
                console.log('Out of Stock Button is Found: Just Refreshing !')
                // Lets just reload when its OOSing
                setTimeout(function(){
                        const $badge = createFloatingBadge("No Stock Found", "Lets Refresh !");
                        document.body.appendChild($badge);
                        setTimeout(() => {$badge.style.transform = "translate(0, 0)";}, 0);

                    window.open(window.location.href, '_blank');
                    window.close();
                    //location.reload(); // This command here blows up your memory

                                         //
                                         //
                }, 50*100);

        }
        // If Out of Stock Button is Not Found.
        // We will begin working of our bot
        //
        else {
                console.log('Out of Stock Button Not Found: Lets Check for ATC Button')
                // Add to Cart Button
                var InStockButton = document.getElementsByClassName("btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button");
                //
                // Checking if ATC button is found
                if (InStockButton.length > 0)
                {

                        console.log('Add to Cart Found')
                        // Lets Save the Color for ATC Button for dealing with Please Wait Bullshit
                        let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;
                        // Pring RBG for ATC
                        //console.log(ATC_Color)
                        // When pages loads first time. It will check the color of button. If button is already in please wait, we wont click ATC again. Becuase it opens a warning on page.
                        if (ATC_Color === 'rgb(197, 203, 213)')
                        {
                            //
                            console.log('ATC is grey ! You have already pressed please wait for this item. Lets wait until we can bag this.')
                            instockEventHandler() ;


                        }
                        else
                        {
                            // Wow we will use event handlers to check for clicks. We have create a function on top defining instockEventhandler.
                            // It is said this this method reduces memory leaks
                            console.log('ATC button is yellow ! Pressing it ! ')
                            InStockButton[0].onclick = instockEventHandler;
                            InStockButton[0].addEventListener ("click", instockEventHandler, false);
                            // When a click event is detected for parsed element, please execute the function from uptop
                            InStockButton[0].click (instockEventHandler);

                       }



                }

        }
}



// CART PAGE OPERATIONS
else if (location.href.includes("www.bestbuy.com/checkout/r/fast-track")) {
    //Create Custom Badge
    //
    const $badge = createFloatingBadge("Final CheckPoint","Verifying and Submitting");
    document.body.appendChild($badge);
    $badge.style.transform = "translate(0, 0)"
    //
    //
    setTimeout(function() {
        //
        //document.getElementById("blah").src = "http://......"
        // CVV Number of Saved Card
        var AddCVV = document.getElementById("cvv").value = CREDITCARD_CVV;
        //
            if(document.getElementById("text-updates") != null)
            {
                //
                var TextUpdates = document.getElementById("text-updates").click()
                //console.log(TextUpdates[0].checked)
            }
        if (TESTMODE === "No"){
        //Is test mode is OFF go press place order button
        //
        console.log("we are here")
        var PLACE_ORDER = document.getElementsByClassName("btn btn-lg btn-block btn-primary button__fast-track")[0].click()
        //
        }
        //
        //
    }, 3000); //Three seconds will elapse and Code will execute.




}







