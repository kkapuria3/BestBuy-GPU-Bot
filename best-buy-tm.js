// ==UserScript==
// @name     BestBuy-RefreshNoBot
// @include  https://www.bestbuy.com/*
// @updateURL  https://raw.githubusercontent.com/kkapuria3/BestBuy-GPU-Bot/main/best-buy-tm.js
// @downloadURL https://raw.githubusercontent.com/kkapuria3/BestBuy-GPU-Bot/main/best-buy-tm.js
// @version      3.4
// @description  This aint bot, its RefreshNoBot
// @author       Karan Kapuria
// @grant        window.close

// Version Changelog
// 1.0 - Initial release
// 2.0 - 'Please Wait...' items can now be CARTED and CHECKEDOUT
// 2.5 - 'Fixed Memory Leak' no more refresh ! We will recycle tabs.
// 3.0 - Added Support for 'Nerd Speak' Extension
// - MAJOR CHANGE: BOT works for CHROME Now
// - Bot will now extract queue time from NS extension
// - QUEUE_TIME_CUTOFF will keep requesting better queue times until target value is reached
// - NEW_QUEUE_TIME_DELAY is delay in seconds between requesting new queue times.
// - Status Bar is now 75% of screen.  Little taller so last line is visible when page is loading.
// - Status Bar now shows ITEM_KEYWORD
// - We will now play a music when item is carted.
// - Since BB asks for verifying account sometimes. Alert will help so that you dont miss checkout.
// - MAX_RETRIES will now control when your page gets reloaded when you are stuck on please wait screen. In this case it will perform normal reload.
// 3.1 Best Buy disabled 5800-5600x tests
// - Best Buy has disabled 'Please Wait' testing for 5600-5800x, they also updated their button classes for them.
// - Added Extra layer of code which will handle for new button classes.
// - Please Wait functionality should still work if layer we added is not activated.
// 3.2 Extra Button Class Layers Added
// - Button classes layered into 'if else' loops
// - When 1st ATC is pressed. 'Adding..' takes about 4-6 seconds. We double check gray color for 'Please Wait'.
// - If not Please Wait then 2nd ATC is triggered
// 3.3 Button layers are reinforced
// - Easy edit button classes and better console logs.
// 3.4 GotoCart Button Class Layers and some bug fixes
// - Added check for CVV element to avoid error when element is not present
//https://stackoverflow.com/questions/49509874/how-can-i-develop-my-userscript-in-my-favourite-ide-and-avoid-copy-pasting-it-to


// ==/UserScript==

//rgb(197, 203, 213) pleasewait
//rgb(255, 224, 0) add to cart

/*
          (                            )           )
   (      )\ )  *   )     (         ( /(     (  ( /(   *   )
 ( )\ (  (()/(` )  /(   ( )\    (   )\())  ( )\ )\())` )  /(
 )((_))\  /(_))( )(_))  )((_)   )\ ((_)\   )((_|(_)\  ( )(_))
((_)_((_)(_)) (_(_())  ((_)_ _ ((_)_ ((_) ((_)_  ((_)(_(_())
 | _ ) __/ __||_   _|   | _ ) | | \ \ / /  | _ )/ _ \|_   _|
 | _ \ _|\__ \  | |     | _ \ |_| |\ V /   | _ \ (_) | | |
 |___/___|___/  |_|     |___/\___/  |_|    |___/\___/  |_|

                                                                  */
"use strict";
//________________________________________________________________________

                       //  CONSTANTS
    // [ Do not add/remove quotation marks when updating]
//________________________________________________________________________

//____ REQUIRED FLAGS ____________________________________________________

const ITEM_KEYWORD= "5600"; // NO SPACES IN KEYWORD - ONLY ONE WORD
const CREDITCARD_CVV = "***"; // BOT will run without changing this value.
const TESTMODE = "Yes"; // TESTMODE = "No" will buy the card

//____ PLEASE WAIT FLAGS : ADVANCED OPTIONS _____________________________

const QUEUE_TIME_CUTOFF = 3 // (in Minutes) Keep retrying until queue time is below.
const NEW_QUEUE_TIME_DELAY = 1 // (in Seconds) Ask new queue time set seconds

