<img src="resources/new_logo.gif">

[![Discord](https://img.shields.io/discord/863863008329596968?color=%237289da%20&label=FOR%20SUPPORT%20AND%20FAQs%20%20%7C%20JOIN%20DISCORD&style=for-the-badge)](https://discord.gg/wkznBbgBFD)

<br>

* **_Works with all/any of the Browsers_**

```
I took bits from best open and closed sourced bots and made this simple bot.
Please star my repo if this contribution helped you ! Its FREEE !

** CREDIT CARD INFORMATION IS NOT USED. BOT WILL ALSO RUN WITHOUT CVV INFORMATION; just not do FINAL CHECKOUT


Please Join Support & FAQ Discord if you have questions.

```
[<img src="https://raw.githubusercontent.com/kkapuria3/FREE-Amazon-BUY-Bot/main/resources/new_logo1.gif" width="350"/>](https://github.com/kkapuria3/FREE-Amazon-BUY-Bot#readme) [<img src="https://raw.githubusercontent.com/kkapuria3/Telegram-To-Discord-Forward-Bot/master/resources/new_logo.gif" width="350"/>](https://github.com/kkapuria3/Telegram-To-Discord-Forward-Bot#readme)

# BestBuy Bot — Open Source GPU/PS5/Xbox Bot

## Description

BestBuy Bot is an Add to cart and Auto Checkout Bot. This auto buying bot can search an item repeatedly on the item page using one keyword. Once the desired item is available it can add to cart and checkout very fast. This auto purchasing BestBuy Bot can work on Firefox Browser so it can run in all Operating Systems. It can run for multiple items simultaneously.

"Running a bot can increase your success chances only ; but does not guarantee that you will successfully cart each time. If you do not agree, then please do not use this code."

## Why???

I built this in response to the severe tech scalping situation that's happening right now. Almost every tech product that's coming out right now is being instantly brought out by scalping groups and then resold at at insane prices. $699 GPUs are being listed for $1700 on eBay, and these scalpers are buying 40 carts while normal consumers can't get a single one. Preorders for the PS5 are being resold for nearly $1000. My take on this is that if I release a bot that anyone can use, for free, then the number of items that scalpers can buy goes down and normal consumers can buy items for MSRP. If everyone is botting, then no one is botting.



## Getting Started

1. Create a [github](https://github.com/login?return_to=%2Fkkapuria3) account. It always helps !
2. Star this repository. Its FREE !
3. Please follow me here if you like my contribution: [<img src="https://p.kindpng.com/picc/s/726-7262336_deadpool-logo-pixel-art-hd-png-download.png" width="25"/>](https://github.com/kkapuria3)

### Dependencies

1. Install [Tampermonkey Extention](https://www.tampermonkey.net/)
2. BestBuy Account (Please be signed in) 
3. Please allow [Pop-Ups](https://www.isc.upenn.edu/how-to/configuring-your-web-browser-allow-pop-windows) for ```https://www.bestbuy.com/``` in your browser


### Installing

* Go to tampermonkey dashboard from broswer extension and create a new script
* Delete all the contents and copy full code from [best-buy-tm.js](https://raw.githubusercontent.com/kkapuria3/BestBuy-GPU-Bot/main/best-buy-tm.js)
* Save the script
* Updated REQUIRED FLAGS to your specifications

<img src="resources/flags.gif">

### [Youtube Video Tutorial] (https://www.youtube.com/watch?v=UL6tzc1gPmM)

### Testing/Strategies

Since BestBuy has queue system for when GPU/Consoles drop, testing bot is impossible outside the actual drop.
Its recommended to run the bot during/before the drop as drops occurs in waves over few mins to hours. Join our discord for historical drop data, FAQs and strategies.
[![Discord](https://img.shields.io/discord/863863008329596968?color=%237289da%20&label=FOR%20SUPPORT%20AND%20FAQs%20%20%7C%20JOIN%20DISCORD&style=for-the-badge)](https://discord.gg/wkznBbgBFD)


### Further Details

* Item Keyword corresponds to a keyword in your product name ( case sensitive | no spaces allowed )
	*_you can retrive ITEM_KEYWORD from the Black Title on a specific Products Page_*
```
const ITEM_KEYWORD= "3060";
```
* Credit Card CVV  (Not Required. BOT just wont do final checkout)
```
const CREDITCARD_CVV = "***";
```
* Test Mode "YES" will not purchase item. But do all the steps except pressing the last button. ```TESTMODE = "No" ``` will purchase the item.
```
const TESTMODE = "Yes"
``` 
* Enter last 4 digits of phone # for SMS verification (optional)
```
const SMS_DIGITS = "****"
``` 

## Workflow

This tool is designed to multitask. That means, it can run in many tabs simultaneously, if there is a ```ITEM_KEYWORD``` overlap.
If there is no ```ITEM_KEYWORD``` overlap. You will need to create a new copy of script for each ```ITEM_KEYWORD```.

Please make sure your CART is empty.

After updating variables and enabling the script in Tampermonkey, go to the your favourite GPU page in BestBuy.
If the Title of GPU has ```ITEM_KEYWORD```, it will add the item to cart and checkout. If item is out of stock it will keep on refreshing every 5 seconds.

Please use ```TESTMODE = "Yes"``` to test with an item already in stock.

## Authors

* Karan Kapuria

<a href="https://www.buymeacoffee.com/kapuriakaran" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>


## Version History and Changelog


* 1.0 Initial Release 
* 1.1 Handle Please Wait Gracefully
	* If Please Wait button shows up, bot will check every for second ATC button every 20 seconds
	* Whenever second ATC button appears, it will click and checkout
	* Reading Logs in Console
* 2.0 - 'Please Wait...' items can now be CARTED and CHECKEDOUT
 	* If "Please Wait" button shows up, it will enter a loop of retries which will check the color of button.
 	* As long as button stays Gray, it will try and check for Yellow Color
 	* Whenever Yellow ATC button appears again, it will click and checkout
 	* Status Bar is now being added at bottom
 	* Status Bar now shows version and TESTMODE variable	
* 2.5 - 'Fixed Memory Leak' no more refresh ! We will recycle tabs.
	* Due to constant reloading of OOS items, memory on your browser slowly blows up
	* We will now kill the tab if item is OOS and open it in new page. Doing this infact reduces the total RAM usage.
	* Button clicks no more use .click() but instead use EventListeners()
	* Status Bar is now 50% of screen.  Little taller so last line is visible when page is loading.
	* Status Bar now shows ITEM_KEYWORD
	* We will now play a music when item is carted.
	* Since BB asks for verifying account sometimes. Alert will help so that you dont miss checkout.
	* MAX_RETRIES will now control when your page gets reloaded when you are stuck on please wait screen. In this case it will perform normal reload.
* 3.0 -  Conjuction with 'Nerd Speak' Extension
  	* MAJOR CHANGE: BOT ONLY WORKS FOR CHROME NOW (Version 2.5 and older are all browser compatible)
  	* Bot will now extract queue time from NS extension
  	* QUEUE_TIME_CUTOFF will keep requesting better queue times until target value is reached
  	* NEW_QUEUE_TIME_DELAY is delay in seconds between requesting new queue times.
  	* Status Bar is 75px fixed
  	* Status Bar now shows more information
  	* Since BB asks for verifying account sometimes. Alert will help so that you dont miss checkout.
  	* MAX_RETRIES will be deprecated in future.	
* 3.1 Best Buy disabled 5800-5600x tests
	* Best Buy has disabled 'Please Wait' testing for 5600-5800 , they also updated their button classes.
	* I have Added extra layer of code which will handle for new button classes.
	* `Please Wait` functionality should still work if layer we added is not activated.
* 3.2 Extra Button Class Layers Added
	* Button classes layered into 'if else'  loops
	* When 1st ATC is pressed. 'Adding..' takes about 4-6 seconds. We double check gray color for 'Please Wait'.
	* If not Please Wait then 2nd ATC is triggered
* 3.3 Button layers are reinforced
	* Easy edit button classes and better console logs.
* 3.4 GotoCart Button Class Layers and some bug fixes
	* Added check for CVV element to avoid error when element is not present
* 3.5 Handler for entering last 4 digits for SMS verification
	* https://stackoverflow.com/questions/49509874/how-can-i-develop-my-userscript-in-my-favourite-ide-and-avoid-copy-pasting-it-to
* 3.6 Added several Button Class Layers and updated to click new Verify Your Account button
	* Updated NEW_QUEUE_TIME_DELAY flag to change how often new queue time is requested
* 3.7 Removed Nerdspeak Integration
	* Commented out Nerdspeak Integration due to possible account flagging by Best Buy causing queue looping
* 4.0 BB Queue Timer and Sign-In on Container tabs
	* Added QueueTimer Functions - Queue Timer is now shown on bot UI during please wait
	* Increase Verfication Time from 1.5 - 2.5s
	* Automatic 5 seconds signin after cart when running on private container tabs
	* QueueTimer Functions gets called when really please wait is detected
	* Updated Bot Messages 



## License

This project is licensed under the MIT License - see the LICENSE.md file for details
