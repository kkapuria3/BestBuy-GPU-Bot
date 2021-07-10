// ==UserScript==
// @name     BestBuy-RefreshNoBot
// @include  https://www.bestbuy.com/*
// @version      2.0
// @description  This aint bot, its RefreshNoBot
// @author       Karan Kapuria


// Version Changelog
// 1.0 - Initial release
// - Testmode for checking bot
// - Saved Credit Card CVV use
// 1.1 - Handle Please Wait Gracefully
// - If Please Wait button shows up, bot will check every for second ATC button every 20 seconds
// - Whenever second ATC button appears, it will click and checkout
// - Reading Logs in Console
// 2.0 - 'Please Wait...' items can now be CARTED and CHECKEDOUT
// - If "Please Wait" button shows up, it will enter a loop of retries which will check the color of button.
// - As long as button stays Gray, it will try and check for Yellow Color
// - Whenever Yellow ATC button appears again, it will click and checkout
// - Status Bar is now being added at bottom
// - Status Bar now shows version and TESTMODE variable
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

//________________________________________________________________________

"use strict";

var ITEM_KEYWORD= "***";
var CREDITCARD_CVV = "***";
var TESTMODE = "Yes"; // TESTMODE = "No" will buy the card


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
    var MAIN_TITLE = ("Open Source BB-Bot V2.0 | TESTMODE: " +TESTMODE );
    $text.innerText = MAIN_TITLE;
    $mode.innerText = mode;
    $status1.innerText = status;

    $container.style.cssText = "position:fixed;left:0;bottom:0;width:100%;height:60px;background: black;";
    $bg.style.cssText = "position:absolute;left:-100%;top:0;width:60px;height:55px;background:#1111;box-shadow: 0px 0 10px #060303; border: 1px solid #FFF;";
    $link.style.cssText = "position:absolute;display:block;top:11px;left: 0px; z-index:10;width: 50px;height:50px;border-radius: 1px;overflow:hidden;";
    $img.style.cssText = "display:block;width:100%";
    $text.style.cssText = "position:absolute;display:block;top:1px;left: 50px;background: transperant; color: white;";
    $mode.style.cssText = "position:absolute;display:block;top:20px;left: 50px;background: transperant; color: white;";
    $status1.style.cssText = "position:absolute;display:block;top:40px;left: 50px;background: transperant; color: white;";
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

                           //  Main Code
//________________________________________________________________________



// Get Page Title
var pagetitle = String(document.title);

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
                        //
                        location.reload();
                                         //
                                         //
                }, 20*100);
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
                if (InStockButton.length > 0) {

                        console.log('Add to Cart Found')
                        // Lets Save the Color for ATC Button for dealing with Please Wait Bullshit
                        let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;
                        // Pring RBG for ATC
                        console.log(ATC_Color)
                        // Pring RBG for
                        InStockButton[0].click()
                        console.log('Add to Cart Button Clicked')
                        //Time out for 5 seconds for items to load in your cart
                        //
                        setTimeout(function() {

                            //Code to run After timeout elapses
                            console.log('Waiting 10 Seconds to Get Cart Ready !!')

                            var PleaseWait = document.getElementsByClassName("btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button");
                            let MainButtonColor = window.getComputedStyle(PleaseWait[0]).backgroundColor;

                            if (MainButtonColor === 'rgb(197, 203, 213)') {
                                console.log('---Please Wait Mode Activated---')
                                var MODE = "ATC was pressed. Please wait, do not Refresh!!"

                                //
                                var RETRY_COUNT="1"
                                // Run this every 5 seconds
                                setInterval(function(){
                                    //
                                    var TRIES = ("Retry Count: "+RETRY_COUNT);
                                    const $badge = createFloatingBadge(MODE,TRIES);
                                    document.body.appendChild($badge);
                                    $badge.style.transform = "translate(0, 0)"
                                    // Run this every 20 seconds
                                    setTimeout(function(){

                                        //Find the Color of Main Button in Firefox
                                        let MainButtonColor = window.getComputedStyle(PleaseWait[0]).backgroundColor;
                                        //console.log(MainButtonColor);
                                        console.log("Please Wait Button Detected :" + MainButtonColor + " | Lets keep trying ..");

                                        if (MainButtonColor === 'rgb(255, 224, 0)') {
                                                // Color of Button Changes to yellow then click again
                                                let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;
                                                //
                                                console.log("Add to Cart is available:" + ATC_Color + " | Lets Bag This ! ");
                                                var ATCYellowButton = document.getElementsByClassName("btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button");
                                                ATCYellowButton[0].click()
                                                //Wait for 10 seconds and press go Go to cart button
                                                setTimeout(function(){
                                                        // Press secondary button
                                                        var GotoCartButton = document.getElementsByClassName("c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block");
                                                        // Press ATC button again
                                                        //
                                                        GotoCartButton[0].click()
                                                }, 10000)

                                        }
                                        else {
                                        // Is queue bypass available ?
                                        // If available lets check add to cart button instanly
                                         // Press secondary button
                                                console.log("Checking bypass")
                                                var GotoCartButton = document.getElementsByClassName("c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block");
                                                if (InStockButton.length > 0) {
                                                        GotoCartButton[0].click()
                                                //
                                                }
                                            //
                                                // Press ATC button again
                                                //
                                        }
                                        //

                                    }, 5*1000);

                                    RETRY_COUNT++;

                                },3000)

                            }
                            else {
                                setTimeout(function(){
                                    // Press secondary button
                                    var GotoCartButton = document.getElementsByClassName("c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block");
                                    // Press ATC button again
                                    //
                                    GotoCartButton[0].click()
                                }, 10000)

                            }


                        }, 5000); //Two seconds will elapse and Code will execute.
                        //
                }

        }
}

// CART PAGE OPERATIONS

else if (location.href.includes("www.bestbuy.com/cart")) {
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
            //
        }
    }, 3000 )//Three seconds will elapse and Code will execute.

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