//____ LAZY FLAGS : WILL NOT AFFECT BOT PERFORMACE _____________________

const MAX_RETRIES = "200" // Fossil of EARTH

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
    var MAIN_TITLE = ("Open Source BB-Bot V3.3   ◻️   TESTMODE: " +TESTMODE + "   ◻️   ITEM KEYWORD: " + ITEM_KEYWORD);
    $text.innerText = MAIN_TITLE;
    $mode.innerText = mode;
    $status1.innerText = status;

    $container.style.cssText = "position:fixed;left:0;bottom:0;width:850px;height:75px;background: black;";
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
                    if (CartItemCheck[0].innerHTML.includes(ITEM_KEYWORD)){
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
            var GotoCartButton;
            const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block"
            const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block "

            if (document.getElementsByClassName(GotoCartButton_L1).length == 1)
                                                                {
                 GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
                 console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1)
            } else if (document.getElementsByClassName(GotoCartButton_L2).length == 1) {
                 GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
                 console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2)

            }

            // Press go to cart
            GotoCartButton[0].onclick = cartpageoperationsEvenHandler;
            GotoCartButton[0].addEventListener ("click", cartpageoperationsEvenHandler, false);
            // When a click event is detected for parsed element, please execute the function from uptop
            GotoCartButton[0].click (cartpageoperationsEvenHandler);
            GotoCartButton = null ;

    }, 4000)
}



//________________________________________________________________________

                  //  ITEM IN STOCK EventHandler
//________________________________________________________________________

