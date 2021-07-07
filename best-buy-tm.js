// ==UserScript==
// @name     BestBuy-RefreshNoBot
// @include  https://www.bestbuy.com/*
// @version      1.0
// @description  This aint bot, its RefreshNoBot
// @author       Karan Kapuria


// Version Changelog
// 1.0 - Initial release
// - Testmode for checking bot
// - Saved Credit Card CVV use
// ==/UserScript==


/*
  _____       __               _     _   _  ____  ____        _   
 |  __ \     / _|             | |   | \ | |/ __ \|  _ \      | |  
 | |__) |___| |_ _ __ ___  ___| |__ |  \| | |  | | |_) | ___ | |_ 
 |  _  // _ \  _| '__/ _ \/ __| '_ \| . ` | |  | |  _ < / _ \| __|
 | | \ \  __/ | | | |  __/\__ \ | | | |\  | |__| | |_) | (_) | |_ 
 |_|  \_\___|_| |_|  \___||___/_| |_|_| \_|\____/|____/ \___/ \__|
                                                                  
                                                                  */

"use strict";

var ITEM_KEYWORD= "***";
var CREDITCARD_CVV = "***";
var TESTMODE = "1"; // TESTMODE = "0" will buy the card


function createBadge() {
  const iconUrl =
    "https://kkapuria3.github.io/images/KK.png";
  const $container = document.createElement("div");
  const $bg = document.createElement("div");
  const $link = document.createElement("a");
  const $img = document.createElement("img");

  $link.setAttribute("href", "https://github.com/kkapuria3");
  $link.setAttribute("target", "_blank");
  $link.setAttribute("title", "RefreshNoBot");
  $img.setAttribute("src", iconUrl);

  $container.style.cssText =
    "position:fixed;left:0;bottom:0;width:80px;height:65px;background: transparent;z-index: 1000;transition: all 500ms ease; transform: translate(-80px, 80px);";
  $bg.style.cssText =
    "position:absolute;left:-100%;top:0;width:200px;height:180px;transform:rotate(45deg);background:#000;box-shadow: 0px 0 10px #060303; border: 1px solid #FFF;";
  $link.style.cssText =
    "position:absolute;display:block;top:2px;left: 0px; z-index:10;width: 60px;height:60px;border-radius: 10px;overflow:hidden;";
  $img.style.cssText = "display:block;width:100%";
  $link.appendChild($img);
  $container.appendChild($bg);
  $container.appendChild($link);
  return $container;
}


// Get Page Title
var pagetitle = String(document.title);

if (pagetitle.includes(ITEM_KEYWORD)) {
    //Create Custom Badge
    //
    const $badge = createBadge();
    document.body.appendChild($badge);
    setTimeout(() => {$badge.style.transform = "translate(0, 0)";}, 0);
    //Out of Stock Button
    //
    var OOSButton = document.getElementsByClassName("btn btn-disabled btn-lg btn-block add-to-cart-button");
    // If Out of Stock Button is Found. Refresh
    //
    if (OOSButton.length > 0) {
            console.log('Out of Stock Button is Detected')
            setTimeout(function(){ location.reload(); }, 20*100);
    }
    // If Out of Stock Button is Not Found. Check for Add to Cart Button
    //
    else {
        console.log('Disable button not found, lets check if stock is available.')
        // Add to Cart Button
        var InStockButton = document.getElementsByClassName("btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button");
        // Checking if ATC button is found
        if (InStockButton.length > 0) {
            console.log('Add to Cart Found')
            InStockButton[0].click()
            console.log('Add to Cart Button Clicked')
            //Time out for 5 seconds for items to load in your cart
            //
            setTimeout(function() {

                //Code to run After timeout elapses
                console.log('Waiting 10 Seconds to Get Cart Ready !!')
                var GotoCartButton = document.getElementsByClassName("c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block");
                // Press ATC button again
                //
                GotoCartButton[0].click()

             }, 5000); //Two seconds will elapse and Code will execute.
             //
        }

    }
}

// CART PAGE OPERATIONS

else if (location.href.includes("www.bestbuy.com/cart")) {

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
    const $badge = createBadge();
    document.body.appendChild($badge);
    setTimeout(() => {$badge.style.transform = "translate(0, 0)";}, 300);
    //
    //
    setTimeout(function() {
        //
        //document.getElementById("blah").src = "http://......"
        // CVV Number of Saved Card
        var AddCVV = document.getElementById("cvv").value = '534';
        //
            if(document.getElementById("text-updates") != null)
            {
                //
                var TextUpdates = document.getElementById("text-updates").click()
                //console.log(TextUpdates[0].checked)
            }
        if (TESTMODE === 0){
        //Is test mode is OFF go press place order button
        //
        var PLACE_ORDER = document.getElementByClassName("btn btn-lg btn-block btn-primary button__fast-track").click()
        //
        }
        //
        //
    }, 3000); //Three seconds will elapse and Code will execute.




}