function instockEventHandler(evt) {
        // After pressing Add to Cart button we first wait for 5 seconds to get cart ready. In this time we will check if it shows please wait
        // Add to Cart Button Classes Layers
        var InStockButton;
        const InStockButton_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button"
        const InStockButton_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button"

        if (document.getElementsByClassName(InStockButton_L1).length == 1)
        {
             InStockButton = document.getElementsByClassName(InStockButton_L1);
             console.log('instockEventHandler Button Class 1 : ' + InStockButton_L1)

        } else if (document.getElementsByClassName(InStockButton_L2).length == 1) {

            InStockButton = document.getElementsByClassName(InStockButton_L2);
            console.log('instockEventHandler Button Class  2 :' + InStockButton_L2)

        }

        setTimeout(function() {
         let MainButtonColor = window.getComputedStyle(InStockButton[0]).backgroundColor;
        //Code to run After timeout elapses
          console.log('Confirming Button Color : ' + MainButtonColor)

                if (MainButtonColor === 'rgb(197, 203, 213)') {

                        console.log('Button Color Gray. Is it still Adding ?')

                        setTimeout(function() {

                                var REALLY_PLEASE_WAIT = window.getComputedStyle(document.getElementsByClassName(InStockButton)[0]).backgroundColor

                                if (REALLY_PLEASE_WAIT === 'rgb(197, 203, 213)') {

                                        console.log('Its really Please Wait.')

                                        var MODE = "Trying to Cart 🛑 BOT WILL AUTOMATICALLY REFRESH !! "

                                        //
                                        var RETRY_COUNT = "1"
                                        // Run this every 5 seconds
                                        setInterval(function() {
                                                //Parsing New Time Button
                                                var BetterTime = document.evaluate('/html/body/div[3]/main/div[2]/div[3]/div[2]/div/div/div[7]/div[1]/div/div[2]/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                                //Parsing Time Remaining on Queue
                                                var time = document.evaluate('/html/body/div[3]/main/div[2]/div[3]/div[2]/div/div/div[7]/div[1]/div/div[2]/div/div/div/p[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;
                                                var TRIES = ("Request New Queue Time : " + NEW_QUEUE_TIME_DELAY + " Seconds ◻️ Minimum Queue Time Cut-off: " + QUEUE_TIME_CUTOFF + " Mins ◻️ " + time + " ◻️  Retry Count: " + RETRY_COUNT);
                                                const $badge = createFloatingBadge(MODE, TRIES);
                                                document.body.appendChild($badge);
                                                $badge.style.transform = "translate(0, 0)"
                                                // Run this every 20 seconds
                                                setTimeout(function() {

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
                                                                ATCYellowButton[0].addEventListener("click", pleasewaitcompletedEventHandler, false);
                                                                // When a click event is detected for parsed element, please execute the function from uptop
                                                                ATCYellowButton[0].click(pleasewaitcompletedEventHandler);
                                                                var soundData = new Audio("https://github.com/kkapuria3/BestBuy-GPU-Bot/blob/dev-v2.5-mem_leak_fix/resources/alert.mp3?raw=true");
                                                                soundData.play()

                                                        } else {
                                                                // Is queue bypass available ?
                                                                // If available lets check add to cart button instanly
                                                                // Press secondary button
                                                                console.log("Checking bypass")
                                                                var GotoCartButton;
                                                                const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block"
                                                                const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block "

                                                                if (document.getElementsByClassName(GotoCartButton_L1).length == 1)
                                                                {
                                                                     GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
                                                                     console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1)
                                                                } else if (document.getElementsByClassName(GotoCartButton_L2).length == 1) {
                                                                     GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
                                                                     console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2)

                                                                }

                                                                if (GotoCartButton.length > 0) {
                                                                        GotoCartButton[0].onclick = cartpageoperationsEvenHandler;
                                                                        GotoCartButton[0].addEventListener("click", cartpageoperationsEvenHandler, false);
                                                                        // When a click event is detected for parsed element, please execute the function from uptop
                                                                        GotoCartButton[0].click(cartpageoperationsEvenHandler);
                                                                        GotoCartButton = null;
                                                                        //
                                                                }

                                                                const regex = /(?<=Time Remaining: )(.*)(?= min)/g;
                                                                const found = time.match(regex);
                                                                console.log(found[0])
                                                                if (found[0] > QUEUE_TIME_CUTOFF) {
                                                                        let BetterTimeColor = window.getComputedStyle(BetterTime).backgroundColor
                                                                        BetterTime.click()
                                                                        console.log(BetterTimeColor)
                                                                        if (BetterTimeColor === 'rgb(197, 203, 213)') {
                                                                                //console.log('refresh')
                                                                                window.open(window.location.href, '_blank');
                                                                                window.close();
                                                                        }
                                                                }


                                                        }

                                                        //

                                                }, 5 * 1000);

                                                RETRY_COUNT++;
                                                if (RETRY_COUNT > MAX_RETRIES) {
                                                        location.reload();
                                                }

                                        }, NEW_QUEUE_TIME_DELAY * 1000)

                                } else {
                                        var soundData = new Audio("https://github.com/kkapuria3/BestBuy-GPU-Bot/blob/dev-v2.5-mem_leak_fix/resources/alert.mp3?raw=true");
                                         soundData.play()
                                        setTimeout(function() {
                                                // Press secondary button
                                                console.log('Level 2 | Blue Cart Button Appears')
                                                var GotoCartButton;
                                                const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block"
                                                const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block "

                                                if (document.getElementsByClassName(GotoCartButton_L1).length == 1)
                                                {
                                                     GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
                                                     console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1)
                                                } else if (document.getElementsByClassName(GotoCartButton_L2).length == 1) {
                                                     GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
                                                     console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2)

                                                }

                                                GotoCartButton[0].onclick = cartpageoperationsEvenHandler;
                                                GotoCartButton[0].addEventListener("click", cartpageoperationsEvenHandler, false);
                                                // When a click event is detected for parsed element, please execute the function from uptop
                                                GotoCartButton[0].click(cartpageoperationsEvenHandler);
                                                GotoCartButton = null;
                                        }, 6000) // If item is not please waited then it will open go to cart again. This only happens for in stock items

                                }

                        }, 3000)

                } else {
                        var soundData = new Audio("https://github.com/kkapuria3/BestBuy-GPU-Bot/blob/dev-v2.5-mem_leak_fix/resources/alert.mp3?raw=true");
                        soundData.play()
                        setTimeout(function() {
                                // Press secondary button
                                console.log('Level 1 | Blue Cart Button Appears')
                                var GotoCartButton;
                                const GotoCartButton_L1 = "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block"
                                const GotoCartButton_L2 = "c-button c-button-secondary c-button-sm c-button-block "

                                if (document.getElementsByClassName(GotoCartButton_L1).length == 1)
                                {
                                     GotoCartButton = document.getElementsByClassName(GotoCartButton_L1);
                                     console.log('GotoCartButton Class ID 1 : ' + GotoCartButton_L1)
                                } else if (document.getElementsByClassName(GotoCartButton_L2).length == 1) {
                                     GotoCartButton = document.getElementsByClassName(GotoCartButton_L2);
                                     console.log('GotoCartButton Class ID 2 :' + GotoCartButton_L2)

                                }

                                GotoCartButton[0].onclick = cartpageoperationsEvenHandler;
                                GotoCartButton[0].addEventListener("click", cartpageoperationsEvenHandler, false);
                                // When a click event is detected for parsed element, please execute the function from uptop
                                GotoCartButton[0].click(cartpageoperationsEvenHandler);
                                GotoCartButton = null;
                        }, 3000) // If item is not please waited then it will open go to cart again. This only happens for in stock items

                }



        }, 12000); //Two seconds will elapse and Code will execute.
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
        console.log('BEGIN ')
        document.body.appendChild($badge);
        $badge.style.transform = "translate(0, 0)"
        //Out of Stock Button
        //
        var OOSButton;
        const OOSButton_L1 = "c-button c-button-disabled c-button-lg c-button-block add-to-cart-button"
        const OOSButton_L2 = "btn btn-disabled btn-lg btn-block add-to-cart-button"
        console.log('BEGIN ')
        if (document.getElementsByClassName(OOSButton_L1).length == 1)
        {
            OOSButton = document.getElementsByClassName(OOSButton_L1);
            console.log('OOS Button Class 1 : ' + OOSButton_L1)
        }
        else if (document.getElementsByClassName(OOSButton_L2).length == 1)
        {
            OOSButton = document.getElementsByClassName(OOSButton_L2);
            console.log('OOS Button Class 2 : ' + OOSButton_L2)
         }
        else {

         // When OOS is not found this will have 0 length. We need have value in OOSButton to move forward
         OOSButton = document.getElementsByClassName("btn btn-disabled btn-lg btn-block add-to-cart-button");

         }

        // If Out of Stock Button is Found. Refresh

        if (OOSButton.length > 0 ) {
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

                // Add to Cart Button Classes Layers
                var InStockButton;
                const InStockButton_L1 = "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button"
                const InStockButton_L2 = "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button"

                if (document.getElementsByClassName(InStockButton_L1).length == 1)
                {
                     InStockButton = document.getElementsByClassName(InStockButton_L1);
                     console.log('InStockButton Class ID 1 : ' + InStockButton_L1)

                } else if (document.getElementsByClassName(InStockButton_L2).length == 1) {

                    InStockButton = document.getElementsByClassName(InStockButton_L2);
                    console.log('InStockButton Class ID 2 :' + InStockButton_L2)

                }

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
        //We will verify that the item in final checout screen matches the Keyword so we don't have any issues when running multiple scripts for multiple keyword.
        //In that case the Place Order button is clicked.
        //
        var CartItemCheck = document.getElementsByClassName("item-list__spacer text-left item-list__title");
        //console.log(CartItemCheck[0])
        //
        //
        if (CartItemCheck[0].innerHTML.includes(ITEM_KEYWORD)){
            //
            console.log('Item Has been Confirmed !')
            console.log('Click Place Order')

                //
                //document.getElementById("blah").src = "http://......"
                // CVV Number of Saved Card
                // Bug fix: by craz3drunner (discord member)
                document.getElementById("cvv").value = CREDITCARD_CVV;
                document.getElementById("cvv").focus();
                document.getElementById("cvv").select();
                if (!document.execCommand('insertText',false, CREDITCARD_CVV)) {
                    document.getElementById("cvv").value = CREDITCARD_CVV;
                }

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
        }
    }, 3000); //Three seconds will elapse and Code will execute.




}







